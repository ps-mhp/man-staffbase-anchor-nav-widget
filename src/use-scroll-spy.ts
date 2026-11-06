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
 * Die Marke folgt dem Scrollen: aktiv ist der Abschnitt, dessen Ziel zuletzt
 * das Erfassungsband oben im sichtbaren Bereich erreicht hat.
 *
 * Bis rc.8 gab es das schon, damals aber mit einem Durchlauf über die ganze
 * Seite beim Laden und bei jeder Änderung des DOM — genau solche Läufe standen
 * im Verdacht, den Browser auf veröffentlichten Seiten abstürzen zu lassen.
 * Hier deshalb: beim Laden nichts. Die Ziele werden erst beim ersten Scrollen
 * aufgelöst, einmal, und neu nur, wenn eines die Seite verlassen hat (und dann
 * höchstens einmal je Sekunde). Gemessen wird höchstens einmal je Bild und nur
 * an diesen wenigen Zielen.
 */

import { useCallback, useEffect, useRef } from "react";

import { measureChromeHeight } from "@shared/staffbase-chrome";
import { findScrollParent } from "./scroll-ancestor";

/**
 * Wo das Erfassungsband liegt, als Anteil des sichtbaren Bereichs von oben.
 *
 * Ein Viertel: tiefer gelegt wechselte die Markierung erst, wenn der Abschnitt
 * schon die halbe Seite füllt; höher gelegt wechselte sie, bevor seine
 * Überschrift überhaupt zu lesen ist. (Wert aus dem früheren Scroll-Spy.)
 */
export const BAND_FRACTION = 0.25;

/** So lange ohne Scroll-Ereignis gilt ein vom Klick ausgelöster Bildlauf als beendet. */
export const SETTLE_MS = 150;

/** Höchstens so oft wird nach einem verschwundenen Ziel neu aufgelöst. */
const RESOLVE_INTERVAL_MS = 1000;

/** Abstand zum Ende, ab dem ein Bereich als ganz hinuntergerollt gilt. */
const END_TOLERANCE_PX = 2;

/**
 * Der Index des letzten Ziels oberhalb des Bandes, sonst `null`.
 *
 * Reine Funktion über die Oberkanten, in Dokumentreihenfolge; `null` steht für
 * ein Ziel, das es auf der Seite nicht gibt. Ist der Bereich ganz
 * hinuntergerollt (`atEnd`), erreichen die letzten Abschnitte das Band nie;
 * dann gilt der letzte, dessen Oberkante überhaupt zu sehen ist.
 */
export function pickActive(
  tops: readonly (number | null)[],
  band: number,
  atEnd: boolean,
  viewportBottom: number = Number.POSITIVE_INFINITY,
): number | null {
  let active: number | null = null;
  let lastVisible: number | null = null;
  tops.forEach((top, index) => {
    if (top === null) return;
    if (top <= band) active = index;
    if (top < viewportBottom) lastVisible = index;
  });
  if (atEnd && lastVisible !== null && (active === null || lastVisible > active)) return lastVisible;
  return active;
}

interface Viewport {
  band: number;
  bottom: number;
  atEnd: boolean;
}

function scrolledToEnd(scrollTop: number, clientHeight: number, scrollHeight: number): boolean {
  if (scrollHeight <= clientHeight + END_TOLERANCE_PX) return false;
  return scrollTop + clientHeight >= scrollHeight - END_TOLERANCE_PX;
}

/** Band und Unterkante des sichtbaren Bereichs, in Fensterkoordinaten. */
function measureViewport(container: HTMLElement | null): Viewport {
  const chrome = measureChromeHeight();
  if (container === null) {
    const root = document.scrollingElement ?? document.documentElement;
    const top = chrome;
    const bottom = window.innerHeight;
    return {
      band: top + (bottom - top) * BAND_FRACTION,
      bottom,
      atEnd: scrolledToEnd(window.scrollY, window.innerHeight, root.scrollHeight),
    };
  }
  const rect = container.getBoundingClientRect();
  const top = Math.max(rect.top, chrome);
  return {
    band: top + (rect.bottom - top) * BAND_FRACTION,
    bottom: rect.bottom,
    atEnd: scrolledToEnd(container.scrollTop, container.clientHeight, container.scrollHeight),
  };
}

