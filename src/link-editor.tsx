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
 * Der Redaktionsdialog der Links.
 *
 * Die Links liegen als JSON in einem einzigen Attribut; dieser Editor tritt
 * an die Stelle des Textfeldes: eine Zeile je Link, alle untereinander
 * sichtbar, Reihenfolge per Griff oder Pfeiltasten. Er schreibt nichts selbst
 * zurück — Übergeben, Rückfrage und Wiederöffnen erledigt `@shared/config-modal`.
 */

import * as React from "react";
import { ReactElement, useEffect, useRef, useState } from "react";

import { useHotStyle } from "@shared/hot-style";
import { AnchorLink, emptyAnchorLink, newLinkId } from "./anchor-links";
import { OutlineEntry } from "./page-outline";
import linkEditorCss from "./styles/link-editor.scss";

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

/** Verschiebt den Eintrag an `from` auf die Stelle `to`; am Rand passiert nichts. */
function reorder(
  links: AnchorLink[],
  from: number,
  to: number,
): AnchorLink[] | null {
  if (to < 0 || to >= links.length || from === to) return null;
  const next = [...links];
  const [moved] = next.splice(from, 1);
  if (moved === undefined) return null;
  next.splice(to, 0, moved);
  return next;
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
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [outline, setOutline] = useState<OutlineState | null>(
    loadOutline ? { status: "loading" } : null,
  );

  // Einmal beim Öffnen; ein später eintreffendes Ergebnis nach dem Schließen
  // wird verworfen.
  useEffect(() => {
    if (!loadOutline) return undefined;
    let alive = true;
    loadOutline().then(
      (entries) => {
        if (alive)
          setOutline(
            entries === null
              ? { status: "failed" }
              : { status: "ready", entries },
          );
      },
      () => {
        if (alive) setOutline({ status: "failed" });
      },
    );
    return () => {
      alive = false;
    };
  }, [loadOutline]);

  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  // Das Ziehen braucht die Stelle, an der der Eintrag jetzt steht, nicht die
  // aus dem letzten Rendern — `pointermove` feuert mehrmals je Bild.
  const dragFrom = useRef<number | null>(null);
  // Die Liste, auf der das Ziehen arbeitet; zwei `pointermove` können
  // eintreffen, bevor der Elternteil die erste Änderung zurückgespiegelt hat.
  const links = useRef(value);
  const lastValue = useRef(value);
  if (lastValue.current !== value) {
    lastValue.current = value;
    links.current = value;
  }

  const patch = (index: number, changes: Partial<AnchorLink>): void => {
    onChange(
      value.map((link, i) => (i === index ? { ...link, ...changes } : link)),
    );
  };

  const clearDrag = (): void => {
    dragFrom.current = null;
    setDragIndex(null);
  };

  // Fällt das Loslassen außerhalb des Fensters, erreicht den Griff nichts
  // mehr; deshalb horcht das Fenster mit, solange gezogen wird.
  useEffect(() => {
    if (dragIndex === null) return undefined;
    window.addEventListener("pointerup", clearDrag);
    window.addEventListener("pointercancel", clearDrag);
    return () => {
      window.removeEventListener("pointerup", clearDrag);
      window.removeEventListener("pointercancel", clearDrag);
    };
  }, [dragIndex]);

  const move = (from: number, to: number): boolean => {
    const next = reorder(links.current, from, to);
    if (next === null) return false;
    links.current = next;
    onChange(next);
    return true;
  };

  const remove = (index: number): void => {
    onChange(value.filter((_, i) => i !== index));
  };

  const add = (): void => {
    onChange([...value, emptyAnchorLink()]);
  };

  const addFromPage = (blockId: string): void => {
    if (outline?.status !== "ready") return;
    const entry = outline.entries.find(
      (candidate) => candidate.blockId === blockId,
    );
    if (entry === undefined) return;
    onChange([
      ...value,
      { id: newLinkId(), label: entry.label, target: `#${entry.blockId}` },
    ]);
  };

  const linkedTargets = new Set(value.map((link) => link.target));

  const endDrag = (event: React.PointerEvent<HTMLButtonElement>): void => {
    const handle = event.currentTarget;
    if (
      typeof handle.hasPointerCapture === "function" &&
      handle.hasPointerCapture(event.pointerId)
    ) {
      handle.releasePointerCapture(event.pointerId);
    }
    clearDrag();
  };

  const handlePointerDown =
    (index: number) =>
    (event: React.PointerEvent<HTMLButtonElement>): void => {
      if (event.button !== 0) return;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      dragFrom.current = index;
      setDragIndex(index);
    };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLButtonElement>,
  ): void => {
    // React hängt die Zeilen beim Umordnen um, der Browser verliert dabei die
    // Erfassung; ohne gedrückte Taste ist das Ziehen vorbei.
    if (event.buttons === 0) {
      endDrag(event);
      return;
    }

    const from = dragFrom.current;
    if (from === null) return;

    // Ziel ist die äußerste Zeile, deren Mitte der Zeiger überschritten hat.
    const y = event.clientY;
    let target = from;
    rowRefs.current.forEach((row, index) => {
      if (row === null || index === from) return;
      const box = row.getBoundingClientRect();
      const middle = box.top + box.height / 2;
      if (index < from && y < middle) target = Math.min(target, index);
      if (index > from && y > middle) target = Math.max(target, index);
    });

    if (target === from) return;
    if (move(from, target)) dragFrom.current = target;
    setDragIndex(dragFrom.current);
  };

  const handleKeyDown =
    (index: number) =>
    (event: React.KeyboardEvent<HTMLButtonElement>): void => {
      const delta =
        event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
      if (delta === 0) return;
      event.preventDefault();
      move(index, index + delta);
    };

  rowRefs.current.length = value.length;

  return (
    <div className="man-ale" data-testid="link-editor">
      <style>{css}</style>

      <div className="man-ale__body">
        {outline !== null && (
          <label className="man-ale__field man-ale__picker">
            <span className="man-ale__label">Element der Seite hinzufügen</span>
            {outline.status === "loading" && (
              <span className="man-ale__hint">Seite wird geladen …</span>
            )}
            {outline.status === "failed" && (
              <span className="man-ale__hint" data-testid="link-outline-failed">
                Die Seite ließ sich nicht laden. Links können weiter von Hand
                eingetragen werden.
              </span>
            )}
            {outline.status === "ready" && (
              <select
                className="man-ale__input"
                data-testid="link-outline"
                value=""
                onChange={(event) => addFromPage(event.target.value)}
              >
                <option value="">
                  {outline.entries.length === 0
                    ? "Keine Überschriften oder Widgets gefunden"
                    : "Element wählen …"}
                </option>
                {outline.entries.map((entry) => (
                  <option
                    key={entry.blockId}
                    value={entry.blockId}
                    disabled={linkedTargets.has(`#${entry.blockId}`)}
                  >
                    {`${"\u00a0\u00a0".repeat(entry.depth)}${entry.kind === "heading" ? "" : "▣ "}${entry.label}`}
                  </option>
                ))}
              </select>
            )}
            <span className="man-ale__hint">
              Überschriften und Widgets der gespeicherten Seite; ▣ = Widget.
            </span>
          </label>
        )}

        {value.length === 0 && (
          <p className="man-ale__empty">
            Noch kein Link. Lege über <strong>Link hinzufügen</strong> den
            ersten an.
          </p>
        )}

        <div className="man-ale__list" role="list" data-testid="link-list">
          {value.map((link, index) => (
            <div
              key={link.id}
              role="listitem"
              ref={(node) => {
                rowRefs.current[index] = node;
              }}
              className={`man-ale__row${dragIndex === index ? " man-ale__row--dragging" : ""}`}
              data-testid={`link-row-${link.id}`}
            >
              <button
                type="button"
                className="man-ale__handle"
                data-testid={`link-handle-${link.id}`}
                aria-label={`Link ${index + 1} von ${value.length} verschieben`}
                onPointerDown={handlePointerDown(index)}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onLostPointerCapture={endDrag}
                onKeyDown={handleKeyDown(index)}
              >
                <span aria-hidden="true">⠿</span>
              </button>

              <div className="man-ale__fields">
                <label className="man-ale__field">
                  <span className="man-ale__label">Linktext</span>
                  <input
                    type="text"
                    className="man-ale__input"
                    data-testid={`link-label-${link.id}`}
                    value={link.label}
                    onChange={(event) =>
                      patch(index, { label: event.target.value })
                    }
                  />
                </label>

                {link.label.trim() === "" && (
                  <p
                    className="man-ale__hint"
                    data-testid={`link-unlabelled-${link.id}`}
                  >
                    Ohne Linktext wird dieser Eintrag nicht angezeigt.
                  </p>
                )}

                <label className="man-ale__field">
                  <span className="man-ale__label">Ziel</span>
                  <input
                    type="text"
                    className="man-ale__input"
                    data-testid={`link-target-${link.id}`}
                    value={link.target ?? ""}
                    onChange={(event) =>
                      patch(index, {
                        target:
                          event.target.value === ""
                            ? undefined
                            : event.target.value,
                      })
                    }
                  />
                  <span className="man-ale__hint">
                    Leer lassen: springt zur Überschrift mit dem Linktext. Sonst
                    der Text einer anderen Überschrift, oder eine Adresse
                    (#Block-ID, /…, https://…).
                  </span>
                </label>
              </div>

              <button
                type="button"
                className="man-ale__icon man-ale__icon--danger"
                data-testid={`link-remove-${link.id}`}
                aria-label={`Link ${index + 1} entfernen`}
                onClick={() => remove(index)}
              >
                <span aria-hidden="true">🗑</span>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="man-ale__button man-ale__button--primary man-ale__add"
          data-testid="link-add"
          onClick={add}
        >
          Link hinzufügen
        </button>
      </div>

      <div className="man-ale__footer">
        <span className="man-ale__footer-note">
          {dirty ? "Ungesicherte Änderungen" : "Keine Änderungen"}
        </span>
        <button
          type="button"
          className="man-ale__button"
          data-testid="link-editor-cancel"
          onClick={onClose}
        >
          Abbrechen
        </button>
        <button
          type="button"
          className="man-ale__button man-ale__button--primary"
          data-testid="link-editor-save"
          onClick={onSave}
        >
          Übernehmen
        </button>
      </div>
    </div>
  );
}
