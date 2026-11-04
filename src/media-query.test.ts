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

import { COMPACT_QUERY, REDUCED_MOTION_QUERY, useMediaQuery } from "./media-query";

type Listener = (event: { matches: boolean }) => void;

/** Stellt `matchMedia` und liefert einen Schalter, der die Antwort ändert. */
function installMatchMedia(initial: boolean): (next: boolean) => void {
  const listeners = new Set<Listener>();
  let matches = initial;

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      get matches() {
        return matches;
      },
      media: query,
      addEventListener: (_type: string, listener: Listener) => listeners.add(listener),
      removeEventListener: (_type: string, listener: Listener) => listeners.delete(listener),
    }),
  });

  return (next: boolean) => {
    matches = next;
    listeners.forEach((listener) => listener({ matches: next }));
  };
}

describe("useMediaQuery", () => {
  afterEach(() => {
    delete (window as { matchMedia?: unknown }).matchMedia;
  });

  it("liefert den Stand bei der ersten Darstellung", () => {
    installMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery(COMPACT_QUERY));
    expect(result.current).toBe(true);
  });

  it("folgt einer Änderung", () => {
    const set = installMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery(COMPACT_QUERY));
    expect(result.current).toBe(false);

    act(() => set(true));

    expect(result.current).toBe(true);
  });

  it("liefert false, wenn die Umgebung kein matchMedia kennt", () => {
    const { result } = renderHook(() => useMediaQuery(REDUCED_MOTION_QUERY));
    expect(result.current).toBe(false);
  });

  it("fragt unterhalb von 768px nach der kompakten Darstellung", () => {
    expect(COMPACT_QUERY).toBe("(max-width: 767px)");
  });
});
