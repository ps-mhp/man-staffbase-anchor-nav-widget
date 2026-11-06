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
 * Der Redaktionsdialog der Links, gebaut mit React Aria Components.
 *
 * Links die Liste (ziehen oder per Tastatur umordnen), rechts die Felder des
 * gewählten Eintrags, oben die Auswahl aus den Elementen der Seite. Er läuft
 * im Shadow Root von `@shared/config-modal` und wird erst im
 * Studio nachgeladen; Übergeben, Rückfrage und Wiederöffnen erledigt der
 * Dialog.
 */

import * as React from "react";
import { ReactElement, useEffect, useRef, useState } from "react";
import {
  Button,
  ComboBox,
  GridList,
  GridListItem,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Text,
  TextField,
  useDragAndDrop,
} from "react-aria-components";
import { UNSAFE_PortalProvider } from "react-aria";
import { enableShadowDOM } from "react-stately/private/flags/flags";

import { useHotStyle } from "@shared/hot-style";
import { AnchorLink, emptyAnchorLink, newLinkId } from "./anchor-links";
import { OutlineEntry } from "./page-outline";
import linkEditorCss from "./styles/link-editor.scss";

// Ohne diesen Schalter verlieren Fokusführung und „Klick außerhalb“ von React
// Aria im Shadow Root die Spur. Gilt nur für die Kopie in diesem Bündel.
enableShadowDOM();

export interface LinkEditorProps {
  value: AnchorLink[];
  onChange: (links: AnchorLink[]) => void;
  onSave: () => void;
  onClose: () => void;
  dirty: boolean;
  /** Lädt die Elemente der Seite für die Auswahl; ohne sie gibt es nur die Eingabe von Hand. */
  loadOutline?: () => Promise<OutlineEntry[] | null>;
}

type OutlineState =
  | { status: "loading" }
  | { status: "failed" }
  | { status: "ready"; entries: OutlineEntry[] };

/** Verschiebt die Einträge `keys` vor oder hinter `target`. */
export function moveLinks(
  links: readonly AnchorLink[],
  keys: ReadonlySet<React.Key>,
  target: React.Key,
  position: "before" | "after",
): AnchorLink[] {
  const moving = links.filter((link) => keys.has(link.id));
  const rest = links.filter((link) => !keys.has(link.id));
  const at = rest.findIndex((link) => link.id === target);
  if (moving.length === 0 || at === -1) return [...links];
  rest.splice(position === "before" ? at : at + 1, 0, ...moving);
  return rest;
}

function useOutline(
  loadOutline: LinkEditorProps["loadOutline"],
): OutlineState | null {
  const [outline, setOutline] = useState<OutlineState | null>(
    loadOutline ? { status: "loading" } : null,
  );
  // Einmal beim Öffnen; ein Ergebnis nach dem Schließen wird verworfen.
  useEffect(() => {
    if (!loadOutline) return undefined;
    let alive = true;
    loadOutline().then(
      (entries) =>
        alive &&
        setOutline(
          entries === null
            ? { status: "failed" }
            : { status: "ready", entries },
        ),
      () => alive && setOutline({ status: "failed" }),
    );
    return () => {
      alive = false;
    };
  }, [loadOutline]);
  return outline;
}

interface PickerProps {
  outline: OutlineState;
  linkedTargets: ReadonlySet<string | undefined>;
  onPick: (entry: OutlineEntry) => void;
}

