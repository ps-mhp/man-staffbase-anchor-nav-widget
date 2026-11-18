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

import { encodePayload } from "@shared/payload";
import { TranslationProvider } from "@shared/translation/carriers";

import { encodeStoredConfig, readStoredConfig } from "./anchor-nav-config";
import { ANCHOR_NAV_CONFIG_ATTRIBUTE, HEADING_ATTRIBUTE } from "./configuration-schema";
import { readHeading } from "./heading-text";

export { readHeading };

/** Muss dem Tag entsprechen, unter dem `index.tsx` das Widget anmeldet. */
export const ANCHOR_NAV_WIDGET_TAG = "anchor-nav-widget";

/** Kennzeichnet das Element mit dem Titel, in welcher Antwortform auch immer. */
export const HEADING_MARKER = "data-mhp-anchor-nav-heading";

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const toTranslatable = (heading: string | null): string | null =>
  heading === null ? null : `<p ${HEADING_MARKER}="1">${escapeHtml(heading)}</p>`;

/** Der übersetzte Titel; `null`, wenn die Antwort keinen trägt. */
function translatedHeading(html: string): string | null {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  const translated = doc.body.querySelector(`[${HEADING_MARKER}]`)?.textContent?.trim() ?? "";
  // Leer heißt verloren, nicht übersetzt — dann bleibt der Titel der Quellsprache.
  return translated === "" ? null : translated;
}

/**
 * Wie der Titel durch Staffbases Inhaltsübersetzung reist – im Feld `heading`,
 * wo er bis 0.1.0-rc.17 stand und bei Inhalten bleibt, deren Fenster seither
 * nicht übernommen wurde.
 *
 * Die Einträge der Liste brauchen das nicht: sie sind die Überschriften der
 * Seite und werden mit ihr übersetzt.
 */
export const anchorNavTranslationProvider: TranslationProvider = {
  id: `${ANCHOR_NAV_WIDGET_TAG}/${HEADING_ATTRIBUTE}`,
  label: "Ankernavigation",
  ref: { tagName: ANCHOR_NAV_WIDGET_TAG, attribute: HEADING_ATTRIBUTE },

  toTranslatable: (stored) => toTranslatable(readHeading(stored)),

  acceptsTranslated: (html) => html.includes(HEADING_MARKER),

  fromTranslated: (html, _stored) => {
    const translated = translatedHeading(html);
    return translated === null ? null : encodePayload(translated);
  },
};

/**
 * Dasselbe für den Titel in `anchor-nav-config`. Trägt das Feld keinen
 * Titel, gilt für die Seite `heading` – dann gibt es hier nichts zu tun,
 * und der Provider oben übersetzt ihn. Die Links reisen unverändert mit.
 */
export const anchorNavConfigTranslationProvider: TranslationProvider = {
  id: `${ANCHOR_NAV_WIDGET_TAG}/${ANCHOR_NAV_CONFIG_ATTRIBUTE}`,
  label: "Ankernavigation",
  ref: { tagName: ANCHOR_NAV_WIDGET_TAG, attribute: ANCHOR_NAV_CONFIG_ATTRIBUTE },

  toTranslatable: (stored) => toTranslatable(readHeading(readStoredConfig(stored)?.heading)),

  acceptsTranslated: (html) => html.includes(HEADING_MARKER),

  fromTranslated: (html, stored) => {
    const config = readStoredConfig(stored);
    const translated = translatedHeading(html);
    if (config?.heading === undefined || translated === null) return null;
    return encodeStoredConfig({ ...config, heading: translated });
  },
};
