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

export const HEADING_ATTRIBUTE = "heading";
export const LINKS_ATTRIBUTE = "links";

/**
 * Das Schema des Konfigurationsdialogs.
 *
 * `links` steht als gewöhnliches Textfeld: Staffbase rendert den Dialog
 * selbst und kennt nur die Feldtypen von RJSF. Im Studio setzt
 * `link-editor-injector.ts` den eigenen Editor an seine Stelle — eine Zeile
 * je Verweis statt JSON-Rohtext. Erscheint er einmal nicht, bleibt das
 * Textfeld als Rückfallweg.
 *
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/
 */
export const configurationSchema: JSONSchema7 = {
  properties: {
    [HEADING_ATTRIBUTE]: {
      type: "string",
      title: "Titel",
      default: "",
    },
    [LINKS_ATTRIBUTE]: {
      type: "string",
      title: "Links",
      default: "[]",
    },
  },
};

/**
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
 */
export const uiSchema: UiSchema = {
  [HEADING_ATTRIBUTE]: {
    "ui:help":
      "Die Zeile über der Liste, etwa „Auf einen Blick“. Bleibt das Feld " +
      "leer, steht dort nichts.",
  },
  [LINKS_ATTRIBUTE]: {
    "ui:widget": "textarea",
    "ui:help":
      "Normalerweise steht hier der Link-Editor. Erscheint er nicht, lassen " +
      "sich die Links als JSON-Liste pflegen. Je Link sind möglich: label " +
      "(Pflicht) und target (optional: Text einer Überschrift oder eine " +
      'Adresse wie #…, /…, https://…). Beispiel: [{"label":"Ausstattung",' +
      '"target":"Ausstattung im Detail"}]',
  },
};
