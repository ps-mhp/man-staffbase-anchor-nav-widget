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

import { findScrollParent } from "./scroll-ancestor";

/** Macht `element` zu einem echten Roller: jsdom liefert sonst immer 0/0. */
function makeScrollable(element: HTMLElement): void {
  element.style.overflowY = "auto";
  Object.defineProperty(element, "scrollHeight", { configurable: true, value: 2000 });
  Object.defineProperty(element, "clientHeight", { configurable: true, value: 400 });
}

describe("findScrollParent", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    // `makeScrollable` greift in manchen Fällen auf body/documentElement
    // selbst durch (B1) statt nur auf ein wegwerfbares Kind-Element — ohne
    // Rückbau bliebe die Umstellung über Testgrenzen hinweg bestehen.
    for (const node of [document.body, document.documentElement]) {
      node.style.overflowY = "";
      delete (node as unknown as { scrollHeight?: number }).scrollHeight;
      delete (node as unknown as { clientHeight?: number }).clientHeight;
    }
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

  // B1: die Wirtsseite setzt `.desktop > body { overflow-y: scroll }`
  // (resources/css/app.css). Rollt der body selbst über — absolut
  // positionierte Brotkrumen oder Chrome im Bezugssystem des body sind
  // plausible Auslöser —, liefert jsdoms `getComputedStyle` hier (anders
  // als im Standardfall, wo es immer `"visible"` meldet) tatsächlich
  // `overflowY: "scroll"`. Ohne Ausschluss hielte `isScrollableElement` das
  // für einen echten Treffer; `body.scrollTo(...)` ist im Standards-Modus
  // aber wirkungslos, weil `body` keine eigene Scrolling-Box hat — das
  // Dokument rollt über `window`, nicht über `body`.
  it("schließt body als Treffer aus, auch wenn es selbst überläuft", () => {
    makeScrollable(document.body);
    const element = document.createElement("h2");
    document.body.appendChild(element);

    expect(findScrollParent(element)).toBeNull();
  });

  it("schließt documentElement als Treffer aus, auch wenn es selbst überläuft", () => {
    makeScrollable(document.documentElement);
    const element = document.createElement("h2");
    document.body.appendChild(element);

    expect(findScrollParent(element)).toBeNull();
  });

  it("schließt document.scrollingElement als Treffer aus", () => {
    // jsdom implementiert `document.scrollingElement` nicht (liefert
    // `undefined`) — ohne eigenen Stellvertreter bliebe dieser Fall unsichtbar,
    // genau wie die anderen jsdom-Lücken in diesem Widget. Ein frei
    // erfundenes Element steht hier stellvertretend für das, was der
    // Standard sonst selbst als `documentElement`/`body` zurückgäbe: der
    // Ausschluss muss über den tatsächlichen Rückgabewert laufen, nicht über
    // eine fest verdrahtete Identitätsprüfung auf `documentElement`.
    const scrollingElement = document.createElement("div");
    makeScrollable(scrollingElement);
    const restore = Object.getOwnPropertyDescriptor(document, "scrollingElement");
    Object.defineProperty(document, "scrollingElement", { configurable: true, value: scrollingElement });
    const element = document.createElement("h2");
    scrollingElement.appendChild(element);
    document.body.appendChild(scrollingElement);

    try {
      expect(findScrollParent(element)).toBeNull();
    } finally {
      if (restore) Object.defineProperty(document, "scrollingElement", restore);
      else delete (document as unknown as { scrollingElement?: unknown }).scrollingElement;
    }
  });

  it("findet weiterhin einen echten Container, der zwischen Überschrift und body liegt", () => {
    // Der Ausschluss von body/documentElement darf nicht dazu führen, dass
    // die Suche insgesamt aufgibt — ein echter Container weiter innen muss
    // trotzdem gefunden werden.
    makeScrollable(document.body);
    const container = document.createElement("div");
    makeScrollable(container);
    const element = document.createElement("h2");
    container.appendChild(element);
    document.body.appendChild(container);

    expect(findScrollParent(element)).toBe(container);
  });
});
