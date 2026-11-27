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
 * Titel und Links der Ankernavigation in einem Attribut: `anchor-nav-config`.
 *
 * Bis 0.1.0-rc.17 lagen sie in zwei Feldern des Staffbase-Dialogs, `heading`
 * und `links`. Seit das Fenster „Links bearbeiten“ beides zeigt, muss es
 * beides auch gemeinsam übernehmen und verwerfen können – das geht nur mit
 * einem Feld, denn der Rahmen schreibt genau eines zurück.
 *
 * Die Einträge behalten ihre Form (`StoredAnchorLink`), nur der Ort ändert
 * sich. Ältere Inhalte tragen weiter nur die alten Felder. Gelesen wird
 * deshalb je Schlüssel: der Wert aus `anchor-nav-config`, sonst das alte
 * Attribut, sonst die Vorgabe. Fehlt `anchor-nav-config`, rendert ein Block
 * also genau wie bisher.
 *
 * Ein Schlüssel fehlt im neuen Attribut, solange das Fenster ihn nicht
 * kannte: Was im Dialog nicht lesbar war, wird nicht mit einer Vorgabe
 * überschrieben, sondern weggelassen – dann gilt weiter das alte Feld.
 */

import { decodePayload, encodePayload } from "@shared/payload";

import { AnchorLink, parseAnchorLinks, toStoredLinks } from "./anchor-links";
import { ANCHOR_NAV_CONFIG_ATTRIBUTE, HEADING_ATTRIBUTE, LINKS_ATTRIBUTE } from "./configuration-schema";
import { readHeading } from "./heading-text";

/** Der Entwurf des Fensters. Ein fehlender Schlüssel heißt: es gilt das alte Feld. */
export interface AnchorNavConfig {
  heading?: string;
  links?: AnchorLink[];
  /**
   * Die kleine Navigation am rechten Bildschirmrand (`anchor-rail.tsx`).
   * Fehlt der Schlüssel, ist sie an; gespeichert wird nur `false`.
   */
  rail?: boolean;
}

/** `anchor-nav-config`, wie es gespeichert ist; die Einträge noch roh. */
export interface StoredAnchorNavConfig {
  heading?: string;
  links?: readonly unknown[];
  rail?: boolean;
}

/** Die alten Felder, roh – vom Element oder aus dem Dialog gelesen. */
export interface LegacyAnchorNavValues {
  heading?: unknown;
  links?: unknown;
}

/** Was die Ansicht bekommt: der Titel fertig, die Links in der Form des Attributs `links`. */
export interface ResolvedAnchorNav {
  heading: string | null;
  links: unknown;
  /** Ob die Navigation am rechten Rand erscheint; Vorgabe an. */
  rail: boolean;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

/**
 * Liest `anchor-nav-config`; `null`, wenn dort nichts Brauchbares steht –
 * leer, kaputt kodiert oder kein Objekt. Dann gelten die alten Felder ganz.
 * Schlüssel mit falscher Form fallen weg und gelten damit als nicht gesetzt.
 */
export function readStoredConfig(raw: unknown): StoredAnchorNavConfig | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const value = parseJson(decodePayload(trimmed) ?? trimmed);
  if (!isRecord(value)) return null;
  return {
    ...(typeof value.heading === "string" ? { heading: value.heading } : {}),
    ...(Array.isArray(value.links) ? { links: value.links as unknown[] } : {}),
    ...(value.rail === false ? { rail: false } : {}),
  };
}

/** Schreibt die gespeicherte Form, kodiert wie die übrigen JSON-Attribute (`@shared/payload`). */
export function encodeStoredConfig(config: StoredAnchorNavConfig): string {
  const { heading, links, rail } = config;
  return encodePayload(
    JSON.stringify({
      ...(heading === undefined ? {} : { heading }),
      ...(links === undefined ? {} : { links }),
      ...(rail === false ? { rail: false } : {}),
    }),
  );
}

/** Schreibt den Entwurf nach `anchor-nav-config`; nur die Schlüssel, die er kennt. */
export function serializeAnchorNavConfig(config: AnchorNavConfig): string {
  return encodeStoredConfig({
    heading: config.heading,
    links: config.links === undefined ? undefined : toStoredLinks(config.links),
    rail: config.rail,
  });
}

/**
 * Was die Seite zeigt: je Schlüssel `anchor-nav-config`, sonst das alte
 * Attribut. Die Links kommen als Zeichenkette – aus dem neuen Attribut neu
 * geschrieben –, damit die Ansicht sie wie bisher nur bei echter Änderung
 * neu liest.
 */
export function resolveAnchorNav(attrs: Record<string, unknown>): ResolvedAnchorNav {
  const stored = readStoredConfig(attrs[ANCHOR_NAV_CONFIG_ATTRIBUTE]);
  return {
    heading: readHeading(stored?.heading ?? attrs[HEADING_ATTRIBUTE]),
    links: stored?.links === undefined ? attrs[LINKS_ATTRIBUTE] : JSON.stringify(stored.links),
    rail: stored?.rail !== false,
  };
}

/** Der alte Titel als Text des Entwurfs; ein übersetzter kommt aus seiner Hülle. */
function legacyHeading(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  return readHeading(raw) ?? "";
}

/**
 * Der Ausgangsstand des Fensters: `anchor-nav-config`, und für jeden
 * Schlüssel, den es nicht trägt, das alte Feld – sofern es lesbar war.
 * Einträge ohne Linktext bleiben: ein frisch angelegter ist genau das.
 *
 * @param raw der Wert des Feldes `anchor-nav-config`.
 * @param legacy die alten Felder des eigenen Dialogs; ein fehlender Wert war nicht lesbar.
 */
export function parseAnchorNavDraft(raw: string, legacy: LegacyAnchorNavValues): AnchorNavConfig {
  const stored = readStoredConfig(raw);
  const heading = stored?.heading ?? legacyHeading(legacy.heading);
  const linksSource = stored?.links ?? legacy.links;
  return {
    ...(heading === undefined ? {} : { heading }),
    ...(linksSource === undefined ? {} : { links: parseAnchorLinks(linksSource, { keepUnlabelled: true }) }),
    ...(stored?.rail === false ? { rail: false } : {}),
  };
}
