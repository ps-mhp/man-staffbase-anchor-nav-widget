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
 * Die Verweise stehen als JSON-Zeichenkette im Attribut `links`. Diese Datei
 * ist der einzige Ort, an dem aus dieser Zeichenkette Verweise werden — die
 * Darstellung bekommt nur noch fertige Objekte.
 *
 * Wie beim Portfolio: ein Tippfehler in einem Eintrag darf die anderen nicht
 * mitnehmen. Nur ein unlesbares Ganzes führt zur leeren Liste.
 */

import { slugify } from "./heading-scan";

export interface AnchorLink {
  /** Stabiler Schlüssel für React; fehlt er, wird er aus der Stelle vergeben. */
  id: string;
  /** Pflicht. Ein Eintrag ohne Linktext wird übersprungen. */
  label: string;
  /**
   * Wohin der Verweis führt. Leer: zur Überschrift mit dem Linktext. Sonst
   * der Text einer anderen Überschrift oder eine Adresse (siehe `linkKind`).
   */
  target?: string;
}

/** Macht `candidate` eindeutig innerhalb von `used` — wie `portfolio-tiles.ts`. */
function uniqueId(candidate: string, index: number, used: Set<string>): string {
  if (!used.has(candidate)) return candidate;

  let fallback = `${candidate}-${index}`;
  let suffix = 0;
  while (used.has(fallback)) {
    suffix += 1;
    fallback = `${candidate}-${index}-${suffix}`;
  }
  return fallback;
}

/** Leerraum weg; nur was danach übrig bleibt, zählt als gesetzt. */
function text(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/** Die rohe Eingabe als Array, oder `null`, wenn daraus nichts zu holen ist. */
function toArray(raw: unknown): unknown[] | null {
  // Ein fehlendes Attribut ist kein Fehler, sondern eine leere Liste.
  if (raw === undefined || raw === null) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "string") return null;

  const trimmed = raw.trim();
  if (trimmed === "") return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return null;
  }
  return Array.isArray(parsed) ? parsed : null;
}

export interface ParseAnchorLinksOptions {
  /**
   * Behält Einträge ohne Linktext mit `label: ""`. Nur für den Editor: ein
   * frisch hinzugefügter Eintrag ist genau das und verschwände sonst beim
   * nächsten Öffnen des Dialogs.
   */
  keepUnlabelled?: boolean;
}

/**
 * Liest das Attribut `links`. Wirft nie.
 *
 * @param raw die Zeichenkette aus dem Attribut oder ein bereits geparstes Array.
 * @returns die gültigen Verweise in ihrer Reihenfolge; eine leere Liste,
 *   wenn nichts gesetzt oder das Ganze unlesbar ist.
 */
export function parseAnchorLinks(raw: unknown, options?: ParseAnchorLinksOptions): AnchorLink[] {
  const entries = toArray(raw);
  if (entries === null) {
    console.warn("anchor-nav-widget: Das Feld „Links“ enthält kein gültiges JSON-Array.");
    return [];
  }

  const links: AnchorLink[] = [];
  const usedIds = new Set<string>();
  entries.forEach((entry, index) => {
    if (typeof entry !== "object" || entry === null) return;

    const source = entry as Record<string, unknown>;
    const label = text(source.label);
    if (label === undefined && options?.keepUnlabelled !== true) return;

    const id = uniqueId(text(source.id) ?? `link-${index}`, index, usedIds);
    usedIds.add(id);

    const link: AnchorLink = { id, label: label ?? "" };
    const target = text(source.target);
    if (target !== undefined) link.target = target;
    links.push(link);
  });

  return links;
}

/**
 * Schreibt die Verweise zurück in die Form des Attributs. Feste
 * Feldreihenfolge, damit derselbe Inhalt dieselbe Zeichenkette ergibt; ein
 * leeres Ziel fällt weg.
 */
export function serializeAnchorLinks(links: readonly AnchorLink[]): string {
  return JSON.stringify(
    links.map((link) => {
      const entry: Record<string, string> = { id: link.id, label: link.label };
      if (link.target !== undefined && link.target.trim() !== "") entry.target = link.target;
      return entry;
    }),
  );
}

/**
 * Eine Kennung, die auch ohne `crypto.randomUUID` eindeutig ist — der Dialog
 * läuft in fremden Seiten, in einem unsicheren Kontext fehlt die Web-Crypto-API.
 */
export function newLinkId(): string {
  const uuid = globalThis.crypto?.randomUUID;
  if (typeof uuid === "function") return uuid.call(globalThis.crypto);
  return `l-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Ein leerer Eintrag, wie ihn der Editor beim Hinzufügen einsetzt. */
export function emptyAnchorLink(): AnchorLink {
  return { id: newLinkId(), label: "" };
}

const URL_PREFIXES = ["#", "/", "http://", "https://", "mailto:"];

/**
 * Wie ein Eintrag springt.
 *
 * `url`: das Ziel ist eine Adresse, der Browser folgt ihr ohne Zutun des
 * Widgets. `heading`: der Eintrag sucht beim Klick die Überschrift, deren
 * Text dem Ziel (oder, ohne Ziel, dem Linktext) entspricht.
 */
export function linkKind(link: AnchorLink): "url" | "heading" {
  const target = link.target?.trim().toLowerCase() ?? "";
  return URL_PREFIXES.some((prefix) => target.startsWith(prefix)) ? "url" : "heading";
}

/** Der Text der Überschrift, zu der ein `heading`-Eintrag springt. */
export function headingText(link: AnchorLink): string {
  return link.target ?? link.label;
}

/**
 * Die Slugs für den URL-Hash, einer je Eintrag; `null` für Adressen.
 *
 * Aus dem Linktext und nicht aus dem Ziel: der Hash soll lesen, was der
 * Leser angeklickt hat. Gleiche Linktexte bekommen `-2`, `-3`; ein Text ohne
 * verwertbare Zeichen `abschnitt-N`.
 */
export function anchorSlugs(links: readonly AnchorLink[]): (string | null)[] {
  const taken = new Map<string, number>();
  return links.map((link, index) => {
    if (linkKind(link) === "url") return null;
    const base = slugify(link.label) || `abschnitt-${index + 1}`;
    const seen = taken.get(base) ?? 0;
    taken.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen + 1}`;
  });
}
