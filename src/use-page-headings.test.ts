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

import { act, renderHook } from "@testing-library/react";

import { RESCAN_DELAY_MS, usePageHeadings } from "./use-page-headings";
import type { ScannedHeading } from "./heading-scan";

/**
 * Lässt die Entprellung ablaufen und die Zustandsänderung durch React laufen.
 *
 * Zwei Schritte, nicht einer: `MutationObserver` benachrichtigt über eine echte
 * Mikrotask, die erst beim ersten `await` nach der DOM-Änderung verarbeitet
 * wird — also erst *nach* einem bereits laufenden `advanceTimersByTime`-Aufruf.
 * Der erste `act`-Aufruf lässt genau diese Mikrotask (und damit das Planen des
 * Entprellungs-Timers) ablaufen, bevor der zweite die Uhr vorspult.
 */
const settle = async (): Promise<void> => {
  await act(async () => {});
  await act(async () => {
    jest.advanceTimersByTime(RESCAN_DELAY_MS);
  });
};

describe("usePageHeadings", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = "";
  });

  afterEach(() => jest.useRealTimers());

  it("liefert nach dem Mount die Überschriften des Dokuments", () => {
    document.body.innerHTML = "<h2>Eins</h2><h2>Zwei</h2>";
    const { result } = renderHook(() => usePageHeadings("h2", null, false));
    expect(result.current.map((h) => h.text)).toEqual(["Eins", "Zwei"]);
  });

  it("nimmt eine neu eingefügte Überschrift nach der Entprellung auf", async () => {
    document.body.innerHTML = "<h2>Eins</h2>";
    const { result } = renderHook(() => usePageHeadings("h2", null, false));

    act(() => {
      document.body.insertAdjacentHTML("beforeend", "<h2>Zwei</h2>");
    });
    await settle();

    expect(result.current.map((h) => h.text)).toEqual(["Eins", "Zwei"]);
  });

  it("nimmt einen geänderten Überschriftentext auf", async () => {
    document.body.innerHTML = "<h2>Eins</h2>";
    const { result } = renderHook(() => usePageHeadings("h2", null, false));

    act(() => {
      (document.querySelector("h2") as HTMLElement).textContent = "Anders";
    });
    await settle();

    expect(result.current.map((h) => h.text)).toEqual(["Anders"]);
  });

  it("liefert dieselbe Liste weiter, wenn eine fremde Änderung nichts am Verzeichnis ändert", async () => {
    document.body.innerHTML = "<h2>Eins</h2><p id='text'>Alt</p>";
    const { result } = renderHook(() => usePageHeadings("h2", null, false));
    const vorher = result.current;

    act(() => {
      (document.getElementById("text") as HTMLElement).textContent = "Neu";
    });
    await settle();

    expect(result.current).toBe(vorher);
  });

  it("scannt nach einem Wechsel der Ebene neu", () => {
    document.body.innerHTML = "<h2>Zwei</h2><h3>Drei</h3>";
    // Ohne die Hilfe des Typparameters leitet TypeScript aus `initialProps` die enge Variante "h2"
    // ab und weist dann das spaetere "h3" zurueck.
    type Props = { level: "h2" | "h3" };
    const { result, rerender } = renderHook<readonly ScannedHeading[], Props>(({ level }) => usePageHeadings(level, null, false), {
      initialProps: { level: "h2" },
    });
    expect(result.current.map((h) => h.text)).toEqual(["Zwei"]);

    rerender({ level: "h3" });
    expect(result.current.map((h) => h.text)).toEqual(["Drei"]);
  });

  it("scannt trotz andauernder Mutationen spätestens nach der oberen Schranke", async () => {
    // Reines Trailing-Debounce verhungert, wenn nie eine Lücke von
    // RESCAN_DELAY_MS entsteht: jede neue Mutation setzt den Timer zurück,
    // bevor er feuert. Hier kommt alle 100ms (< RESCAN_DELAY_MS) eine neue
    // Mutation — ohne obere Schranke bliebe das Verzeichnis für immer auf
    // "Eins" stehen, obwohl der Text längst ein anderer ist.
    document.body.innerHTML = "<h2 id='h'>Eins</h2>";
    const { result } = renderHook(() => usePageHeadings("h2", null, false));
    expect(result.current.map((h) => h.text)).toEqual(["Eins"]);

    const schritte = Math.ceil(1000 / 100) + 1; // überschreitet die 1-Sekunden-Schranke
    for (let index = 1; index <= schritte; index += 1) {
      act(() => {
        (document.getElementById("h") as HTMLElement).textContent = `Text ${index}`;
      });
      await act(async () => {}); // die MutationObserver-Benachrichtigung verarbeiten
      await act(async () => {
        jest.advanceTimersByTime(100);
      });
    }

    expect(result.current.map((h) => h.text)).not.toEqual(["Eins"]);
  });

  it("meldet den Observer beim Unmount ab", async () => {
    document.body.innerHTML = "<h2>Eins</h2>";
    const { result, unmount } = renderHook(() => usePageHeadings("h2", null, false));
    const vorher = result.current;

    unmount();
    document.body.insertAdjacentHTML("beforeend", "<h2>Zwei</h2>");
    await settle();

    expect(result.current).toBe(vorher);
  });
});
