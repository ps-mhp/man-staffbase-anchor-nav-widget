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

import { ScannedHeading } from "./heading-scan";
import { BAND_FRACTION, pickActive, useActiveHeading } from "./use-active-heading";

describe("pickActive", () => {
  it("liefert null ohne Überschriften", () => {
    expect(pickActive([], 100)).toBeNull();
  });

  it("liefert null, solange alle unterhalb des Bandes stehen", () => {
    expect(pickActive([200, 400, 600], 100)).toBeNull();
  });

  it("liefert den Index der einzigen Überschrift oberhalb des Bandes", () => {
    expect(pickActive([50, 400, 600], 100)).toBe(0);
  });

  it("liefert den letzten Index, wenn mehrere oberhalb stehen", () => {
    expect(pickActive([-800, -300, 50, 400], 100)).toBe(2);
  });

  it("zählt eine Überschrift genau auf dem Band als oberhalb", () => {
    expect(pickActive([100, 400], 100)).toBe(0);
  });
});

describe("useActiveHeading", () => {
  /** Baut Überschriften, deren Oberkante auf dem gewünschten Wert steht. */
  const headingsAt = (tops: readonly number[]): ScannedHeading[] =>
    tops.map((top, index) => {
      const element = document.createElement("h2");
      element.textContent = `Abschnitt ${index + 1}`;
      element.getBoundingClientRect = () => ({ top }) as DOMRect;
      return { element, text: element.textContent, slug: `abschnitt-${index + 1}` };
    });

  beforeEach(() => {
    Object.defineProperty(window, "innerHeight", { configurable: true, writable: true, value: 800 });
    // Sofort ausführen statt auf ein Bild zu warten: jsdom zeichnet nie.
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      writable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      },
    });
    Object.defineProperty(window, "cancelAnimationFrame", {
      configurable: true,
      writable: true,
      value: () => {},
    });
  });

  it("misst schon vor dem ersten Scrollen", () => {
    // Band = 800 * 0,25 = 200.
    const { result } = renderHook(() => useActiveHeading(headingsAt([-100, 150, 500])));
    expect(result.current).toBe(1);
  });

  it("folgt dem Scrollen", () => {
    const headings = headingsAt([-100, 150, 500]);
    const { result } = renderHook(() => useActiveHeading(headings));

    headings[2].element.getBoundingClientRect = () => ({ top: 10 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(2);
  });

  it("liefert null, solange keine Überschrift das Band erreicht hat", () => {
    const { result } = renderHook(() => useActiveHeading(headingsAt([300, 600])));
    expect(result.current).toBeNull();
  });

  it("misst auch bei geänderter Fenstergröße neu", () => {
    const { result } = renderHook(() => useActiveHeading(headingsAt([250, 600])));
    expect(result.current).toBeNull();

    // Band = 1600 * 0,25 = 400; die erste Überschrift liegt nun darüber.
    Object.defineProperty(window, "innerHeight", { configurable: true, writable: true, value: 1600 });
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(0);
  });

  it("meldet die Lauscher beim Unmount ab", () => {
    const remove = jest.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useActiveHeading(headingsAt([0])));

    unmount();

    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
    remove.mockRestore();
  });

  it("legt das Band auf ein Viertel der Fensterhöhe", () => {
    expect(BAND_FRACTION).toBe(0.25);
  });
});
