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
 * Das Fenster „Links bearbeiten“ im Rahmen von `@man/config-ui`, wie im
 * Screen: links die Liste der Links, in der Mitte der gewählte Link (Kopf
 * mit „Link 2 von 5“, Zielart und Aktionen, darunter Linktext und Ziel) und
 * die Auswahl aus der Seite, rechts „Navigation“ mit dem Titel. In den
 * Geräteansichten steht statt der Mitte die echte Navigation in
 * Gerätebreite; Liste und Titel bleiben bedienbar.
 *
 * Er schreibt nichts selbst zurück und zeichnet keine Knöpfe zum Übernehmen
 * oder Abbrechen: Kopf, Status, Rückgängig, Prüfung und Rückfrage kommen aus
 * dem Rahmen, das Zurückschreiben nach `anchor-nav-config` aus
 * `@shared/config-modal`. Nachgeladen wird er nur im Studio
 * (`link-editor-injector.tsx`).
 */

import * as React from "react";
import { ReactElement, useEffect, useMemo, useRef } from "react";
import { Field } from "@man/config-ui/form/field";
import { FormSection } from "@man/config-ui/form/form-section";
import { InspectorPanel } from "@man/config-ui/inspector/inspector-panel";
import { ConfigWorkspace } from "@man/config-ui/layout/config-workspace";
import { Input } from "@man/config-ui/primitives/input";
import { useConfigShell } from "@man/config-ui/shell/shell-context";
import { ItemActions } from "@man/config-ui/sidebar/item-actions";

import { AnchorLink } from "./anchor-links";
import { AnchorNavConfig } from "./anchor-nav-config";
import { describeTarget, linkedChecker, outlineIndex, targetKindText } from "./link-describe";
import { MISSING_LABEL, isUnlabelled } from "./link-editor-rules";
import { LinkPreview } from "./link-preview";
import { LinkSidebar } from "./link-sidebar";
import { OutlinePicker } from "./outline-picker";
import { OutlineEntry, loadStudioOutline } from "./page-outline";
import { OutlineState, outlineEntries, useOutline } from "./use-outline";
import { LinkList, useLinkList } from "./use-link-list";

export interface LinkEditorProps {
  value: AnchorNavConfig;
  onChange: (value: AnchorNavConfig) => void;
  /**
   * Lädt die Elemente der Seite für die Auswahl; Vorgabe ist die Seite, die
   * das Studio gerade bearbeitet. `null` als Lader: nur Eingabe von Hand.
   */
  loadOutline?: (() => Promise<OutlineEntry[] | null>) | null;
}

const NO_LINKS: AnchorLink[] = [];

const TARGET_HINT =
  "Leer springt zur gleichnamigen Überschrift. Sonst der Text einer anderen Überschrift, " +
  "eine #Block-ID, /Seite, https:// oder mailto:.";

const TITLE_HINT = "Steht über den Links. Leer lassen, wenn keine Überschrift nötig ist.";

const targetPlaceholder = (label: string): string =>
  label.trim() === "" ? "Leer = Überschrift mit dem Linktext" : `Leer = Überschrift „${label.trim()}“`;

interface LinkFormProps {
  list: LinkList;
  link: AnchorLink;
  outline: ReadonlyMap<string, OutlineEntry>;
}

