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

import { findById, findHeading, slugify } from "./heading-scan";

/** Baut `document.body` neu auf und gibt ihn zurück. */
function page(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body;
}

/** Hängt einen Shadow Root mit Inhalt an und liefert den Wirt. */
function withShadow(host: HTMLElement, html: string): HTMLElement {
  host.attachShadow({ mode: "open" }).innerHTML = html;
  return host;
}

describe("findHeading", () => {
  it("findet die erste passende Überschrift jeder Ebene", () => {
    page("<h2>Andere</h2><h4 id='treffer'>Ausstattung</h4><h2>Ausstattung</h2>");
    expect(findHeading("Ausstattung", null)?.id).toBe("treffer");
  });

  it("findet eine Überschrift in einem verschachtelten Shadow Root", () => {
    page("<div id='aussen'></div>");
    const aussen = withShadow(document.getElementById("aussen") as HTMLElement, "<div id='innen'></div>");
    withShadow(aussen.shadowRoot?.getElementById("innen") as HTMLElement, "<h2 id='tief'>Tief</h2>");
    expect(findHeading("Tief", null)?.id).toBe("tief");
  });

  it("lässt den eigenen Container aus, auch über eine Shadow-Grenze", () => {
    page("<div id='self'></div><h2 id='echt'>Echt</h2>");
    const self = withShadow(document.getElementById("self") as HTMLElement, "<h2>Echt</h2>");
    expect(findHeading("Echt", self)?.id).toBe("echt");
  });

  it("lässt die Überschriften jedes Ankernavigations-Widgets aus", () => {
    page("<anchor-nav-widget id='w'></anchor-nav-widget><h2 id='echt'>Auf einen Blick</h2>");
    withShadow(document.getElementById("w") as HTMLElement, "<h2>Auf einen Blick</h2>");
    expect(findHeading("Auf einen Blick", null)?.id).toBe("echt");
  });

  it("vergleicht mit normalisiertem Leerraum", () => {
    page("<h3 id='luft'>  Viel   Luft \n dazwischen </h3>");
    expect(findHeading(" Viel Luft  dazwischen", null)?.id).toBe("luft");
  });

  it("liefert null, wenn nichts passt, und für leeren Text", () => {
    page("<h2>Eins</h2><p>Zwei</p>");
    expect(findHeading("Zwei", null)).toBeNull();
    expect(findHeading("   ", null)).toBeNull();
  });
});

describe("slugify", () => {
  it("löst Umlaute und Eszett auf", () => {
    expect(slugify("Lösung für Straße")).toBe("loesung-fuer-strasse");
  });

  it("entfernt Diakritika anderer Sprachen", () => {
    expect(slugify("Café Niño")).toBe("cafe-nino");
  });

  it("zieht Sonderzeichen zu einem Bindestrich zusammen", () => {
    expect(slugify("Safety & Driver — Assistance")).toBe("safety-driver-assistance");
  });

  it("lässt keine Bindestriche an den Rändern stehen", () => {
    expect(slugify("  -Rand-  ")).toBe("rand");
  });

  it("liefert für Text ohne verwertbare Zeichen die leere Zeichenkette", () => {
    expect(slugify("!!!")).toBe("");
  });
});

// Die Auswahl im Editor speichert die Block-ID aus dem Seiten-JSON. Auf der
// Seite trägt eine Überschrift sie nur als `data-c13y-id`, kein `id` (live auf
// truck am 06.11.2026 so gesehen: der Klick setzte den Hash, gerollt wurde
// nichts).
describe("findById", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("findet ein Element über seine id", () => {
    document.body.innerHTML = `<div id="a1">Block</div>`;
    expect(findById("a1")?.textContent).toBe("Block");
  });

  it("findet eine Überschrift über data-c13y-id, auch im Shadow Root", () => {
    const host = document.createElement("div");
    host.attachShadow({ mode: "open" }).innerHTML = `<h2 data-c13y-id="b2">Fahrersitze</h2>`;
    document.body.appendChild(host);

    expect(findById("b2")?.textContent).toBe("Fahrersitze");
  });

  // Der Custom Block kopiert seine Vorfahren samt `data-c13y-*` als
  // `display: contents`-Attrappen in seinen Shadow Root; die haben keine Lage.
  it("überspringt die Attrappen-Kopien des Custom Blocks", () => {
    const host = document.createElement("div");
    host.attachShadow({ mode: "open" }).innerHTML = `<div data-c13y-id="c3" data-sb-c13y-ancestor-copy="">Kopie</div>`;
    document.body.appendChild(host);
    const echt = document.createElement("section");
    echt.setAttribute("data-c13y-id", "c3");
    echt.textContent = "Echt";
    document.body.appendChild(echt);

    expect(findById("c3")?.textContent).toBe("Echt");
  });

  it("liefert null, wenn nichts passt", () => {
    document.body.innerHTML = `<h2 data-c13y-id="x">X</h2>`;
    expect(findById("y")).toBeNull();
    expect(findById("")).toBeNull();
  });
});
