/*!
 * Copyright 2026, MHP Management und IT-Beratung GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Wohin ein Link springt, in Worten – für die Unterzeile in der Liste, den
 * Kopf des Formulars und die Auswahl der Seite.
 *
 * Kennt die Gliederung der Seite (`page-outline.ts`), wird aus `#<Block-ID>`
 * „Überschrift „Termine““ oder „Widget: Dateigalerie“; sonst bleibt die
 * Kennung stehen. Nur Anzeige: was der Link auf der Seite tut, entscheiden
 * weiter `linkKind` und `headingText`.
 */

import { AnchorLink, headingText, linkKind } from "./anchor-links";
import { baseBlockId, isBlockUuid } from "./block-id";
import { normalizeText } from "./heading-scan";
import { HeadingLevel, OutlineEntry } from "./page-outline";

export type LinkTargetKind =
  /** Zur Überschrift mit diesem Text (leeres Ziel: mit dem Linktext). */
  | "heading"
  /** Zu einem Block der Seite, der eine Überschrift ist. */
  | "page-heading"
  /** Zu einem Block der Seite, der ein Widget ist. */
  | "page-widget"
  /** Zu einer Block-ID, die die Gliederung (noch) nicht kennt. */
  | "block"
  /** Eine Adresse: /…, https://…, mailto:… */
  | "address";

export interface LinkTargetInfo {
  kind: LinkTargetKind;
  /** Die Unterzeile in der Liste, etwa „Überschrift „Termine““. */
  description: string;
  /** Die Ebene der Überschrift, wenn die Gliederung sie kennt. */
  level?: HeadingLevel;
}

/** Was ein leeres Ziel bedeutet; steht so auch in der Liste. */
export const EMPTY_TARGET_DESCRIPTION = "Leer – gleichnamige Überschrift";

/** Die Block-ID eines Ziels `#<id>`, sonst `null`. */
export function targetBlockId(link: AnchorLink): string | null {
  const target = link.target?.trim() ?? "";
  return target.startsWith("#") && target.length > 1 ? target.slice(1) : null;
}

/** Die Gliederung nach Block-ID, für schnelles Nachschlagen. */
export function outlineIndex(outline: readonly OutlineEntry[]): ReadonlyMap<string, OutlineEntry> {
  return new Map(outline.map((entry) => [baseBlockId(entry.blockId), entry]));
}

/** Das Element der Seite zu einer Block-ID, auch wenn die Stufe der Typoskala gewechselt hat. */
export const outlineEntryOf = (outline: ReadonlyMap<string, OutlineEntry>, blockId: string): OutlineEntry | undefined =>
  outline.get(baseBlockId(blockId));

/** Die Ebene der ersten Überschrift der Seite mit diesem Text. */
function levelOfText(text: string, outline: ReadonlyMap<string, OutlineEntry>): HeadingLevel | undefined {
  const wanted = normalizeText(text);
  for (const entry of outline.values()) {
    if (entry.kind === "heading" && normalizeText(entry.label) === wanted) return entry.level;
  }
  return undefined;
}

/** „Widget: USP-Box „Hauptwettbewerber““ oder, ohne Merkmal, „Widget: Dateigalerie“. */
function widgetDescription(entry: OutlineEntry): string {
  const name = entry.widget ?? entry.label;
  return name === entry.label ? `Widget: ${name}` : `Widget: ${name} „${entry.label}“`;
}

const withLevel = (info: LinkTargetInfo, level: HeadingLevel | undefined): LinkTargetInfo =>
  level === undefined ? info : { ...info, level };

export function describeTarget(link: AnchorLink, outline: ReadonlyMap<string, OutlineEntry>): LinkTargetInfo {
  const target = link.target?.trim() ?? "";
  if (target === "") {
    return withLevel({ kind: "heading", description: EMPTY_TARGET_DESCRIPTION }, levelOfText(link.label, outline));
  }
  const blockId = targetBlockId(link);
  if (blockId !== null) {
    const entry = outlineEntryOf(outline, blockId);
    if (entry?.kind === "heading") {
      return withLevel({ kind: "page-heading", description: `Überschrift „${entry.label}“` }, entry.level);
    }
    if (entry?.kind === "widget") return { kind: "page-widget", description: widgetDescription(entry) };
    return { kind: "block", description: target };
  }
  if (linkKind(link) === "url") return { kind: "address", description: target };
  return withLevel(
    { kind: "heading", description: `Überschrift „${target}“` },
    levelOfText(headingText(link), outline),
  );
}

/** Die Art des Links im Kopf des Formulars. */
export function targetKindText(kind: LinkTargetKind): string {
  return kind === "address" ? "Verweis auf eine Adresse" : "Sprungziel auf dieser Seite";
}

/**
 * Ob ein Element der Seite schon einen Link hat: über seine Block-ID oder –
 * bei Überschriften – über ihren Text, zu dem ein Link ohne Block-ID springt.
 */
export function linkedChecker(links: readonly AnchorLink[]): (entry: OutlineEntry) => boolean {
  const blockIds = new Set<string>();
  const headingTexts = new Set<string>();
  for (const link of links) {
    const blockId = targetBlockId(link);
    if (blockId !== null) blockIds.add(baseBlockId(blockId));
    else if (linkKind(link) === "heading") headingTexts.add(normalizeText(headingText(link)));
  }
  return (entry) =>
    blockIds.has(baseBlockId(entry.blockId)) || (entry.kind === "heading" && headingTexts.has(normalizeText(entry.label)));
}

/** Was die Liste zu einem Link sagt, dessen Ziel es auf der Seite nicht mehr gibt. */
export const MISSING_TARGET = "Ziel fehlt auf der Seite – in der Navigation ausgeblendet";

/**
 * Ob das Ziel eines Links auf der Seite fehlt: die Block-ID kennt die
 * Gliederung nicht, oder keine Überschrift trägt den gesuchten Text.
 * Adressen fehlen nie. Nur sinnvoll mit geladener Gliederung.
 */
export function isTargetMissing(link: AnchorLink, outline: ReadonlyMap<string, OutlineEntry>): boolean {
  if (link.label.trim() === "" && (link.target?.trim() ?? "") === "") return false;
  const blockId = targetBlockId(link);
  // Nur Block-IDs des Content Designers lassen sich prüfen; ein eigener
  // Anker wie `#kontakt` steht in keiner Gliederung.
  if (blockId !== null) return isBlockUuid(blockId) && outlineEntryOf(outline, blockId) === undefined;
  if (linkKind(link) === "url") return false;
  const wanted = normalizeText(headingText(link));
  for (const entry of outline.values()) {
    if (entry.kind === "heading" && normalizeText(entry.label) === wanted) return false;
  }
  return true;
}
