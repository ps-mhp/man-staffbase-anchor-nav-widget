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

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useHotStyle } from "@shared/hot-style";
import { AnchorLink, anchorSlugs, headingText } from "./anchor-links";
import { findById, findHeading } from "./heading-scan";
import {
  COMPACT_QUERY,
  REDUCED_MOTION_QUERY,
  useMediaQuery,
} from "./media-query";
import { measureChromeHeight } from "@shared/staffbase-chrome";
import { findScrollParent } from "./scroll-ancestor";
import { containerChromeOverlap, jumpTarget } from "./scroll-target";
import anchorNavCss from "./styles/anchor-nav.scss";

/** Der Name der Navigation, wenn der Redakteur keinen Titel eingetragen hat. */
export const FALLBACK_NAV_LABEL = "Inhaltsverzeichnis";

/** Die Beschriftung des Knopfes auf schmalen Schirmen ohne eigenen Titel. */
export const COMPACT_TOGGLE_LABEL = "Inhalt";

export interface AnchorNavProps {
  readonly links: readonly AnchorLink[];
  /** Der Titel über der Liste, oder `null`. */
  readonly heading: string | null;
  /** Der eigene Container. Überschriften darin sind kein Sprungziel. */
  readonly self: HTMLElement | null;
}

/** Ein Eintrag, wie die Liste ihn zeigt. */
interface Entry {
  readonly link: AnchorLink;
  /** Der Hash-Slug eines Überschriften-Eintrags; `null` bei einer Adresse. */
  readonly slug: string | null;
  readonly href: string;
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
function focusHeading(element: HTMLElement, signal: AbortSignal): void {
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

  // `signal` statt eines unbefristeten Lauschers: unmountet das Widget,
  // während die Überschrift noch den Fokus hat, darf der Lauscher nicht
  // bestehen bleiben — er entfernte sonst später ein `tabindex`, das
  // inzwischen die Wirtsseite selbst gesetzt haben kann.
  element.addEventListener("blur", () => element.removeAttribute("tabindex"), {
    once: true,
    signal,
  });
}

/** Die Block-ID eines Ziels `#<id>`, sonst `null`. */
function blockId(link: AnchorLink): string | null {
  const target = link.target?.trim() ?? "";
  return target.startsWith("#") && target.length > 1 ? target.slice(1) : null;
}

/** Der Hash der Adresse, dekodiert; leer, wenn keiner da ist. */
function currentHashSlug(): string {
  const rawHash = window.location.hash.replace(/^#/, "");
  // Ein Slug besteht nur aus `[a-z0-9-]`; ein Hash, der sich nicht dekodieren
  // lässt (z. B. „%“ ohne zwei folgende Hex-Ziffern), trifft damit ohnehin
  // keinen Eintrag — der rohe Hash ist hier ein sicherer Rückfall.
  try {
    return decodeURIComponent(rawHash);
  } catch {
    return rawHash;
  }
}

/**
 * Das Inhaltsverzeichnis.
 *
 * Ohne Einträge gibt es nichts aus: eine leere Schiene mit Titel wäre ein
 * sichtbarer Defekt, kein Hinweis.
 *
 * Auf der Seite außerhalb des Widgets passiert nichts von selbst: kein
 * Durchlauf, kein Beobachter, kein Timer. Gesucht wird nur auf Klick — und
 * einmal beim Laden, wenn die Adresse einen Hash trägt, der zu einem Eintrag
 * passt. Die Marke zeigt deshalb den zuletzt angeklickten Eintrag und folgt
 * nicht dem Scrollen.
 */
export function AnchorNav({
  links,
  heading,
  self,
}: AnchorNavProps): React.ReactElement | null {
  const liveCss = useHotStyle(
    anchorNavCss,
    "anchor-nav-widget",
    "styles/anchor-nav.scss",
  );
  const compact = useMediaQuery(COMPACT_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  const entries = useMemo<Entry[]>(() => {
    const slugs = anchorSlugs(links);
    return links.map((link, index) => {
      const slug = slugs[index];
      return {
        link,
        slug,
        href: slug === null ? (link.target ?? "") : `#${slug}`,
      };
    });
  }, [links]);

  const [open, setOpen] = useState(false);
  const [marker, setMarker] = useState<Marker | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // Ändert der Redakteur die Liste, kann der gemerkte Index ins Leere zeigen.
  const active =
    activeIndex !== null && activeIndex < entries.length ? activeIndex : null;

  const titleRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const jumped = useRef(false);
  // `null` bis der Mount-Effekt unten läuft, nicht `new AbortController()`
  // hier im Render: der Ausdruck würde sonst bei jedem Rendern neu
  // ausgewertet (verworfener Abfall, weil `useRef` nur den ersten Wert
  // behält) -- und unter `React.StrictMode`, das Effekte zu
  // Entwicklungszeiten synthetisch ab- und wieder anmontiert, um genau
  // solche Fehler aufzudecken, wäre der einzige, über beide Zyklen geteilte
  // Controller nach dem ersten synthetischen Abmontieren dauerhaft
  // abgebrochen: jeder spätere Klick registrierte seinen Blur-Lauscher mit
  // einem bereits abgebrochenen Signal (No-Op), `tabindex="-1"` bliebe für
  // immer auf fremdem DOM kleben.
  const focusAbort = useRef<AbortController | null>(null);

  // Unmountet das Widget, während eine angesprungene Überschrift noch den
  // Fokus hat (N6), muss der Blur-Lauscher aus `focusHeading` mit abgemeldet
  // werden — sonst entfernt er später ein `tabindex`, das inzwischen die
  // Wirtsseite selbst gesetzt haben kann. Der Controller entsteht hier, im
  // Effekt: ein erneuter Mount (echter Wechsel oder StrictModes
  // synthetischer Zyklus) legt einen frischen an statt den abgebrochenen
  // weiterzuverwenden.
  useEffect(() => {
    const controller = new AbortController();
    focusAbort.current = controller;
    return () => {
      controller.abort();
      focusAbort.current = null;
    };
  }, []);

  const listVisible = !compact || open;

  const scrollTo = useCallback(
    (element: HTMLElement, smooth: boolean): void => {
      const behavior = smooth ? "smooth" : "auto";
      const chromeHeight = measureChromeHeight();
      // Der rollfähige Vorfahre entscheidet, wer rollt: im Content Designer
      // rollt die Leinwand in einem eigenen Container statt am Dokument, und
      // `window.scrollTo` bewegt ausschließlich
      // das Hauptdokument — der Klick bewegte dort sichtbar nichts.
      const scrollParent = findScrollParent(element);

      if (scrollParent === null) {
        // Kein `typeof window.scrollTo`-Wächter (anders als bei
        // `matchMedia`): `window.scrollTo` gehört seit
        // Langem zu jedem Browser, den Staffbase unterstützt — der
        // einzige Fall, in dem die Prüfung je zuschlug, war ein Test, der
        // die Methode künstlich gelöscht hatte.
        const top = jumpTarget(
          element.getBoundingClientRect().top,
          window.scrollY,
          chromeHeight,
        );
        window.scrollTo({ top, behavior });
        return;
      }

      // Dieselbe Rechnung wie beim Dokument, nur relativ zum Container statt
      // zum Fenster: die Oberkante der Überschrift abzüglich der Oberkante
      // des Containers ist ihre Lage innerhalb des sichtbaren Ausschnitts,
      // zuzüglich dessen, was schon gerollt ist.
      const containerTop = scrollParent.getBoundingClientRect().top;
      const relativeTop = element.getBoundingClientRect().top - containerTop;
      // Nur die wirkliche Überlappung abziehen, nicht die volle Chrome-Höhe:
      // `chromeHeight` ist eine Unterkante in Fensterkoordinaten, steht der
      // Container (der Normalfall im Content Designer) unterhalb davon,
      // verdeckt die Chrome ihn gar nicht.
      const overlap = containerChromeOverlap(chromeHeight, containerTop);
      const top = jumpTarget(relativeTop, scrollParent.scrollTop, overlap);
      if (typeof scrollParent.scrollTo === "function") {
        scrollParent.scrollTo({ top, behavior });
      } else {
        scrollParent.scrollTop = top;
      }
    },
    [],
  );

  // Ein Aufruf mit Hash springt einmal. Hart und nicht weich: beim Laden der
  // Seite ist eine Animation vom Seitenanfang aus keine Orientierungshilfe,
  // sondern eine Verzögerung. Kein zweiter Versuch: steht die Überschrift
  // noch nicht auf der Seite, bleibt es beim markierten Eintrag.
  useEffect(() => {
    if (jumped.current || entries.length === 0) return;
    jumped.current = true;

    const slug = currentHashSlug();
    if (slug === "") return;
    const index = entries.findIndex(
      (entry) => entry.slug === slug || blockId(entry.link) === slug,
    );
    if (index === -1) return;

    setActiveIndex(index);
    const link = entries[index].link;
    const id = blockId(link);
    const element =
      id !== null ? findById(id) : findHeading(headingText(link), self);
    if (element !== null) scrollTo(element, false);
  }, [entries, self, scrollTo]);

  // Die Lage des Segments. `useLayoutEffect`, damit es nach einem Wechsel
  // nicht erst eine Bildfolge lang an der alten Stelle steht.
  // Die Marke läuft nur neben der Liste; der Titel steht über der Linie.
  // Ohne aktiven Eintrag sitzt sie am ersten.
  const measureMarker = useCallback((): void => {
    const anchor =
      compact && !open
        ? null
        : active !== null
          ? itemRefs.current[active]
          : itemRefs.current[0];

    setMarker(
      anchor ? { top: anchor.offsetTop, height: anchor.offsetHeight } : null,
    );
  }, [active, compact, open]);

  useLayoutEffect(() => {
    measureMarker();
  }, [measureMarker, entries, heading]);

  // Ändert sich das Fenster, ohne dass eine der obigen Abhängigkeiten wechselt
  // (die Breite ändert sich, ohne `COMPACT_QUERY` zu kreuzen, ein Eintrag
  // bricht anders um), bliebe die gemessene Lage stehen. Bewusst nur das
  // Fenster und kein `ResizeObserver`: auf der veröffentlichten Seite soll
  // nichts beobachtet werden.
  useEffect(() => {
    window.addEventListener("resize", measureMarker);
    return () => window.removeEventListener("resize", measureMarker);
  }, [measureMarker]);

  const onLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    index: number,
  ): void => {
    const entry = entries[index];
    const id = blockId(entry.link);
    // Ein Block der Seite: der Browser fände ihn in einem Shadow Root nicht
    // und rollte ihn unter die Kopfleiste — deshalb selbst springen.
    if (
      id !== null &&
      event.button === 0 &&
      !event.defaultPrevented &&
      !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    ) {
      const element = findById(id);
      if (element !== null) {
        event.preventDefault();
        setActiveIndex(index);
        scrollTo(element, !reducedMotion);
        window.history.replaceState(null, "", `#${id}`);
        if (compact) setOpen(false);
        return;
      }
    }
    // Eine Adresse gehört dem Browser; nur die Marke wandert mit.
    if (entry.slug === null) {
      setActiveIndex(index);
      if (compact) setOpen(false);
      return;
    }

    // Zusatztasten und Mittelklick gehören dem Browser: „in neuem Tab öffnen"
    // soll weiter funktionieren.
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    if (event.button !== 0) return;

    event.preventDefault();
    setActiveIndex(index);
    const element = findHeading(headingText(entry.link), self);
    if (element !== null) {
      scrollTo(element, !reducedMotion);
      // `focusAbort.current` ist spätestens nach dem Mount-Effekt gesetzt — ein
      // Klick ist erst möglich, nachdem die Navigation gerendert ist. Der
      // Rückfall ist rein defensiv.
      focusHeading(
        element,
        (focusAbort.current ?? new AbortController()).signal,
      );
      // `replaceState` und nicht `pushState`: sonst sammelt der Zurück-Knopf
      // jeden Klick im Verzeichnis.
      window.history.replaceState(null, "", `#${entry.slug}`);
    }
    if (compact) setOpen(false);
  };

  if (entries.length === 0) return null;
  const toggleLabel = heading ?? COMPACT_TOGGLE_LABEL;

  return (
    <nav className="man-anchor-nav" aria-label={heading ?? FALLBACK_NAV_LABEL}>
      <style>{liveCss}</style>

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
        <div className="man-anchor-nav__track">
        <span className="man-anchor-nav__rail" aria-hidden="true" />
        {marker && (
          <span
            className="man-anchor-nav__marker"
            aria-hidden="true"
            style={{
              height: `${marker.height}px`,
              transform: `translateY(${marker.top}px)`,
            }}
          />
        )}
        <ol className="man-anchor-nav__list">
          {entries.map((entry, index) => (
            <li
              className="man-anchor-nav__item"
              key={entry.link.id}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
            >
              <a
                className="man-anchor-nav__link"
                href={entry.href}
                {...(index === active
                  ? { "aria-current": "true" as const }
                  : {})}
                onClick={(event) => onLinkClick(event, index)}
              >
                {entry.link.label}
              </a>
            </li>
          ))}
        </ol>
        </div>
      )}
    </nav>
  );
}
