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
import { measureChromeHeight } from "@shared/staffbase-chrome";
import { findScrollParent } from "./scroll-ancestor";
import { jumpTarget } from "./scroll-target";
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
  const hadTabindex = element.hasAttribute("tabindex");
  if (!hadTabindex) element.setAttribute("tabindex", "-1");

  element.focus({ preventScroll: true });

  if (hadTabindex) return;

  // `getRootNode()` statt `document`: liegt die Überschrift in einem Shadow
  // Root, endet `document.activeElement` an dessen Grenze, aber `getRootNode()`
  // liefert genau den Shadow Root, dessen eigenes `activeElement` führt.
  const root = element.getRootNode() as Document | ShadowRoot;
  if (root.activeElement !== element) {
    // Eine unsichtbare Überschrift (zugeklappt, `display: none`) nimmt den
    // Fokus nicht an: `focus()` war ein No-Op, und ohne echten Fokus kommt nie
    // ein `blur`, der das Attribut wieder entfernt. Ohne diese Gegenprobe
    // bliebe es für die Lebensdauer der Seite auf fremdem DOM kleben.
    element.removeAttribute("tabindex");
    return;
  }

  element.addEventListener("blur", () => element.removeAttribute("tabindex"), { once: true });
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
  const navRef = useRef<HTMLElement | null>(null);
  const jumped = useRef(false);

  const listVisible = !compact || open;

  const scrollTo = useCallback(
    (element: HTMLElement, smooth: boolean): void => {
      const behavior = smooth ? "smooth" : "auto";
      const chromeHeight = measureChromeHeight();
      // Der rollfähige Vorfahre entscheidet, wer rollt: im Content Designer
      // rollt die Leinwand in einem eigenen Container statt am Dokument (siehe
      // use-active-heading.ts), und `window.scrollTo` bewegt ausschließlich
      // das Hauptdokument — der Klick bewegte dort sichtbar nichts.
      // `scrollIntoView({ block: "start" })` legt die Oberkante der Überschrift
      // auf die Oberkante des Sichtbereichs — genau dort, wo Staffbases feste
      // Kopf- und Menüleisten stehen, und es rollt dabei jeden Vorfahren mit,
      // der selbst rollen kann (auch `overflow: hidden`), im Content Designer
      // also die Editor-Umgebung gleich mit; es bleibt deshalb nur der
      // Rückfall, wo `window.scrollTo` fehlt.
      const scrollParent = findScrollParent(element);

      if (scrollParent === null) {
        if (typeof window.scrollTo !== "function") {
          element.scrollIntoView?.({ behavior, block: "start" });
          return;
        }
        const top = jumpTarget(element.getBoundingClientRect().top, window.scrollY, chromeHeight);
        window.scrollTo({ top, behavior });
        return;
      }

      // Dieselbe Rechnung wie beim Dokument, nur relativ zum Container statt
      // zum Fenster: die Oberkante der Überschrift abzüglich der Oberkante
      // des Containers ist ihre Lage innerhalb des sichtbaren Ausschnitts,
      // zuzüglich dessen, was schon gerollt ist.
      const relativeTop = element.getBoundingClientRect().top - scrollParent.getBoundingClientRect().top;
      const top = jumpTarget(relativeTop, scrollParent.scrollTop, chromeHeight);
      if (typeof scrollParent.scrollTo === "function") {
        scrollParent.scrollTo({ top, behavior });
      } else {
        scrollParent.scrollTop = top;
      }
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
  const measureMarker = useCallback((): void => {
    const anchor =
      compact && !open
        ? titleRef.current
        : active !== null
          ? itemRefs.current[active]
          : (titleRef.current ?? itemRefs.current[0]);

    setMarker(anchor ? { top: anchor.offsetTop, height: anchor.offsetHeight } : null);
  }, [active, compact, open]);

  useLayoutEffect(() => {
    measureMarker();
  }, [measureMarker, headings, heading]);

  // Ändert sich das Layout, ohne dass eine der obigen Abhängigkeiten wechselt —
  // die Fensterbreite ändert sich ohne `COMPACT_QUERY` zu kreuzen, ein langer
  // Eintrag bricht um, ein Web-Font lädt nach, eine fremde Seitenspalte klappt
  // auf —, bliebe die gemessene Lage stehen. `ResizeObserver` meldet genau das;
  // ist er nicht vorhanden, ist ein Resize-Listener am Fenster der Rückfall
  // (schwächer: er sieht nur Fensteränderungen, keine reinen Inhaltsumbrüche).
  //
  // `headings` steht zusätzlich in den Abhängigkeiten: ohne Überschriften
  // gibt die Komponente `null` zurück, `navRef.current` ist dann `null`, und
  // mit nur `measureMarker` in den Abhängigkeiten liefe dieser Effekt nie
  // erneut, bis `active`/`compact`/`open` wechseln — steht die Seite oben,
  // passiert das nie, und es wird nie ein Beobachter angelegt. Reicht
  // `usePageHeadings` die Liste nach, ändert sich die Referenz und der Effekt
  // läuft erneut, jetzt mit gesetztem `navRef.current`. Fallen alle
  // Überschriften wieder weg, läuft er aus demselben Grund noch einmal und
  // die vorherige Aufräumfunktion hängt den Beobachter nicht mehr am
  // abgehängten `nav` fest.
  useEffect(() => {
    const navElement = navRef.current;
    if (navElement === null) return undefined;

    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(() => measureMarker());
      observer.observe(navElement);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", measureMarker);
    return () => window.removeEventListener("resize", measureMarker);
  }, [measureMarker, headings]);

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
    <nav
      className="man-anchor-nav"
      aria-label={heading ?? FALLBACK_NAV_LABEL}
      ref={(element) => {
        navRef.current = element;
      }}
    >
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
