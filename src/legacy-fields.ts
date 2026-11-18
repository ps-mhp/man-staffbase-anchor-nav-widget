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
 * Die Felder bis 0.1.0-rc.17 – `heading` und `links` – im Staffbase-Dialog:
 * lesen und ausblenden. Wie in der Podcast-Anzeige (`legacy-fields.ts`
 * dort), nur ohne Auswahlfelder: beide sind Textfelder und damit lesbar.
 *
 * Sie bleiben im Schema, damit der Dialog ihre Werte weiter führt – das
 * Fenster übernimmt sie beim ersten Öffnen als Ausgangsstand. Zu sehen sind
 * sie nicht mehr: zwei Wege zum selben Titel laden zu Widersprüchen ein.
 *
 * Nur im eigenen Dialog, dem Formular mit `anchor-nav-config`: Studio lädt
 * alle Widget-Bündel in dasselbe Dokument, und `root_<key>` ist
 * widgetübergreifend – `heading` hat auch die Infobox. Dokumentweit
 * ausgeblendet, verschwände dort ihr Feld.
 */

import { configFieldSelector } from "@shared/config-field-injector";

import { ANCHOR_NAV_CONFIG_ATTRIBUTE, HEADING_ATTRIBUTE, LINKS_ATTRIBUTE } from "./configuration-schema";
import type { LegacyAnchorNavValues } from "./anchor-nav-config";

const FIELD_MARK = '[id^="root_"], label[for^="root_"]';

const fieldKeyOf = (element: Element): string =>
  element instanceof HTMLLabelElement ? element.htmlFor : element.id;

/** Die ganze Zeile eines Feldes: der größte Vorfahre, der kein anderes Feld enthält. */
function rowOf(anchor: Element): HTMLElement {
  const key = fieldKeyOf(anchor);
  let row = anchor as HTMLElement;
  while (row.parentElement !== null && row.parentElement.tagName !== "FORM") {
    const parent = row.parentElement;
    const foreign = Array.from(parent.querySelectorAll(FIELD_MARK)).some((node) => fieldKeyOf(node) !== key);
    if (foreign) break;
    row = parent;
  }
  return row;
}

function anchorOf(root: ParentNode, key: string): Element | null {
  const id = `root_${key}`;
  return root.querySelector(`[id="${id}"]`) ?? root.querySelector(`label[for="${id}"]`);
}

/** Die Formulare, die das eigene Feld führen – nur dort wird gelesen und ausgeblendet. */
function ownForms(root: ParentNode): HTMLFormElement[] {
  const forms = Array.from(root.querySelectorAll(`[id="root_${ANCHOR_NAV_CONFIG_ATTRIBUTE}"]`)).map((field) =>
    field.closest("form"),
  );
  return Array.from(new Set(forms.filter((form): form is HTMLFormElement => form !== null)));
}

/**
 * Hält die Zeilen dieser Felder verborgen, solange der eigene Dialog sie zeigt.
 * @param keys die auszublendenden Felder.
 * @param root der zu beobachtende Teilbaum; offengelegt für Tests.
 * @returns eine Funktion, die aufhört und die Zeilen wieder zeigt.
 */
export function startHiddenFields(keys: readonly string[], root: ParentNode = document): () => void {
  const hidden = new Set<HTMLElement>();

  const apply = (): void => {
    for (const form of ownForms(root)) {
      for (const key of keys) {
        const anchor = anchorOf(form, key);
        if (anchor === null) continue;
        const row = rowOf(anchor);
        if (row.style.display !== "none") row.style.display = "none";
        hidden.add(row);
      }
    }
  };

  apply();
  const observer = new MutationObserver(apply);
  const target = root === document ? document.body : (root as Node);
  observer.observe(target, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    hidden.forEach((row) => {
      row.style.display = "";
    });
    hidden.clear();
  };
}

/** Der Wert eines Textfeldes im Formular, `undefined`, wenn es keins gibt. */
function textValue(form: ParentNode, key: string): string | undefined {
  const element = form.querySelector(configFieldSelector(key));
  return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? element.value : undefined;
}

/** Die alten Felder, wie der eigene Dialog sie gerade führt; leer ohne eigenen Dialog. */
export function readLegacyFromDialog(root: ParentNode = document): LegacyAnchorNavValues {
  const [form] = ownForms(root);
  if (form === undefined) return {};
  const heading = textValue(form, HEADING_ATTRIBUTE);
  const links = textValue(form, LINKS_ATTRIBUTE);
  return {
    ...(heading === undefined ? {} : { heading }),
    ...(links === undefined ? {} : { links }),
  };
}
