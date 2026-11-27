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
 * Die kleine Navigation am rechten Bildschirmrand: ein Strich je Abschnitt,
 * der aktuelle rot, darüber und darunter Pfeile zum vorigen und nächsten
 * Abschnitt. Zeiger oder Fokus auf einem Strich blenden links daneben den
 * Linktext ein.
 *
 * Erscheint erst beim ersten Scrollen und nur, solange die Navigation selbst
 * nicht zu sehen ist; nur auf Desktop und Tablet, nie im Studio und nie in
 * der Vorschau des Fensters – und je Seite nur einmal,
 * auch wenn mehrere Ankernavigationen darauf stehen (die erste gewinnt).
 * Abschalten lässt sie sich je Block (`rail: false` in `anchor-nav-config`).
 *
 * Gezeichnet wird sie in einem eigenen Shadow Root am `body`: `position:
 * fixed` bricht unter jedem Vorfahren mit `transform`, und solche stehen im
 * Content Designer reichlich um den Block herum.
 */

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useHotStyle } from "@shared/hot-style";
import railCss from "./styles/anchor-rail.scss";

export interface RailEntry {
  /** Die Stelle in der Liste der Navigation. */
  index: number;
  label: string;
}

export interface AnchorRailProps {
  entries: readonly RailEntry[];
  /** Die Stelle des aktiven Eintrags in der Liste der Navigation, oder `null`. */
  active: number | null;
  onJump: (index: number) => void;
}

/** Wer die Seitenleiste gerade zeigt; nur einer je Seite. */
let owner: symbol | null = null;

/** Ob diese Navigation die Leiste zeigen darf – die erste, die fragt, solange sie steht. */
export function useRailClaim(wanted: boolean): boolean {
  const [token] = useState(() => Symbol("anchor-rail"));
  const [claimed, setClaimed] = useState(false);
  useEffect(() => {
    if (!wanted) return undefined;
    if (owner !== null && owner !== token) return undefined;
    owner = token;
    setClaimed(true);
    return () => {
      if (owner === token) owner = null;
      setClaimed(false);
    };
  }, [wanted, token]);
  return claimed;
}

/** Wird wahr beim ersten Scrollen der Seite oder eines Containers darin. */
export function useHasScrolled(enabled: boolean): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!enabled || scrolled) return undefined;
    const onScroll = (): void => setScrolled(true);
    // Einfangend: im Content Designer rollt ein Container, nicht das Fenster.
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => window.removeEventListener("scroll", onScroll, { capture: true });
  }, [enabled, scrolled]);
  return scrolled;
}

/**
 * Ob `element` gerade im sichtbaren Bereich steht. Beobachtet erst, wenn
 * `enabled` – also nach dem ersten Scrollen, nie beim Laden. Ohne
 * `IntersectionObserver` gilt es als nicht sichtbar.
 */
export function useInViewport(element: Element | null, enabled: boolean): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!enabled || element === null || typeof window.IntersectionObserver !== "function") {
      setVisible(false);
      return undefined;
    }
    const observer = new window.IntersectionObserver((entries) => {
      const last = entries[entries.length - 1];
      if (last !== undefined) setVisible(last.isIntersecting);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, enabled]);
  return visible;
}

/** Ein Shadow Root am `body`, solange `enabled`. */
function useBodyShadowRoot(enabled: boolean): ShadowRoot | null {
  const [root, setRoot] = useState<ShadowRoot | null>(null);
  useEffect(() => {
    if (!enabled) return undefined;
    const host = document.createElement("div");
    host.setAttribute("data-man-anchor-rail", "");
    const shadow = host.attachShadow({ mode: "open" });
    document.body.appendChild(host);
    setRoot(shadow);
    return () => {
      host.remove();
      setRoot(null);
    };
  }, [enabled]);
  return root;
}

const Arrow = ({ up }: { up: boolean }): React.ReactElement => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
    <path d={up ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
  </svg>
);

interface StepProps {
  direction: "up" | "down";
  /** Wohin der Pfeil springt; `undefined` sperrt ihn. */
  target: number | undefined;
  entries: readonly RailEntry[];
  onJump: (index: number) => void;
}

/** Ein Pfeil; bei Zeiger oder Fokus steht links daneben, wohin er springt. */
function Step({ direction, target, entries, onJump }: StepProps): React.ReactElement {
  const label = entries.find((entry) => entry.index === target)?.label;
  const name = direction === "up" ? "Vorheriger Abschnitt" : "Nächster Abschnitt";
  return (
    <div className="man-anchor-rail__stepper">
      <button
        type="button"
        className="man-anchor-rail__step"
        aria-label={label === undefined ? name : `${name}: ${label}`}
        disabled={target === undefined}
        onClick={() => target !== undefined && onJump(target)}
      >
        <Arrow up={direction === "up"} />
      </button>
      {label !== undefined && (
        <span className="man-anchor-rail__label" aria-hidden="true">
          {label}
        </span>
      )}
    </div>
  );
}

/** Die Nachbarn des aktiven Eintrags unter den Strichen. */
export function railNeighbours(entries: readonly RailEntry[], active: number | null): { previous?: number; next?: number } {
  const position = active === null ? -1 : entries.findIndex((entry) => entry.index === active);
  const previous = position > 0 ? entries[position - 1].index : undefined;
  const next = position < entries.length - 1 ? entries[position + 1].index : undefined;
  return { previous, next };
}

export function AnchorRail({ entries, active, onJump }: AnchorRailProps): React.ReactElement | null {
  const css = useHotStyle(railCss, "anchor-nav-widget", "styles/anchor-rail.scss");
  const root = useBodyShadowRoot(true);
  if (root === null) return null;
  const { previous, next } = railNeighbours(entries, active);
  return createPortal(
    <nav className="man-anchor-rail" aria-label="Abschnitte der Seite" data-testid="anchor-rail">
      <style>{css}</style>
      <Step direction="up" target={previous} entries={entries} onJump={onJump} />
      <ol className="man-anchor-rail__list">
        {entries.map((entry) => (
          <li className="man-anchor-rail__item" key={entry.index}>
            <button
              type="button"
              className="man-anchor-rail__tick"
              aria-label={entry.label}
              {...(entry.index === active ? { "aria-current": "true" as const } : {})}
              onClick={() => onJump(entry.index)}
            />
            <span className="man-anchor-rail__label" aria-hidden="true">
              {entry.label}
            </span>
          </li>
        ))}
      </ol>
      <Step direction="down" target={next} entries={entries} onJump={onJump} />
    </nav>,
    root,
  );
}
