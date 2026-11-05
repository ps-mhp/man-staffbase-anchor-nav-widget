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

import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export const LEVEL_ATTRIBUTE = "level";
export const HEADING_ATTRIBUTE = "heading";
export const BLOCKS_ATTRIBUTE = "blocks";

/** Die Überschriftenebenen, die HTML kennt. */
export const HEADING_LEVELS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

export type HeadingLevel = (typeof HEADING_LEVELS)[number];

/** Die Ebene, die ohne Angabe gilt: h2 ist auf einer Staffbase-Seite die Abschnittsüberschrift. */
export const DEFAULT_LEVEL: HeadingLevel = "h2";

/**
 * Ob ohne Angabe nur Title- und Text-Blöcke zählen.
 *
 * An: Überschriften, die andere Widgets in ihrer eigenen Darstellung führen,
 * sind keine Abschnitte der Seite und gehören nicht ins Verzeichnis. Das ist
 * der Normalfall, deshalb die Vorgabe.
 */
export const DEFAULT_BLOCKS_ONLY = true;

/**
 * Das Schema des Konfigurationsdialogs.
 *
 * Genau eine Ebene, kein Bereich: das Verzeichnis ist flach, und eine
 * Mehrfachauswahl führte zu einer Liste, deren Reihenfolge niemand mehr
 * vorhersagt.
 *
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/
 */
export const configurationSchema: JSONSchema7 = {
  properties: {
    [LEVEL_ATTRIBUTE]: {
      type: "string",
      title: "Überschriftenebene",
      enum: [...HEADING_LEVELS],
      default: DEFAULT_LEVEL,
    },
    [HEADING_ATTRIBUTE]: {
      type: "string",
      title: "Titel",
      default: "",
    },
    [BLOCKS_ATTRIBUTE]: {
      type: "boolean",
      title: "Nur Überschriften aus Title- und Text-Blöcken",
      default: DEFAULT_BLOCKS_ONLY,
    },
  },
};

/**
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
 */
export const uiSchema: UiSchema = {
  [LEVEL_ATTRIBUTE]: {
    "ui:help":
      "Gesammelt werden alle Überschriften dieser Ebene auf der Seite, " +
      "in der Reihenfolge, in der sie dort stehen.",
  },
  [HEADING_ATTRIBUTE]: {
    "ui:help":
      "Die Zeile über der Liste, etwa „Auf einen Blick“. Bleibt das Feld " +
      "leer, steht dort nichts.",
  },
  [BLOCKS_ATTRIBUTE]: {
    "ui:help":
      "Ausgeschaltet zählen auch Überschriften, die andere Widgets in ihrer " +
      "eigenen Darstellung führen. Auf Seiten ohne Content Designer wirkt " +
      "der Schalter nicht — dort gibt es die Bausteine nicht, nach denen er " +
      "unterscheidet.",
  },
};

/**
 * Die gewählte Ebene. Ein unbekannter Wert ist kein Fehler, sondern die
 * Vorgabe: ein leeres Widget wäre für den Redakteur schwerer zu deuten als
 * ein Verzeichnis über h2.
 */
export function readLevel(raw: unknown): HeadingLevel {
  if (typeof raw !== "string") return DEFAULT_LEVEL;
  const candidate = raw.trim().toLowerCase();
  return (HEADING_LEVELS as readonly string[]).includes(candidate)
    ? (candidate as HeadingLevel)
    : DEFAULT_LEVEL;
}

/**
 * Ob nur Title- und Text-Blöcke zählen.
 *
 * Der Dialog führt einen Schalter, im DOM steht ein Attribut: `false` kommt
 * als Zeichenkette an, nicht als `boolean`. Nur ein ausdrückliches Nein
 * schaltet den Filter ab — ein fehlendes oder unverständliches Attribut ist
 * ein Block aus der Zeit vor dieser Einstellung, und für den gilt die Vorgabe.
 */
export function readBlocksOnly(raw: unknown): boolean {
  if (typeof raw === "boolean") return raw;
  if (typeof raw === "string" && raw.trim().toLowerCase() === "false") return false;
  return DEFAULT_BLOCKS_ONLY;
}
