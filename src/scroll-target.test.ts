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

import { CHROME_SELECTOR, jumpTarget, measureChromeHeight } from "./scroll-target";

describe("jumpTarget", () => {
  it("rollt um die Oberkante abzüglich der Chrome-Höhe", () => {
    // 100 (Oberkante im Sichtbereich) + 500 (schon gerollt) - 64 (feste Leiste)
    expect(jumpTarget(100, 500, 64)).toBe(536);
  });

  it("verschiebt nicht, wenn keine Chrome im Weg steht", () => {
    expect(jumpTarget(100, 500, 0)).toBe(600);
  });

  it("rollt auch zu einer Überschrift oberhalb des Sichtbereichs", () => {
    expect(jumpTarget(-300, 500, 64)).toBe(136);
  });
});

describe("measureChromeHeight", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("liefert 0 ohne feste Chrome-Elemente", () => {
    expect(measureChromeHeight(document)).toBe(0);
  });

  it("liefert die Unterkante einer festen Kopfzeile", () => {
    const header = document.createElement("div");
    header.id = "header";
    header.style.position = "fixed";
    header.getBoundingClientRect = () => ({ bottom: 64, height: 64 }) as DOMRect;
    document.body.appendChild(header);

    expect(measureChromeHeight(document)).toBe(64);
  });

  it("ignoriert eine Kopfzeile, die im Textfluss steht", () => {
    // Eine Leiste im Fluss braucht keinen freigehaltenen Platz — sie nimmt
    // ihn sich selbst, anders als eine fixierte oder klebende.
    const header = document.createElement("div");
    header.id = "header";
    header.getBoundingClientRect = () => ({ bottom: 64, height: 64 }) as DOMRect;
    document.body.appendChild(header);

    expect(measureChromeHeight(document)).toBe(0);
  });

  it("ignoriert eine unsichtbare feste Leiste", () => {
    const header = document.createElement("div");
    header.id = "header";
    header.style.position = "fixed";
    header.style.display = "none";
    header.getBoundingClientRect = () => ({ bottom: 64, height: 64 }) as DOMRect;
    document.body.appendChild(header);

    expect(measureChromeHeight(document)).toBe(0);
  });

  it("nimmt die tiefste Unterkante mehrerer fester Leisten", () => {
    const header = document.createElement("div");
    header.id = "header";
    header.style.position = "fixed";
    header.getBoundingClientRect = () => ({ bottom: 64, height: 64 }) as DOMRect;
    document.body.appendChild(header);

    const toolbar = document.createElement("div");
    toolbar.id = "contextual-action-toolbar";
    toolbar.style.position = "sticky";
    toolbar.getBoundingClientRect = () => ({ bottom: 108, height: 44 }) as DOMRect;
    document.body.appendChild(toolbar);

    expect(measureChromeHeight(document)).toBe(108);
  });

  it("trägt dieselben Kennungen wie das Schwester-Widget", () => {
    expect(CHROME_SELECTOR).toBe("#header, #mega-menu, #contextual-action-toolbar");
  });
});
