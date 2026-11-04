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

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { useHotStyle } from "@shared/hot-style";
import { ScannedHeading } from "./heading-scan";
import { COMPACT_QUERY, REDUCED_MOTION_QUERY, useMediaQuery } from "./media-query";
import { useActiveHeading } from "./use-active-heading";
import anchorNavCss from "./styles/anchor-nav.scss";

/** Der Name der Navigation, wenn der Redakteur keinen Titel eingetragen hat. */
export const FALLBACK_NAV_LABEL = "Inhaltsverzeichnis";

/** Die Beschriftung des Knopfes auf schmalen Schirmen ohne eigenen Titel. */
export const COMPACT_TOGGLE_LABEL = "Inhalt";

export interface AnchorNavProps {
  readonly headings: readonly ScannedHeading[];
  /** Der Titel über der Liste, oder `null`. */
  readonly heading: string | null;
}

interface Marker {
  readonly top: number;
  readonly height: number;
}

const Chevron = (): React.ReactElement => (
  <svg
    className="man-anchor-nav__chevron"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M5 9l7 7 7-7" />
  </svg>
);

/**
 * Setzt den Fokus auf die angesprungene Überschrift.
 *
 * Die einzige Stelle, an der das Widget eine fremde Überschrift anfasst —
 * ohne sie liefe die Tastaturbedienung nach dem Sprung im Verzeichnis weiter
 * statt im Abschnitt. Das Hilfsattribut verschwindet wieder, sobald der Fokus
 * weiterzieht; eine Überschrift, die dauerhaft fokussierbar bleibt, ist für
 * die Wirtsseite eine Veränderung, die wir nicht hinterlassen wollen.
 */
function focusHeading(element: HTMLElement): void {
  if (!element.hasAttribute("tabindex")) {
    element.setAttribute("tabindex", "-1");
    element.addEventListener("blur", () => element.removeAttribute("tabindex"), { once: true });
  }
  element.focus({ preventScroll: true });
}

/**
 * Das Inhaltsverzeichnis.
 *
 * Ohne Überschriften gibt es nichts aus: eine leere Schiene mit Titel wäre
 * ein sichtbarer Defekt, kein Hinweis.
 */
export function AnchorNav({ headings, heading }: AnchorNavProps): React.ReactElement | null {
  const liveCss = useHotStyle(anchorNavCss, "anchor-nav-widget", "styles/anchor-nav.scss");
  const active = useActiveHeading(headings);
  const compact = useMediaQuery(COMPACT_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  const [open, setOpen] = useState(false);
  const [marker, setMarker] = useState<Marker | null>(null);

  const titleRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const jumped = useRef(false);

  const listVisible = !compact || open;

  const scrollTo = useCallback(
    (element: HTMLElement, smooth: boolean): void => {
      element.scrollIntoView?.({ behavior: smooth ? "smooth" : "auto", block: "start" });
    },
    [],
  );

  // Ein Aufruf mit Hash springt einmal, sobald der erste Scan etwas gefunden
  // hat. Hart und nicht weich: beim Laden der Seite ist eine Animation vom
  // Seitenanfang aus keine Orientierungshilfe, sondern eine Verzögerung.
  useEffect(() => {
    if (jumped.current || headings.length === 0) return;
    jumped.current = true;

    const rawHash = window.location.hash.replace(/^#/, "");
    // Ein Slug besteht nur aus `[a-z0-9-]`; ein Hash, der sich nicht dekodieren
    // lässt (z. B. „%“ ohne zwei folgende Hex-Ziffern), trifft damit ohnehin
    // keinen Eintrag — der rohe Hash ist hier ein sicherer Rückfall, kein Risiko.
    let slug: string;
    try {
      slug = decodeURIComponent(rawHash);
    } catch {
      slug = rawHash;
    }
    if (slug === "") return;

    const target = headings.find((candidate) => candidate.slug === slug);
    if (target) scrollTo(target.element, false);
  }, [headings, scrollTo]);

  // Die Lage des Segments. `useLayoutEffect`, damit es nach einem Wechsel
  // nicht erst eine Bildfolge lang an der alten Stelle steht.
  useLayoutEffect(() => {
    const anchor =
      compact && !open
        ? titleRef.current
        : active !== null
          ? itemRefs.current[active]
          : (titleRef.current ?? itemRefs.current[0]);

    setMarker(anchor ? { top: anchor.offsetTop, height: anchor.offsetHeight } : null);
  }, [active, headings, compact, open, heading]);

  const onLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, target: ScannedHeading): void => {
    // Zusatztasten und Mittelklick gehören dem Browser: „in neuem Tab öffnen"
    // soll weiter funktionieren.
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.button !== 0) return;

    event.preventDefault();
    scrollTo(target.element, !reducedMotion);
    focusHeading(target.element);
    // `replaceState` und nicht `pushState`: sonst sammelt der Zurück-Knopf
    // jeden Klick im Verzeichnis und der Nutzer muss sich rückwärts
    // hindurchklicken, um die Seite zu verlassen.
    window.history.replaceState(null, "", `#${target.slug}`);
    if (compact) setOpen(false);
  };

  if (headings.length === 0) return null;

  const toggleLabel = heading ?? COMPACT_TOGGLE_LABEL;

  return (
    <nav className="man-anchor-nav" aria-label={heading ?? FALLBACK_NAV_LABEL}>
      <style>{liveCss}</style>
      <span className="man-anchor-nav__rail" aria-hidden="true" />
      {marker && (
        <span
          className="man-anchor-nav__marker"
          aria-hidden="true"
          style={{ height: `${marker.height}px`, transform: `translateY(${marker.top}px)` }}
        />
      )}

      {compact ? (
        <button
          type="button"
          className="man-anchor-nav__toggle"
          aria-expanded={open}
          ref={(element) => {
            titleRef.current = element;
          }}
          onClick={() => setOpen((wasOpen) => !wasOpen)}
        >
          {toggleLabel}
          <Chevron />
        </button>
      ) : (
        heading !== null && (
          <p
            className="man-anchor-nav__title"
            ref={(element) => {
              titleRef.current = element;
            }}
          >
            {heading}
          </p>
        )
      )}

      {listVisible && (
        <ol className="man-anchor-nav__list">
          {headings.map((entry, index) => (
            <li
              className="man-anchor-nav__item"
              key={entry.slug}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
            >
              <a
                className="man-anchor-nav__link"
                href={`#${entry.slug}`}
                {...(index === active ? { "aria-current": "true" as const } : {})}
                onClick={(event) => onLinkClick(event, entry)}
              >
                {entry.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
