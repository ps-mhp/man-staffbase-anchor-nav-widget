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
 * Das Fenster „Links bearbeiten“ im Rahmen von `@man/config-ui`: links die
 * Liste der Links, in der Mitte entweder der gewählte Link (Kopf mit „Link 2
 * von 5“, Zielart und Aktionen, darunter Linktext und Ziel) oder – nach
 * „+ Neuer Link“ – der Seitenplan (`page-map-view.tsx`): die Überschriften
 * und Widgets als Kästen, angeordnet wie im Entwurf. Rechts nur, was für die
 * ganze Navigation gilt: Titel und die Navigation am Bildschirmrand. In den
 * Geräteansichten steht statt der Mitte die echte Navigation in Gerätebreite.
 *
 * Die Seite kommt im Studio live aus dem Editor (auch Ungespeichertes) und
 * folgt jeder Änderung dort; ein Link, dessen Ziel fehlt, trägt in der Liste
 * ein „!“ und fehlt in der Vorschau wie auf der Seite.
 *
 * Er schreibt nichts selbst zurück und zeichnet keine Knöpfe zum Übernehmen
 * oder Abbrechen: Kopf, Status, Rückgängig, Prüfung und Rückfrage kommen aus
 * dem Rahmen, das Zurückschreiben nach `anchor-nav-config` aus
 * `@shared/config-modal`. Nachgeladen wird er nur im Studio
 * (`link-editor-injector.tsx`).
 */

import * as React from "react";
import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { Field } from "@man/config-ui/form/field";
import { FormSection } from "@man/config-ui/form/form-section";
import { Note } from "@man/config-ui/form/note";
import { SwitchRow } from "@man/config-ui/form/switch-row";
import { InspectorPanel } from "@man/config-ui/inspector/inspector-panel";
import { ConfigWorkspace } from "@man/config-ui/layout/config-workspace";
import { Button } from "@man/config-ui/primitives/button";
import { Input } from "@man/config-ui/primitives/input";
import { useConfigShell } from "@man/config-ui/shell/shell-context";
import { ItemActions } from "@man/config-ui/sidebar/item-actions";
import { ExternalDrop } from "@man/config-ui/sidebar/item-list";

import { AnchorLink } from "./anchor-links";
import { AnchorNavConfig } from "./anchor-nav-config";
import { baseBlockId } from "./block-id";
import {
  describeTarget,
  isTargetMissing,
  outlineIndex,
  targetBlockId,
  targetKindText,
} from "./link-describe";
import { MISSING_LABEL, isUnlabelled } from "./link-editor-rules";
import { useLinkEditorPresence } from "./link-editor-presence";
import { LinkPreview } from "./link-preview";
import { LinkSidebar } from "./link-sidebar";
import { OutlineSource, studioOutlineSource } from "./outline-source";
import { OutlineEntry } from "./page-outline";
import { OUTLINE_DRAG_TYPE, PageMapView } from "./page-map-view";
import { OutlineState, outlineEntries, useOutline } from "./use-outline";
import { LinkList, useLinkList } from "./use-link-list";
import { normalizeText } from "./heading-scan";

export interface LinkEditorProps {
  value: AnchorNavConfig;
  onChange: (value: AnchorNavConfig) => void;
  /**
   * Woher die Elemente der Seite kommen; Vorgabe ist der offene Editor des
   * Studios, sonst die gespeicherte Seite. `null`: nur Eingabe von Hand.
   */
  outlineSource?: OutlineSource | null;
}

const NO_LINKS: AnchorLink[] = [];

const TARGET_HINT =
  "Leer springt zur gleichnamigen Überschrift. Sonst der Text einer anderen Überschrift, " +
  "eine #Block-ID, /Seite, https:// oder mailto:.";

const TITLE_HINT = "Steht über den Links. Leer lassen, wenn keine Überschrift nötig ist.";

const targetPlaceholder = (label: string): string =>
  label.trim() === "" ? "Leer = Überschrift mit dem Linktext" : `Leer = Überschrift „${label.trim()}“`;

/** Ein neuer Link auf ein Element der Seite: sein Text, seine Block-ID ohne Stufe. */
export const linkToEntry = (entry: OutlineEntry): Omit<AnchorLink, "id"> => ({
  label: entry.label,
  target: `#${baseBlockId(entry.blockId)}`,
});

/** Der vorhandene Link auf dieses Element, falls es einen gibt. */
function linkOfEntry(links: readonly AnchorLink[], entry: OutlineEntry): AnchorLink | undefined {
  const base = baseBlockId(entry.blockId);
  return links.find((link) => {
    const blockId = targetBlockId(link);
    if (blockId !== null) return baseBlockId(blockId) === base;
    return entry.kind === "heading" && normalizeText(link.target ?? link.label) === normalizeText(entry.label);
  });
}

