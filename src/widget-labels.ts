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
 * Wie ein eigener Block (`customBlock`) in der Auswahl heißt.
 *
 * Ältere Seiten speichern den Namen mit (`selectedBlock.name`), neuere – aus
 * Vorlagen oder kopiert – nur den Elementnamen (`customElementName`). Ohne
 * Namen stünde dort überall „Widget“. Deshalb: gespeicherter Name, sonst der
 * bekannte Name unserer Widgets, sonst der Elementname lesbar gemacht.
 *
 * Dazu, wo es eines gibt, das Merkmal dieses einen Blocks – Überschrift,
 * Titel oder die erste Folie –, damit drei USP-Boxen auf einer Seite nicht
 * gleich heißen.
 */

import { decodePayload } from "@shared/payload";

/** Die Namen unserer Widgets, wie Redakteure sie aus der Blockauswahl kennen. */
const KNOWN_WIDGETS: Readonly<Record<string, string>> = {
  "anchor-nav-widget": "Ankernavigation",
  "chart-widget": "Diagramm",
  "content-tabs": "Tabs",
  "custom-code-widget": "Eigener Code",
  "custom-editor-widget": "Custom Editor",
  "custom-widget-documentation": "Widget-Dokumentation",
  "data-comparison-widget": "Datenvergleich",
  "file-gallery-widget": "Dateigalerie",
  "form-display-widget": "Formular",
  "hero-slider-widget": "Hero-Slider",
  "hotspot-image-widget": "Bild mit Punkten",
  "infobox-widget": "Infobox",
  "navigation-widget": "Navigation",
  "podcast-display-widget": "Podcast",
  "portfolio-widget": "Portfolio",
  "post-display-widget": "Beitrag",
  "powerbi-widget": "Power BI",
  "ppt-engine-widget": "PowerPoint-Export",
  "project-timeline-widget": "Projektplan",
  "survey-display-widget": "Umfrage",
  "table-widget": "Tabelle",
  "usp-widget": "USP-Box",
};

/** Der Name, wenn gar nichts bekannt ist. */
export const UNKNOWN_WIDGET = "Widget";

/** Was ein `customBlock` über sich verrät – gespeichert wie live im Editor. */
export interface SelectedBlock {
  name?: unknown;
  customElementName?: unknown;
  properties?: unknown;
}

export interface WidgetLabel {
  /** Die Art, etwa „USP-Box“. */
  name: string;
  /** Das Merkmal dieses Blocks, etwa „Hauptwettbewerber“. */
  detail?: string;
}

const nonEmpty = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() !== "" ? value.replace(/\s+/g, " ").trim() : undefined;

/** „hero-slider-widget“ → „Hero Slider“. */
export function humanizeElementName(element: string): string {
  const words = element
    .replace(/-widget$/, "")
    .split(/[-_]+/)
    .filter((word) => word !== "");
  return words.length === 0 ? UNKNOWN_WIDGET : words.map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}

function widgetName(block: SelectedBlock): string {
  const element = nonEmpty(block.customElementName);
  return nonEmpty(block.name) ?? (element === undefined ? UNKNOWN_WIDGET : (KNOWN_WIDGETS[element] ?? humanizeElementName(element)));
}

/** Ein Wert der Blockeigenschaften als Objekt oder Liste – roh, als JSON oder als `b64:`. */
function parseProperty(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const text = decodePayload(value.trim()) ?? value.trim();
  if (!text.startsWith("{") && !text.startsWith("[")) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

/** Felder, die in unseren Konfigurationen den Block benennen – in dieser Reihenfolge. */
const TITLE_KEYS = ["heading", "title", "headline"] as const;

function titleOf(value: unknown): string | undefined {
  if (Array.isArray(value)) return value.length === 0 ? undefined : titleOf(value[0]);
  if (typeof value !== "object" || value === null) return undefined;
  const record = value as Record<string, unknown>;
  for (const key of TITLE_KEYS) {
    const title = nonEmpty(record[key]);
    if (title !== undefined) return title;
  }
  return undefined;
}

function widgetDetail(properties: unknown): string | undefined {
  if (typeof properties !== "object" || properties === null) return undefined;
  const record = properties as Record<string, unknown>;
  // Schlichte Attribute zuerst (`heading` der älteren Ankernavigation), dann
  // die verpackten Konfigurationen.
  const plain = titleOf(record);
  if (plain !== undefined) return plain;
  for (const value of Object.values(record)) {
    const title = titleOf(parseProperty(value));
    if (title !== undefined) return title;
  }
  return undefined;
}

/** Name und Merkmal eines eigenen Blocks; wirft nie. */
export function describeWidget(block: SelectedBlock | null | undefined): WidgetLabel {
  if (block === null || block === undefined) return { name: UNKNOWN_WIDGET };
  const name = widgetName(block);
  const detail = widgetDetail(block.properties);
  return detail === undefined || detail === name ? { name } : { name, detail };
}