/** Suchbare Auswahl der Überschriften und Widgets der gespeicherten Seite. */
function OutlinePicker({
  outline,
  linkedTargets,
  onPick,
}: PickerProps): ReactElement {
  const [input, setInput] = useState("");
  const entries = outline.status === "ready" ? outline.entries : [];
  const disabledKeys = entries
    .filter((entry) => linkedTargets.has(`#${entry.blockId}`))
    .map((e) => e.blockId);

  return (
    <ComboBox
      className="man-ale__picker"
      data-testid="link-outline"
      items={entries}
      inputValue={input}
      onInputChange={setInput}
      selectedKey={null}
      disabledKeys={disabledKeys}
      isDisabled={outline.status !== "ready" || entries.length === 0}
      menuTrigger="focus"
      onSelectionChange={(key) => {
        const entry = entries.find((candidate) => candidate.blockId === key);
        if (entry === undefined) return;
        onPick(entry);
        setInput("");
      }}
    >
      <Label className="man-ale__label">Element der Seite hinzufügen</Label>
      <div className="man-ale__combo">
        <Input
          className="man-ale__input"
          placeholder={
            outline.status === "loading"
              ? "Seite wird geladen …"
              : entries.length === 0 && outline.status === "ready"
                ? "Keine Überschriften oder Widgets gefunden"
                : "Überschrift oder Widget suchen …"
          }
        />
        <Button
          className="man-ale__combo-button"
          aria-label="Elemente anzeigen"
        >
          ▾
        </Button>
      </div>
      {outline.status === "failed" ? (
        <Text
          slot="description"
          className="man-ale__hint"
          data-testid="link-outline-failed"
        >
          Die Seite ließ sich nicht laden. Links können weiter von Hand
          eingetragen werden.
        </Text>
      ) : (
        <Text slot="description" className="man-ale__hint">
          Überschriften und Widgets der gespeicherten Seite; ▣ = Widget.
        </Text>
      )}
      <Popover className="man-ale__popover" placement="bottom start" offset={4}>
        <ListBox<OutlineEntry> className="man-ale__options">
          {(entry) => (
            <ListBoxItem
              id={entry.blockId}
              textValue={entry.label}
              className="man-ale__option"
              style={{ paddingLeft: `${10 + entry.depth * 14}px` }}
            >
              {entry.kind === "widget" && (
                <span className="man-ale__option-kind" aria-label="Widget">
                  ▣
                </span>
              )}
              {entry.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}

export function LinkEditor({
  value,
  onChange,
  onSave,
  onClose,
  dirty,
  loadOutline,
}: LinkEditorProps): ReactElement {
  const css = useHotStyle(
    linkEditorCss,
    "anchor-nav-widget",
    "styles/link-editor.scss",
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const outline = useOutline(loadOutline);
  const [selectedId, setSelectedId] = useState<string | null>(
    value[0]?.id ?? null,
  );
  const selectedIndex = value.findIndex((link) => link.id === selectedId);
  const selected = selectedIndex === -1 ? null : value[selectedIndex];

  const patch = (id: string, changes: Partial<AnchorLink>): void => {
    onChange(
      value.map((link) => (link.id === id ? { ...link, ...changes } : link)),
    );
  };

  const append = (link: AnchorLink): void => {
    onChange([...value, link]);
    setSelectedId(link.id);
  };

  const remove = (id: string): void => {
    const index = value.findIndex((link) => link.id === id);
    const next = value.filter((link) => link.id !== id);
    onChange(next);
    if (id === selectedId)
      setSelectedId(next[Math.min(index, next.length - 1)]?.id ?? null);
  };

  const { dragAndDropHooks } = useDragAndDrop<AnchorLink>({
    getItems: (keys) => [...keys].map((key) => ({ "text/plain": String(key) })),
    onReorder: (event) =>
      onChange(
        moveLinks(
          value,
          event.keys,
          event.target.key,
          event.target.dropPosition === "before" ? "before" : "after",
        ),
      ),
  });

  const linkedTargets = new Set(value.map((link) => link.target));

  return (
    <div className="man-ale" data-testid="link-editor" ref={rootRef}>
      <style>{css}</style>
      {/* Overlays (Auswahlliste) in den Shadow Root des Dialogs statt nach `document.body`. */}
      <UNSAFE_PortalProvider getContainer={() => rootRef.current}>
        <div className="man-ale__toolbar">
          {outline !== null && (
            <OutlinePicker
              outline={outline}
              linkedTargets={linkedTargets}
              onPick={(entry) =>
                append({
                  id: newLinkId(),
                  label: entry.label,
                  target: `#${entry.blockId}`,
                })
              }
            />
          )}
          <Button
            className="man-ale__button"
            data-testid="link-add"
            onPress={() => append(emptyAnchorLink())}
          >
            Link hinzufügen
          </Button>
        </div>

        <div className="man-ale__body">
          <div className="man-ale__list-pane">
            <GridList
              aria-label="Links"
              className="man-ale__list"
              data-testid="link-list"
              items={value}
              selectionMode="single"
              selectionBehavior="replace"
              disallowEmptySelection
              selectedKeys={selected ? [selected.id] : []}
              onSelectionChange={(keys) => {
                const [key] = keys === "all" ? [] : [...keys];
                if (key !== undefined) setSelectedId(String(key));
              }}
              dragAndDropHooks={dragAndDropHooks}
              renderEmptyState={() => (
                <p className="man-ale__empty">
                  Noch kein Link. Wähle oben ein Element der Seite oder lege
                  über <strong>Link hinzufügen</strong> einen an.
                </p>
              )}
            >
              {(link) => (
                <GridListItem
                  id={link.id}
                  textValue={link.label || "Ohne Linktext"}
                  className="man-ale__row"
                  data-testid={`link-row-${link.id}`}
                >
                  <Button
                    slot="drag"
                    className="man-ale__handle"
                    aria-label="Verschieben"
                  >
                    ⠿
                  </Button>
                  <span className="man-ale__row-text">
                    <span
                      className={`man-ale__row-label${link.label ? "" : " man-ale__row-label--empty"}`}
                    >
                      {link.label || "Ohne Linktext"}
                    </span>
                    <span className="man-ale__row-target">
                      {link.target ?? "Überschrift mit diesem Text"}
                    </span>
                  </span>
                  <Button
                    className="man-ale__icon man-ale__icon--danger"
                    data-testid={`link-remove-${link.id}`}
                    aria-label={`„${link.label || "Ohne Linktext"}“ entfernen`}
                    onPress={() => remove(link.id)}
                  >
                    🗑
                  </Button>
                </GridListItem>
              )}
            </GridList>
          </div>

          <div className="man-ale__detail" data-testid="link-detail">
            {selected === null ? (
              <p className="man-ale__empty">
                Links einen Eintrag wählen, um ihn zu bearbeiten.
              </p>
            ) : (
              <>
                <TextField
                  className="man-ale__field"
                  value={selected.label}
                  onChange={(label) => patch(selected.id, { label })}
                  isInvalid={selected.label.trim() === ""}
                >
                  <Label className="man-ale__label">Linktext</Label>
                  <Input
                    className="man-ale__input"
                    data-testid={`link-label-${selected.id}`}
                  />
                  {selected.label.trim() === "" && (
                    <Text
                      slot="errorMessage"
                      className="man-ale__hint man-ale__hint--warning"
                      data-testid={`link-unlabelled-${selected.id}`}
                    >
                      Ohne Linktext wird dieser Eintrag nicht angezeigt.
                    </Text>
                  )}
                </TextField>
                <TextField
                  className="man-ale__field"
                  value={selected.target ?? ""}
                  onChange={(target) =>
                    patch(selected.id, {
                      target: target === "" ? undefined : target,
                    })
                  }
                >
                  <Label className="man-ale__label">Ziel</Label>
                  <Input
                    className="man-ale__input"
                    data-testid={`link-target-${selected.id}`}
                  />
                  <Text slot="description" className="man-ale__hint">
                    Leer lassen: springt zur Überschrift mit dem Linktext. Sonst
                    der Text einer anderen Überschrift, eine Block-ID (#…) oder
                    eine Adresse (/…, https://…).
                  </Text>
                </TextField>
              </>
            )}
          </div>
        </div>

        <div className="man-ale__footer">
          <span className="man-ale__footer-note">
            {dirty ? "Ungesicherte Änderungen" : "Keine Änderungen"}
          </span>
          <Button
            className="man-ale__button"
            data-testid="link-editor-cancel"
            onPress={onClose}
          >
            Abbrechen
          </Button>
          <Button
            className="man-ale__button man-ale__button--primary"
            data-testid="link-editor-save"
            onPress={onSave}
          >
            Übernehmen
          </Button>
        </div>
      </UNSAFE_PortalProvider>
    </div>
  );
}
