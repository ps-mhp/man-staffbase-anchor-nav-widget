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
 * Was der Konfigurationsdialog zeigt: ein Vollbild-Fenster „Links
 * bearbeiten“ am Feld `anchor-nav-config`, die Felder älterer Fassungen
 * (`heading`, `links`) ausgeblendet.
 *
 * Ist `anchor-nav-config` noch leer, beginnt das Fenster mit dem, was die
 * alten Felder des eigenen Dialogs tragen. Erst „Übernehmen“ schreibt es
 * nach `anchor-nav-config`; bis dahin gilt für die Seite weiter, was in den
 * alten Feldern steht.
 */

import * as React from "react";
import { Anchor } from "lucide-react";

import { FieldModalShellOptions, startFieldModalInjector } from "@shared/config-modal";
import { legacyFieldsFromSchema, readLegacyFields, startHiddenFields } from "@shared/legacy-fields";

import {
  AnchorNavConfig,
  LegacyAnchorNavValues,
  parseAnchorNavDraft,
  serializeAnchorNavConfig,
} from "./anchor-nav-config";
import { ANCHOR_NAV_CONFIG_ATTRIBUTE, LEGACY_ATTRIBUTES, configurationSchema } from "./configuration-schema";
import { anchorNavChangesStatus, validateAnchorNav } from "./link-editor-rules";

const LEGACY_FIELDS = legacyFieldsFromSchema(LEGACY_ATTRIBUTES, configurationSchema);

/** Die alten Felder, wie der eigene Dialog sie gerade führt; roh, auch übersetzte `b64:`-Werte. */
const readLegacyFromDialog = (root: ParentNode): LegacyAnchorNavValues =>
  readLegacyFields(LEGACY_FIELDS, ANCHOR_NAV_CONFIG_ATTRIBUTE, root).values;

/**
 * Der Editor kommt erst, wenn ein Dialog ihn zeigt: er baut auf
 * `@man/config-ui` und damit auf react-aria, und er lädt die Gliederung der
 * Seite. Nichts davon gehört ins Bündel, das jede Leserin lädt. Hier bleiben
 * nur Prüfung, Status und Hilfe – sie braucht der Rahmen vorher.
 */
const LazyLinkEditor = React.lazy(() => import("./link-editor").then((module) => ({ default: module.LinkEditor })));

const LOADING = <p className="p-6 text-sm text-muted-foreground">Editor wird geladen …</p>;

/** Läuft die Seite im Studio — und nicht als veröffentlichte Seite? */
export function isStudioPage(location: Location = window.location): boolean {
  return location.pathname.startsWith("/studio/");
}

/** Tasten und den Satz zu „Übernehmen“ ergänzt der Rahmen selbst. */
const HELP = (
  <ul className="flex list-disc flex-col gap-2 pl-5">
    <li>
      Links stehen die <strong>Links</strong> in der Reihenfolge der Navigation. Sortieren per Griff oder mit den
      Pfeilen über dem Formular.
    </li>
    <li>
      <strong>Neuer Link</strong> klappt die Auswahl auf: ein leerer Link oder die Suche über Überschriften und Widgets
      der Seite – live aus dem Editor, auch Ungespeichertes.
    </li>
    <li>
      Aus dem <strong>Seitenaufbau</strong> rechts ein Element in die Liste ziehen oder anklicken – das legt einen Link
      darauf an.
    </li>
    <li>
      Ein <strong>„!“</strong> in der Liste heißt: das Ziel fehlt auf der Seite. Der Link wird dort ausgeblendet.
    </li>
    <li>
      Der <strong>Linktext</strong> steht in der Navigation und ist Pflicht.
    </li>
    <li>
      Ein leeres <strong>Ziel</strong> springt zur Überschrift mit dem Linktext. Sonst der Text einer anderen
      Überschrift, eine Block-ID (#…) oder eine Adresse (/…, https://…, mailto:…).
    </li>
    <li>
      Der <strong>Titel</strong> rechts oben steht über den Links; leer bleibt die Zeile weg.
    </li>
    <li>Desktop, Tablet und Mobil zeigen die Navigation in Gerätebreite; auf dem Telefon klappt sie zu einem Knopf zusammen.</li>
  </ul>
);

/** Was der gemeinsame Rahmen von der Ankernavigation wissen muss. Offengelegt für Tests. */
export const linkEditorShell: FieldModalShellOptions<AnchorNavConfig> = {
  widgetName: "Ankernavigation",
  title: "Links bearbeiten",
  icon: Anchor,
  preview: true,
  help: HELP,
  statusText: anchorNavChangesStatus,
  validate: validateAnchorNav,
};

/**
 * Wartet auf den Konfigurationsdialog des Widgets, setzt das Fenster an die
 * Stelle von `anchor-nav-config` und blendet die alten Felder aus – beides
 * nur im eigenen Dialog.
 *
 * @param root der zu beobachtende Teilbaum; standardmäßig das Dokument.
 * @returns eine Funktion, die die Beobachtung beendet und alles abbaut.
 */
export function startLinkEditorInjector(root: ParentNode = document): () => void {
  const stopModal = startFieldModalInjector<AnchorNavConfig>({
    fieldKey: ANCHOR_NAV_CONFIG_ATTRIBUTE,
    root,
    reopenLabel: "Links bearbeiten",
    modalTestId: "link-editor-modal",
    reopenTestId: "link-editor-reopen",
    // Je Schlüssel das neue Feld, sonst das lesbare alte. Was nicht lesbar
    // war, fehlt im Entwurf und damit nach „Übernehmen“ im neuen Feld – dann
    // gilt weiter das alte.
    parse: (raw) => parseAnchorNavDraft(raw, readLegacyFromDialog(root)),
    serialize: serializeAnchorNavConfig,
    shell: linkEditorShell,
    render: ({ value, onChange }) => (
      <React.Suspense fallback={LOADING}>
        <LazyLinkEditor value={value} onChange={onChange} />
      </React.Suspense>
    ),
  });
  const stopHiding = startHiddenFields(LEGACY_ATTRIBUTES, ANCHOR_NAV_CONFIG_ATTRIBUTE, root);
  return () => {
    stopModal();
    stopHiding();
  };
}