export interface ScrollSpyOptions {
  /** Die Ziele der Einträge in Listenreihenfolge; `null` für eines ohne (Adresse, nicht gefunden). */
  resolve: () => readonly (HTMLElement | null)[];
  /** Der eigene Container; sein rollfähiger Vorfahre wird von Anfang an beobachtet. */
  self: HTMLElement | null;
  /** Meldet den aktiven Eintrag, nur bei einem Wechsel. */
  onActive: (index: number | null) => void;
}

export interface ScrollSpy {
  /**
   * Hält den gerade gewählten Eintrag fest: der folgende Bildlauf gehört dem
   * Sprung. Erst wenn danach wieder gescrollt wird, folgt die Marke.
   */
  hold: () => void;
}

interface Hold {
  active: boolean;
  settled: boolean;
  timer: ReturnType<typeof setTimeout> | undefined;
}

export function useScrollSpy({ resolve, self, onActive }: ScrollSpyOptions): ScrollSpy {
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;
  const holdRef = useRef<Hold>({ active: false, settled: false, timer: undefined });
  const lastRef = useRef<number | null | undefined>(undefined);

  const settleLater = useCallback((): void => {
    const state = holdRef.current;
    clearTimeout(state.timer);
    state.timer = setTimeout(() => {
      state.settled = true;
    }, SETTLE_MS);
  }, []);

  const hold = useCallback((): void => {
    holdRef.current.active = true;
    holdRef.current.settled = false;
    // Was der Klick setzt, kennt der Spy nicht; der nächste Wert ist deshalb
    // immer eine Meldung wert.
    lastRef.current = undefined;
    settleLater();
  }, [settleLater]);

  useEffect(() => {
    let targets: readonly (HTMLElement | null)[] | null = null;
    let resolvedAt = Number.NEGATIVE_INFINITY;
    let frame: number | null = null;
    // Eigener Merker statt `frame`: ruft der Browser den Rückruf ausnahmsweise
    // sofort, käme die Kennung erst danach an und bliebe stehen.
    let pending = false;
    const watched = new Set<EventTarget>();

    const ensureTargets = (): readonly (HTMLElement | null)[] => {
      const stale = targets === null || targets.some((element) => element !== null && !element.isConnected);
      if (stale && Date.now() - resolvedAt >= RESOLVE_INTERVAL_MS) {
        targets = resolve();
        resolvedAt = Date.now();
        // `scroll` überquert keine Shadow-Root-Grenze, auch nicht in der
        // Einfangphase am Dokument: der Content Designer rollt seine Leinwand
        // in einem Container darin. Deshalb an jedem rollfähigen Vorfahren
        // der Ziele selbst lauschen.
        for (const element of targets) {
          const parent = element === null ? null : findScrollParent(element);
          if (parent !== null) watch(parent);
        }
      }
      return targets ?? [];
    };

    const measure = (): void => {
      frame = null;
      pending = false;
      const current = ensureTargets();
      const first = current.find((element): element is HTMLElement => element !== null && element.isConnected);
      if (first === undefined) return;
      const viewport = measureViewport(findScrollParent(first));
      const tops = current.map((element) =>
        element !== null && element.isConnected ? element.getBoundingClientRect().top : null,
      );
      const next = pickActive(tops, viewport.band, viewport.atEnd, viewport.bottom);
      if (next === lastRef.current) return;
      lastRef.current = next;
      onActiveRef.current(next);
    };

    const schedule = (): void => {
      if (pending) return;
      pending = true;
      const id = window.requestAnimationFrame(measure);
      if (pending) frame = id;
    };

    const onScroll = (): void => {
      const state = holdRef.current;
      if (state.active) {
        // Der Bildlauf des Sprungs: abwarten, bis er ruht.
        if (!state.settled) {
          settleLater();
          return;
        }
        state.active = false;
      }
      schedule();
    };

    function watch(target: EventTarget): void {
      if (watched.has(target)) return;
      watched.add(target);
      target.addEventListener("scroll", onScroll, { passive: true });
    }

    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", schedule, { passive: true });
    const ownParent = self === null ? null : findScrollParent(self);
    if (ownParent !== null) watch(ownParent);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", schedule);
      for (const target of watched) target.removeEventListener("scroll", onScroll);
      clearTimeout(holdRef.current.timer);
    };
  }, [resolve, self, settleLater]);

  return { hold };
}
