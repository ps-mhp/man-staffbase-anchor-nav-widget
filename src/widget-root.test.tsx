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

import React from "react";
import { act, render, screen } from "@testing-library/react";

import { RESOLVE_RETRY_MS } from "./use-resolved-headings";
import { AnchorNavWidget } from "./widget-root";

/** Stellt `matchMedia` auf „nichts trifft zu": volle Darstellung, weiche Übergänge. */
function setMedia(): void {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
}

describe("AnchorNavWidget", () => {
  beforeEach(() => {
    setMedia();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    delete (window as { matchMedia?: unknown }).matchMedia;
  });

  /** Ein Attribut, wie das Studio es schreibt: die Texte in Seitenreihenfolge. */
  const attr = (...texts: string[]): string => JSON.stringify(texts);

  it("zeigt die erfassten Überschriften der gewählten Ebene", () => {
    document.body.innerHTML = "<h3>Drei</h3><h2>Zwei</h2>";
    render(
      <AnchorNavWidget
        level="h3"
        heading="Auf einen Blick"
        self={null}
        blocksOnly={false}
        headings={attr("Drei", "Zwei")}
      />,
    );
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["Drei"]);
  });

  it("gibt nichts aus, solange im Studio nichts erfasst wurde", () => {
    document.body.innerHTML = "<h2>Zwei</h2>";
    const { container } = render(
      <AnchorNavWidget level="h2" heading="Auf einen Blick" self={null} blocksOnly={false} headings={undefined} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("wendet die Beschränkung auf Title- und Text-Blöcke auf das Erfasste an", () => {
    document.body.innerHTML = `
      <div data-c13y-component="text-container-block"><h2>Abschnitt</h2></div>
      <div data-sb-custom-block-widget-host><h2>Aus einem Widget</h2></div>`;
    render(
      <AnchorNavWidget
        level="h2"
        heading={null}
        self={null}
        blocksOnly={true}
        headings={attr("Abschnitt", "Aus einem Widget")}
      />,
    );
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["Abschnitt"]);
  });

  it("beobachtet die Seite nicht und gibt die Suche nach endlich vielen Versuchen auf", async () => {
    // Der Kern dieses Umbaus: auf der veröffentlichten Seite hängt kein
    // `MutationObserver` mehr am Dokument.
    const observe = jest.spyOn(MutationObserver.prototype, "observe");
    jest.useFakeTimers();
    const timeout = jest.spyOn(global, "setTimeout");
    const retries = (): number =>
      timeout.mock.calls.filter(([, delay]) => RESOLVE_RETRY_MS.includes(delay as number)).length;
    try {
      document.body.innerHTML = "<h2>Da</h2>";
      render(
        <AnchorNavWidget
          level="h2"
          heading={null}
          self={null}
          blocksOnly={false}
          headings={attr("Da", "Kommt nie")}
        />,
      );
      await act(async () => {
        jest.advanceTimersByTime(60_000);
      });
      expect(retries()).toBe(RESOLVE_RETRY_MS.length);
      await act(async () => {
        jest.advanceTimersByTime(600_000);
      });
      expect(retries()).toBe(RESOLVE_RETRY_MS.length);
      expect(observe).not.toHaveBeenCalled();
      expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["Da"]);
    } finally {
      timeout.mockRestore();
      jest.useRealTimers();
      observe.mockRestore();
    }
  });

  it("nimmt eine Überschrift auf, die erst nach dem Widget erscheint", async () => {
    jest.useFakeTimers();
    try {
      document.body.innerHTML = "";
      render(
        <AnchorNavWidget level="h2" heading={null} self={null} blocksOnly={false} headings={attr("Später")} />,
      );
      expect(screen.queryAllByRole("link")).toHaveLength(0);

      document.body.insertAdjacentHTML("beforeend", "<h2>Später</h2>");
      await act(async () => {
        jest.advanceTimersByTime(RESOLVE_RETRY_MS[0]);
      });
      expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["Später"]);
    } finally {
      jest.useRealTimers();
    }
  });
});