/** Kopf und Felder des gewählten Links. */
function LinkForm({ list, link, outline }: LinkFormProps): ReactElement {
  const { issuesVisible } = useConfigShell();
  const labelRef = useRef<HTMLInputElement>(null);
  const { focusRequest, clearFocusRequest } = list;
  // Nur ein frisch angelegter Link holt den Fokus – nicht jeder Wechsel in
  // der Liste, sonst spränge die Tastatur beim Durchgehen ins Formular.
  useEffect(() => {
    if (focusRequest !== link.id) return;
    labelRef.current?.focus();
    clearFocusRequest();
  }, [focusRequest, clearFocusRequest, link.id]);

  const total = list.links.length;
  const missing = issuesVisible && isUnlabelled(link);

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h2 className="text-xl font-semibold text-foreground">{`Link ${list.index + 1} von ${total}`}</h2>
        <span className="text-[13px] text-muted-foreground" data-testid="link-kind">
          {targetKindText(describeTarget(link, outline).kind)}
        </span>
        <ItemActions
          className="ml-auto"
          noun="Link"
          onMoveBack={() => list.move(-1)}
          onMoveForward={() => list.move(1)}
          canMoveBack={list.index > 0}
          canMoveForward={list.index < total - 1}
          onDuplicate={list.duplicate}
          onDelete={list.remove}
        />
      </div>
      <FormSection title="Link">
        <Field
          label="Linktext"
          required
          error={missing ? `${MISSING_LABEL} – ohne ihn erscheint der Link nicht in der Navigation.` : undefined}
        >
          <Input
            ref={labelRef}
            className="h-10"
            data-testid={`link-label-${link.id}`}
            value={link.label}
            onChange={(event) => list.patch(link.id, { label: event.target.value })}
          />
        </Field>
        <Field label="Ziel" hint={TARGET_HINT}>
          <Input
            className="h-10"
            data-testid={`link-target-${link.id}`}
            value={link.target ?? ""}
            placeholder={targetPlaceholder(link.label)}
            onChange={(event) => {
              const target = event.target.value;
              list.patch(link.id, { target: target === "" ? undefined : target });
            }}
          />
        </Field>
      </FormSection>
    </>
  );
}

interface LinkMainProps {
  list: LinkList;
  outline: OutlineState | null;
  index: ReadonlyMap<string, OutlineEntry>;
}

/** Die Mitte: der gewählte Link auf Lesebreite (720 px), darunter die Auswahl aus der Seite. */
function LinkMain({ list, outline, index }: LinkMainProps): ReactElement {
  const isLinked = useMemo(() => linkedChecker(list.links), [list.links]);
  const { selected } = list;
  return (
    <div className="px-10 pt-6 pb-12 max-lg:px-6">
      <div className="flex max-w-[720px] flex-col gap-8">
        {selected === undefined ? (
          <p className="text-sm text-muted-foreground" data-testid="link-empty">
            Noch kein Link. Lege links über <strong>Neuer Link</strong> einen an oder wähle unten ein Element der
            Seite.
          </p>
        ) : (
          <LinkForm key={selected.id} list={list} link={selected} outline={index} />
        )}
        {outline !== null && (
          <FormSection title="Element der Seite hinzufügen" aside="legt einen neuen Link an">
            <OutlinePicker
              outline={outline}
              isLinked={isLinked}
              onPick={(entry) => list.append({ label: entry.label, target: `#${entry.blockId}` })}
            />
          </FormSection>
        )}
      </div>
    </div>
  );
}

/** Rechts: was für die ganze Navigation gilt. */
function NavigationInspector({
  heading,
  onChange,
}: {
  heading: string;
  onChange: (heading: string) => void;
}): ReactElement {
  return (
    <InspectorPanel title="Navigation">
      <div className="flex flex-col gap-6">
        <Field label="Titel" hint={TITLE_HINT}>
          <Input
            className="h-10"
            data-testid="link-heading"
            value={heading}
            onChange={(event) => onChange(event.target.value)}
          />
        </Field>
        <p className="rounded-md bg-secondary px-3.5 py-3 text-[13px] leading-normal text-muted-foreground">
          Die Links springen zu Überschriften und Widgets dieser Seite. Die Vorschau oben rechts zeigt die Navigation
          in Gerätebreite.
        </p>
      </div>
    </InspectorPanel>
  );
}

export function LinkEditor({ value, onChange, loadOutline = loadStudioOutline }: LinkEditorProps): ReactElement {
  const list = useLinkList(value.links ?? NO_LINKS, (links) => onChange({ ...value, links }));
  const outline = useOutline(loadOutline ?? undefined);
  const index = useMemo(() => outlineIndex(outlineEntries(outline)), [outline]);

  return (
    <div className="flex h-full min-h-0 w-full" data-testid="link-editor">
      <ConfigWorkspace
        className="flex-1"
        sidebar={
          <LinkSidebar
            links={list.links}
            outline={index}
            selectedId={list.selected?.id}
            onSelect={list.select}
            onAdd={list.addEmpty}
            onReorder={list.reorder}
          />
        }
        inspector={
          <NavigationInspector heading={value.heading ?? ""} onChange={(heading) => onChange({ ...value, heading })} />
        }
        preview={<LinkPreview config={value} />}
      >
        <LinkMain list={list} outline={outline} index={index} />
      </ConfigWorkspace>
    </div>
  );
}
