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

import { sameHeadings, scanHeadings, slugify } from "./heading-scan";

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

describe("scanHeadings", () => {
  it("findet die Überschriften der Ebene in Dokumentreihenfolge", () => {
    page("<h2>Eins</h2><p>Text</p><h2>Zwei</h2>");
    expect(scanHeadings("h2", null).map((h) => h.text)).toEqual(["Eins", "Zwei"]);
  });

  it("findet keine Überschriften anderer Ebenen", () => {
    page("<h1>Titel</h1><h3>Unterpunkt</h3>");
    expect(scanHeadings("h2", null)).toEqual([]);
  });

  it("findet eine Überschrift in einem Shadow Root", () => {
    page("<div id='host'></div>");
    withShadow(document.getElementById("host") as HTMLElement, "<h2>Versteckt</h2>");
    expect(scanHeadings("h2", null).map((h) => h.text)).toEqual(["Versteckt"]);
  });

  it("findet eine Überschrift in einem verschachtelten Shadow Root", () => {
    page("<div id='aussen'></div>");
    const aussen = withShadow(document.getElementById("aussen") as HTMLElement, "<div id='innen'></div>");
    const innen = aussen.shadowRoot?.getElementById("innen") as HTMLElement;
    withShadow(innen, "<h2>Tief</h2>");
    expect(scanHeadings("h2", null).map((h) => h.text)).toEqual(["Tief"]);
  });

  it("überspringt Überschriften im eigenen Container", () => {
    page("<div id='self'><h2>Auf einen Blick</h2></div><h2>Echt</h2>");
    const self = document.getElementById("self") as HTMLElement;
    expect(scanHeadings("h2", self).map((h) => h.text)).toEqual(["Echt"]);
  });

  it("überspringt den eigenen Container auch über eine Shadow-Grenze hinweg", () => {
    page("<div id='host'></div><h2>Echt</h2>");
    const host = withShadow(document.getElementById("host") as HTMLElement, "<div id='self'><h2>Auf einen Blick</h2></div>");
    const self = host.shadowRoot?.getElementById("self") as HTMLElement;
    expect(scanHeadings("h2", self).map((h) => h.text)).toEqual(["Echt"]);
  });

  it("überspringt Überschriften ohne sichtbaren Text", () => {
    page("<h2>   </h2><h2>Echt</h2>");
    expect(scanHeadings("h2", null).map((h) => h.text)).toEqual(["Echt"]);
  });

  it("trimmt den Text und zieht mehrfache Leerzeichen zusammen", () => {
    page("<h2>  Viel   Luft \n dazwischen </h2>");
    expect(scanHeadings("h2", null)[0].text).toBe("Viel Luft dazwischen");
  });

  it("liefert das Element selbst als Sprungziel", () => {
    page("<h2>Eins</h2>");
    expect(scanHeadings("h2", null)[0].element).toBe(document.querySelector("h2"));
  });

  it("macht gleiche Texte über den Slug unterscheidbar", () => {
    page("<h2>Thema</h2><h2>Thema</h2><h2>Thema</h2>");
    expect(scanHeadings("h2", null).map((h) => h.slug)).toEqual(["thema", "thema-2", "thema-3"]);
  });

  it("vergibt einen Ersatz-Slug, wenn der Text keinen hergibt", () => {
    page("<h2>!!!</h2>");
    expect(scanHeadings("h2", null)[0].slug).toBe("abschnitt-1");
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

describe("sameHeadings", () => {
  it("erkennt eine unveränderte Liste", () => {
    page("<h2>Eins</h2><h2>Zwei</h2>");
    expect(sameHeadings(scanHeadings("h2", null), scanHeadings("h2", null))).toBe(true);
  });

  it("erkennt eine geänderte Länge", () => {
    page("<h2>Eins</h2>");
    const vorher = scanHeadings("h2", null);
    page("<h2>Eins</h2><h2>Zwei</h2>");
    expect(sameHeadings(vorher, scanHeadings("h2", null))).toBe(false);
  });

  it("erkennt geänderten Text am selben Element", () => {
    page("<h2>Eins</h2>");
    const vorher = scanHeadings("h2", null);
    (document.querySelector("h2") as HTMLElement).textContent = "Anders";
    expect(sameHeadings(vorher, scanHeadings("h2", null))).toBe(false);
  });
});
