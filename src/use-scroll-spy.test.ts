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

import { BAND_FRACTION, pickActive, SETTLE_MS, useScrollSpy } from "./use-scroll-spy";

describe("pickActive", () => {
  it("nimmt das letzte Ziel oberhalb des Bandes", () => {
    expect(pickActive([10, 120, 400], 200, false)).toBe(1);
  });

  it("liefert null, solange kein Ziel das Band erreicht hat", () => {
    expect(pickActive([300, 600], 200, false)).toBeNull();
  });

  it("überspringt Ziele, die es auf der Seite nicht gibt", () => {
    expect(pickActive([10, null, 150], 200, false)).toBe(2);
  });

  // Am Seitenende rollen die letzten Abschnitte nie bis zum Band hinauf; dann
  // gilt der letzte, der überhaupt zu sehen ist.
  it("nimmt am Seitenende das letzte sichtbare Ziel", () => {
    expect(pickActive([-400, 300, 700], 200, true, 800)).toBe(2);
    expect(pickActive([-400, 300, 900], 200, true, 800)).toBe(1);
  });
});

/** Ein Ziel, dessen Oberkante der Test bestimmt. */
function target(top: { value: number }): HTMLElement {
  const element = document.createElement("h2");
  element.getBoundingClientRect = () => ({ top: top.value }) as DOMRect;
  document.body.appendChild(element);
  return element;
}

describe("useScrollSpy", () => {
  const band = window.innerHeight * BAND_FRACTION;
  let frames: FrameRequestCallback[] = [];

  beforeEach(() => {
    jest.useFakeTimers();
    frames = [];
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    document.body.innerHTML = "";
  });

  const flushFrames = (): void => {
    act(() => {
      const pending = frames;
      frames = [];
      pending.forEach((callback) => callback(0));
    });
  };

  const scroll = (): void => {
    act(() => {
      document.dispatchEvent(new Event("scroll"));
    });
    flushFrames();
  };

  it("löst die Ziele erst beim ersten Scrollen auf, nicht beim Laden", () => {
    const resolve = jest.fn(() => [target({ value: 500 })]);
    renderHook(() => useScrollSpy({ resolve, self: null, onActive: jest.fn() }));
    flushFrames();
    expect(resolve).not.toHaveBeenCalled();

    scroll();
    expect(resolve).toHaveBeenCalledTimes(1);

    scroll();
    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it("meldet den Abschnitt, der gerade das Band erreicht hat", () => {
    const first = { value: 500 };
    const second = { value: 900 };
    const elements = [target(first), target(second)];
    const onActive = jest.fn();
    renderHook(() => useScrollSpy({ resolve: () => elements, self: null, onActive }));

    first.value = band - 10;
    scroll();
    expect(onActive).toHaveBeenLastCalledWith(0);

    first.value = -800;
    second.value = band - 5;
    scroll();
    expect(onActive).toHaveBeenLastCalledWith(1);

    first.value = band - 1;
    second.value = 2000;
    scroll();
    expect(onActive).toHaveBeenLastCalledWith(0);
  });

  // Nach einem Klick rollt die Seite selbst zum Ziel; die Abschnitte, an
  // denen sie dabei vorbeizieht, dürfen die Marke nicht mitnehmen. Erst wenn
  // der Nutzer danach wieder scrollt, folgt sie ihm.
  it("hält einen geklickten Eintrag, bis der Nutzer nach dem Sprung wieder scrollt", () => {
    const first = { value: band - 10 };
    const second = { value: 900 };
    const elements = [target(first), target(second)];
    const onActive = jest.fn();
    const { result } = renderHook(() => useScrollSpy({ resolve: () => elements, self: null, onActive }));

    act(() => result.current.hold());
    scroll();
    scroll();
    expect(onActive).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(SETTLE_MS + 10);
    });
    expect(onActive).not.toHaveBeenCalled();

    scroll();
    expect(onActive).toHaveBeenLastCalledWith(0);
  });

  it("löst neu auf, wenn ein Ziel die Seite verlassen hat", () => {
    const top = { value: band - 10 };
    let current = target(top);
    const resolve = jest.fn(() => [current]);
    renderHook(() => useScrollSpy({ resolve, self: null, onActive: jest.fn() }));

    scroll();
    current.remove();
    current = target(top);
    scroll();
    // Höchstens einmal je Sekunde: ein Ziel, das dauerhaft fehlt, soll nicht
    // bei jedem Bild einen Durchlauf über die Seite auslösen.
    expect(resolve).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(1100);
    });
    scroll();
    expect(resolve).toHaveBeenCalledTimes(2);
  });

  it("meldet sich beim Abbau ab", () => {
    const onActive = jest.fn();
    const { unmount } = renderHook(() =>
      useScrollSpy({ resolve: () => [target({ value: 0 })], self: null, onActive }),
    );
    unmount();
    act(() => {
      document.dispatchEvent(new Event("scroll"));
    });
    flushFrames();
    expect(onActive).not.toHaveBeenCalled();
  });
});
