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

/**
 * Titel und Links in einem Feld — siehe `anchor-nav-config.ts`. Der Name
 * trägt das Widget: Editoren hängen sich über `root_<Attribut>` ein, ohne
 * das Widget zu kennen, und `heading` hat auch die Infobox.
 */
export const ANCHOR_NAV_CONFIG_ATTRIBUTE = "anchor-nav-config";
export const HEADING_ATTRIBUTE = "heading";
export const LINKS_ATTRIBUTE = "links";

/**
 * Die Felder bis 0.1.0-rc.17. Sie stehen weiter im Schema, damit der Dialog
 * ihre Werte führt: das Fenster „Links bearbeiten“ übernimmt sie beim ersten
 * Öffnen als Ausgangsstand, und solange `anchor-nav-config` einen Schlüssel
 * nicht trägt, gilt für die Seite weiter das alte Feld. Zu sehen sind sie im
 * eigenen Dialog nicht mehr (`@shared/legacy-fields`).
 */
export const LEGACY_ATTRIBUTES = [HEADING_ATTRIBUTE, LINKS_ATTRIBUTE] as const;

/**
 * Das Schema des Konfigurationsdialogs.
 *
 * Zu sehen ist nur `anchor-nav-config`, und auch das nicht selbst: im Studio
 * tritt an seine Stelle der Knopf zum Fenster „Links bearbeiten“
 * (`link-editor-injector.tsx`), in dem Titel und Links gepflegt werden.
 * Staffbase rendert den Dialog selbst und kennt nur die Feldtypen von RJSF;
 * erscheint das Fenster einmal nicht, bleibt das Textfeld als Rohfassung.
 *
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/
 */
export const configurationSchema: JSONSchema7 = {
  properties: {
    [ANCHOR_NAV_CONFIG_ATTRIBUTE]: {
      type: "string",
      title: "Ankernavigation",
      default: "",
    },
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

/** Alle Attribute, in der Reihenfolge des Schemas: das neue zuerst, dann die alten. */
export const ALL_ATTRIBUTES: string[] = Object.keys(configurationSchema.properties ?? {});

/**
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
 */
export const uiSchema: UiSchema = {
  [ANCHOR_NAV_CONFIG_ATTRIBUTE]: {
    "ui:help":
      "Titel und Links werden im Fenster „Links bearbeiten“ gepflegt; das " +
      "Textfeld dahinter ist die Rohfassung.",
  },
  [HEADING_ATTRIBUTE]: {
    "ui:help": "Ältere Fassung; gilt, solange im Fenster kein Titel übernommen wurde.",
  },
  [LINKS_ATTRIBUTE]: {
    "ui:widget": "textarea",
    "ui:help": "Ältere Fassung; gilt, solange im Fenster keine Links übernommen wurden.",
  },
};
