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

import * as React from "react";
import { act, fireEvent, render, within } from "@testing-library/react";

import { AnchorLink } from "./anchor-links";
import { AnchorNav } from "./anchor-nav";
import { railNeighbours } from "./anchor-rail";
import { resolveAnchorNav, serializeAnchorNavConfig, readStoredConfig } from "./anchor-nav-config";

const rail = (): HTMLElement | null =>
  document.querySelector("[data-man-anchor-rail]")?.shadowRoot?.querySelector<HTMLElement>("[data-testid=anchor-rail]") ?? null;

function page(...labels: string[]): AnchorLink[] {
  for (const label of labels) {
    const element = document.createElement("h2");
    element.textContent = label;
    element.getBoundingClientRect = () => ({ top: 500 }) as DOMRect;
    document.body.appendChild(element);
  }
  return labels.map((label, index) => ({ id: `l${index}`, label }));
}

describe("AnchorRail", () => {
  let scrollTo: jest.SpyInstance;
  beforeEach(() => {
    scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  });
  afterEach(() => {
    scrollTo.mockRestore();
    document.body.innerHTML = "";
  });

  const scroll = (): void => {
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
  };

  it("erscheint erst beim Scrollen, springt mit den Pfeilen und zeigt die Titel", () => {
    render(<AnchorNav links={page("Eins", "Zwei", "Drei")} heading={null} self={null} />);
    expect(rail()).toBeNull();
    scroll();
    const nav = rail();
    expect(nav).not.toBeNull();
    const ticks = within(nav as HTMLElement).getAllByRole("button", { name: /^(Eins|Zwei|Drei)$/ });
    expect(ticks.map((tick) => tick.getAttribute("aria-label"))).toEqual(["Eins", "Zwei", "Drei"]);
    expect(within(nav as HTMLElement).getByRole("button", { name: "Vorheriger Abschnitt" })).toBeDisabled();
    // Der Pfeil nennt, wohin er springt – auch im Tooltip daneben.
    const down = within(nav as HTMLElement).getByRole("button", { name: "Nächster Abschnitt: Eins" });
    expect(down.nextElementSibling).toHaveTextContent("Eins");

    fireEvent.click(down);
    expect(scrollTo).toHaveBeenCalled();
    expect(ticks[0]).toHaveAttribute("aria-current", "true");
    expect(window.location.hash).toBe("#eins");

    expect(within(nav as HTMLElement).getByRole("button", { name: "Vorheriger Abschnitt" })).toBeDisabled();
    fireEvent.click(within(nav as HTMLElement).getByRole("button", { name: "Nächster Abschnitt: Zwei" }));
    expect(ticks[1]).toHaveAttribute("aria-current", "true");
    expect(within(nav as HTMLElement).getByRole("button", { name: "Vorheriger Abschnitt: Eins" })).toBeEnabled();
    fireEvent.click(ticks[2]);
    expect(ticks[2]).toHaveAttribute("aria-current", "true");
    expect(within(nav as HTMLElement).getByRole("button", { name: "Nächster Abschnitt" })).toBeDisabled();
  });

  it("fehlt, wenn abgeschaltet, in der Vorschau oder mit nur einem Ziel – und erscheint je Seite nur einmal", () => {
    const links = page("Eins", "Zwei");
    const { unmount } = render(<AnchorNav links={links} heading={null} self={null} rail={false} />);
    scroll();
    expect(rail()).toBeNull();
    unmount();

    render(<AnchorNav links={links} heading={null} self={null} preview={{ compact: false }} />);
    render(<AnchorNav links={[links[0]]} heading={null} self={null} />);
    scroll();
    expect(rail()).toBeNull();

    render(<AnchorNav links={links} heading={null} self={null} />);
    render(<AnchorNav links={links} heading={null} self={null} />);
    scroll();
    expect(document.querySelectorAll("[data-man-anchor-rail]")).toHaveLength(1);
  });

  it("nennt die Nachbarn des aktiven Eintrags", () => {
    const entries = [{ index: 0, label: "a" }, { index: 2, label: "c" }];
    expect(railNeighbours(entries, null)).toEqual({ previous: undefined, next: 0 });
    expect(railNeighbours(entries, 0)).toEqual({ previous: undefined, next: 2 });
    expect(railNeighbours(entries, 2)).toEqual({ previous: 0, next: undefined });
  });
});

describe("rail in anchor-nav-config", () => {
  it("speichert nur das Abschalten und liest fehlend als an", () => {
    expect(readStoredConfig(serializeAnchorNavConfig({ links: [], rail: false }))).toEqual({ links: [], rail: false });
    expect(readStoredConfig(serializeAnchorNavConfig({ links: [], rail: true }))).toEqual({ links: [] });
    expect(resolveAnchorNav({ "anchor-nav-config": serializeAnchorNavConfig({ rail: false }) }).rail).toBe(false);
    expect(resolveAnchorNav({}).rail).toBe(true);
  });
});

describe("AnchorRail und die sichtbare Navigation", () => {
  type Callback = (entries: { isIntersecting: boolean }[]) => void;
  let observed: { callback: Callback; target: Element | null; disconnect: jest.Mock }[] = [];

  beforeEach(() => {
    observed = [];
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
      private readonly entry: { callback: Callback; target: Element | null; disconnect: jest.Mock };
      constructor(callback: Callback) {
        this.entry = { callback, target: null, disconnect: jest.fn() };
        observed.push(this.entry);
      }
      observe(target: Element): void {
        this.entry.target = target;
      }
      disconnect(): void {
        this.entry.disconnect();
      }
    };
  });
  afterEach(() => {
    delete (window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver;
    document.body.innerHTML = "";
  });

  it("blendet die Leiste aus, solange die Navigation selbst zu sehen ist", () => {
    render(<AnchorNav links={page("Eins", "Zwei")} heading={null} self={null} />);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(observed).toHaveLength(1);
    expect(observed[0].target?.tagName).toBe("NAV");

    act(() => observed[0].callback([{ isIntersecting: true }]));
    expect(rail()).toBeNull();
    act(() => observed[0].callback([{ isIntersecting: false }]));
    expect(rail()).not.toBeNull();
  });
});