interface LinkFormProps {
  list: LinkList;
  link: AnchorLink;
  outline: ReadonlyMap<string, OutlineEntry>;
  missing: boolean;
}

/** Kopf und Felder des gewählten Links. */
function LinkForm({ list, link, outline, missing }: LinkFormProps): ReactElement {
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
  const unlabelled = issuesVisible && isUnlabelled(link);

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
      {missing && (
        <div className="flex flex-col gap-3" data-testid="link-missing">
          <Note tone="warning">
            Das Ziel gibt es auf der Seite nicht mehr – die Überschrift oder das Widget wurde gelöscht oder umbenannt.
            In der Navigation wird der Link ausgeblendet. Ziel neu wählen oder den Link entfernen.
          </Note>
          <div>
            <Button variant="outline" size="sm" onClick={list.remove} data-testid="link-missing-remove">
              Link entfernen
            </Button>
          </div>
        </div>
      )}
      <FormSection title="Link">
        <Field
          label="Linktext"
          required
          error={unlabelled ? `${MISSING_LABEL} – ohne ihn erscheint der Link nicht in der Navigation.` : undefined}
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

type MainMode = "link" | "map";

/** Der Entwurf mit Navigation am Rand an (Schlüssel fehlt) oder aus (`rail: false`). */
function withRail(value: AnchorNavConfig, rail: boolean): AnchorNavConfig {
  const next: AnchorNavConfig = { ...value, rail: false };
  if (rail) delete next.rail;
  return next;
}

interface PageMapPanelProps {
  outline: OutlineState | null;
  list: LinkList;
  linkOf: (entry: OutlineEntry) => AnchorLink | undefined;
  onActivate: (entry: OutlineEntry) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  onAddEmpty: () => void;
  onDone: (() => void) | undefined;
}

/** „+ Neuer Link“: der Seitenplan zum Anklicken. */
function PageMapPanel({
  outline,
  list,
  linkOf,
  onActivate,
  editingId,
  setEditingId,
  onAddEmpty,
  onDone,
}: PageMapPanelProps): ReactElement {
  return (
    <div className="flex flex-col gap-5" data-testid="link-map-panel">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="text-xl font-semibold text-foreground">Element der Seite verlinken</h2>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={onAddEmpty} data-testid="add-empty-link">
            Leerer Link
          </Button>
          {onDone !== undefined && (
            <Button size="sm" onClick={onDone} data-testid="link-map-done">
              Fertig
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Klick auf eine Überschrift oder ein Widget legt einen Link an – den Linktext änderst du direkt im Kasten.
        Verlinktes steht in Blau. Kästen lassen sich auch in die Liste links ziehen; <strong>Leerer Link</strong> ist
        für Adressen oder eigene Ziele.
      </p>
      <PageMapView
        outline={outline}
        linkOf={linkOf}
        editingId={editingId}
        onActivate={onActivate}
        onLabelChange={(link, label) => list.patch(link.id, { label })}
        onUnlink={(link) => {
          list.removeId(link.id);
          setEditingId(null);
        }}
        onEditEnd={() => setEditingId(null)}
      />
    </div>
  );
}

interface LinkMainProps {
  list: LinkList;
  index: ReadonlyMap<string, OutlineEntry>;
  outlineReady: boolean;
}

/** Die Mitte im Modus „Link“: der gewählte Link auf Lesebreite (720 px). */
function LinkMain({ list, index, outlineReady }: LinkMainProps): ReactElement {
  const { selected } = list;
  return selected === undefined ? (
    <p className="text-sm text-muted-foreground" data-testid="link-empty">
      Noch kein Link. Über <strong>Neuer Link</strong> eine Überschrift oder ein Widget der Seite wählen.
    </p>
  ) : (
    <LinkForm
      key={selected.id}
      list={list}
      link={selected}
      outline={index}
      missing={outlineReady && isTargetMissing(selected, index)}
    />
  );
}

const RAIL_HINT =
  "Auf Desktop und Tablet erscheint beim Scrollen rechts am Bildschirmrand eine kleine Navigation: " +
  "sie zeigt, wo man auf der Seite steht, und springt mit den Pfeilen von Abschnitt zu Abschnitt.";

interface NavigationInspectorProps {
  heading: string;
  rail: boolean;
  onHeadingChange: (heading: string) => void;
  onRailChange: (rail: boolean) => void;
}

/** Rechts: nur, was für die ganze Navigation gilt. */
function NavigationInspector({ heading, rail, onHeadingChange, onRailChange }: NavigationInspectorProps): ReactElement {
  return (
    <InspectorPanel title="Navigation">
      <div className="flex flex-col gap-6">
        <Field label="Titel" hint={TITLE_HINT}>
          <Input
            className="h-10"
            data-testid="link-heading"
            value={heading}
            onChange={(event) => onHeadingChange(event.target.value)}
          />
        </Field>
        <SwitchRow
          label="Navigation am Bildschirmrand"
          hint={RAIL_HINT}
          checked={rail}
          onCheckedChange={onRailChange}
          data-testid="link-rail"
        />
        <Note>
          Die Vorschau oben rechts zeigt die Navigation in Gerätebreite.
        </Note>
      </div>
    </InspectorPanel>
  );
}

export function LinkEditor({ value, onChange, outlineSource }: LinkEditorProps): ReactElement {
  useLinkEditorPresence();
  const list = useLinkList(value.links ?? NO_LINKS, (links) => onChange({ ...value, links }));
  // Einmal je Fenster: eine neue Quelle bei jedem Rendern hieße jedes Mal neu laden.
  const source = useMemo(() => (outlineSource === undefined ? studioOutlineSource() : outlineSource), [outlineSource]);
  const outline = useOutline(source);
  const index = useMemo(() => outlineIndex(outlineEntries(outline)), [outline]);
  const outlineReady = outline?.status === "ready";
  // Ohne Links beginnt das Fenster mit dem Seitenplan – sofern es eine Seite gibt.
  const [mode, setMode] = useState<MainMode>(() => (list.links.length === 0 && source !== null ? "map" : "link"));
  const [editingId, setEditingId] = useState<string | null>(null);

  const linkOf = (entry: OutlineEntry): AnchorLink | undefined => linkOfEntry(list.links, entry);

  // Schon verlinkt: den vorhandenen Link wählen statt ihn zu verdoppeln.
  const addEntry = (entry: OutlineEntry): void => {
    const existing = linkOf(entry);
    if (existing !== undefined) list.select(existing.id);
    else list.append(linkToEntry(entry));
  };

  // Über einen Verweis: das Ablegen sieht immer Liste und Gliederung von
  // jetzt, auch wenn die Drag-&-Drop-Hooks ein älteres Objekt halten.
  const dropRef = useRef<(payloads: string[], at: number) => void>(() => undefined);
  dropRef.current = (payloads, at) => {
    const ids = [...new Set(payloads.map(baseBlockId))];
    const entries = ids.flatMap((id) => {
      const entry = index.get(id);
      return entry === undefined ? [] : [entry];
    });
    const fresh = entries.filter((entry) => linkOf(entry) === undefined);
    if (fresh.length > 0) list.insertAt(fresh.map(linkToEntry), at);
    else if (entries.length > 0) addEntry(entries[0]);
  };
  const externalDrop = useMemo<ExternalDrop>(
    () => ({ type: OUTLINE_DRAG_TYPE, onDrop: (payloads, at) => dropRef.current(payloads, at) }),
    [],
  );

  const hidden = useMemo(
    () => new Set(outlineReady ? list.links.filter((link) => isTargetMissing(link, index)).map((link) => link.id) : []),
    [outlineReady, list.links, index],
  );

  const showMap = mode === "map" && outline !== null;

  return (
    <div className="flex h-full min-h-0 w-full" data-testid="link-editor">
      <ConfigWorkspace
        className="flex-1"
        sidebar={
          <LinkSidebar
            links={list.links}
            outline={index}
            outlineReady={outlineReady}
            selectedId={showMap ? undefined : list.selected?.id}
            onSelect={(id) => {
              list.select(id);
              setMode("link");
            }}
            onAdd={() => {
              if (outline === null) list.addEmpty();
              else setMode("map");
            }}
            onReorder={list.reorder}
            externalDrop={outline === null ? undefined : externalDrop}
          />
        }
        inspector={
          <NavigationInspector
            heading={value.heading ?? ""}
            rail={value.rail !== false}
            onHeadingChange={(heading) => onChange({ ...value, heading })}
            onRailChange={(rail) => onChange(withRail(value, rail))}
          />
        }
        inspectorTitle="Navigation"
        preview={<LinkPreview config={value} hidden={hidden} />}
      >
        <div className="px-10 pt-6 pb-12 max-lg:px-6">
          <div className={showMap ? "flex max-w-[1100px] flex-col gap-8" : "flex max-w-[720px] flex-col gap-8"}>
            {showMap ? (
              <PageMapPanel
                outline={outline}
                list={list}
                linkOf={linkOf}
                editingId={editingId}
                setEditingId={setEditingId}
                onActivate={(entry) => {
                  addEntry(entry);
                  setEditingId(entry.blockId);
                }}
                onAddEmpty={() => {
                  list.addEmpty();
                  setMode("link");
                }}
                onDone={list.links.length > 0 ? () => setMode("link") : undefined}
              />
            ) : (
              <LinkMain list={list} index={index} outlineReady={outlineReady} />
            )}
          </div>
        </div>
      </ConfigWorkspace>
    </div>
  );
}
