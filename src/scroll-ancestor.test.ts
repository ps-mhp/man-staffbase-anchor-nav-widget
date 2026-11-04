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

import { findScrollParent, findScrollParents } from "./scroll-ancestor";

/** Macht `element` zu einem echten Roller: jsdom liefert sonst immer 0/0. */
function makeScrollable(element: HTMLElement): void {
  element.style.overflowY = "auto";
  Object.defineProperty(element, "scrollHeight", { configurable: true, value: 2000 });
  Object.defineProperty(element, "clientHeight", { configurable: true, value: 400 });
}

describe("findScrollParent", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("liefert null ohne rollfähigen Vorfahren", () => {
    const element = document.createElement("h2");
    document.body.appendChild(element);

    expect(findScrollParent(element)).toBeNull();
  });

  it("überspringt einen Vorfahren mit overflow:auto, der aber nicht wirklich rollt", () => {
    // `overflow: auto` erlaubt das Rollen, erzwingt es aber nicht — ohne
    // Inhalt, der über den Rahmen hinausragt, gibt es nichts zu rollen.
    const container = document.createElement("div");
    container.style.overflowY = "auto";
    Object.defineProperty(container, "scrollHeight", { configurable: true, value: 400 });
    Object.defineProperty(container, "clientHeight", { configurable: true, value: 400 });
    const element = document.createElement("h2");
    container.appendChild(element);
    document.body.appendChild(container);

    expect(findScrollParent(element)).toBeNull();
  });

  it("findet den nächsten rollfähigen Vorfahren", () => {
    const outer = document.createElement("div");
    makeScrollable(outer);
    const inner = document.createElement("div");
    const element = document.createElement("h2");
    inner.appendChild(element);
    outer.appendChild(inner);
    document.body.appendChild(outer);

    expect(findScrollParent(element)).toBe(outer);
  });

  it("nimmt den innersten rollfähigen Vorfahren, nicht einen weiter außen", () => {
    const outer = document.createElement("div");
    makeScrollable(outer);
    const innerScroller = document.createElement("div");
    makeScrollable(innerScroller);
    const element = document.createElement("h2");
    innerScroller.appendChild(element);
    outer.appendChild(innerScroller);
    document.body.appendChild(outer);

    expect(findScrollParent(element)).toBe(innerScroller);
  });

  it("überquert die Shadow-Root-Grenze zum Wirtselement", () => {
    // Weil der Content Designer Blöcke in Shadow Roots rendert, muss die
    // Suche über `host.shadowRoot` hinaus beim Host weitermachen, statt an
    // der Grenze abzubrechen (dort gäbe es sonst nur noch `document`).
    const host = document.createElement("div");
    makeScrollable(host);
    const shadow = host.attachShadow({ mode: "open" });
    const element = document.createElement("h2");
    shadow.appendChild(element);
    document.body.appendChild(host);

    expect(findScrollParent(element)).toBe(host);
  });

  it("macht hinter einem nicht rollenden Host weiter nach oben", () => {
    const grandparent = document.createElement("div");
    makeScrollable(grandparent);
    const host = document.createElement("div");
    const shadow = host.attachShadow({ mode: "open" });
    const element = document.createElement("h2");
    shadow.appendChild(element);
    grandparent.appendChild(host);
    document.body.appendChild(grandparent);

    expect(findScrollParent(element)).toBe(grandparent);
  });
});

describe("findScrollParents", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("liefert eine leere Liste ohne Elemente", () => {
    expect(findScrollParents([])).toEqual([]);
  });

  it("findet die rollfähigen Vorfahren mehrerer Elemente ohne Duplikate", () => {
    const shared = document.createElement("div");
    makeScrollable(shared);
    const eins = document.createElement("h2");
    const zwei = document.createElement("h2");
    shared.appendChild(eins);
    shared.appendChild(zwei);
    document.body.appendChild(shared);

    expect(findScrollParents([eins, zwei])).toEqual([shared]);
  });

  it("findet unterschiedliche rollfähige Vorfahren verschiedener Elemente", () => {
    const ersterContainer = document.createElement("div");
    makeScrollable(ersterContainer);
    const zweiterContainer = document.createElement("div");
    makeScrollable(zweiterContainer);
    const eins = document.createElement("h2");
    const zwei = document.createElement("h2");
    ersterContainer.appendChild(eins);
    zweiterContainer.appendChild(zwei);
    document.body.appendChild(ersterContainer);
    document.body.appendChild(zweiterContainer);

    expect(findScrollParents([eins, zwei])).toEqual([ersterContainer, zweiterContainer]);
  });
});
