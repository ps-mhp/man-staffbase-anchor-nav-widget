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

import {
  CapturedHeading,
  captureHeadings,
  encodeHeadings,
  readHeadings,
  resolveHeadings,
  sameHeadings,
  selectHeadings,
  slugify,
} from "./heading-scan";

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

/** Die Texte, die das Verzeichnis für Ebene und Filter zeigte. */
const shown = (level: "h1" | "h2" | "h3", blocksOnly: boolean, exclude: Node[] = []): string[] =>
  selectHeadings(captureHeadings(document.body, exclude), level, blocksOnly).map((entry) => entry.text);

describe("captureHeadings", () => {
  it("erfasst alle Ebenen in Dokumentreihenfolge", () => {
    page("<h1>Titel</h1><h2>Eins</h2><p>Text</p><h3>Unter</h3><h2>Zwei</h2>");
    expect(captureHeadings(document.body).map((h) => [h.level, h.text])).toEqual([
      [1, "Titel"],
      [2, "Eins"],
      [3, "Unter"],
      [2, "Zwei"],
    ]);
  });

  it("findet eine Überschrift in einem verschachtelten Shadow Root", () => {
    page("<div id='aussen'></div>");
    const aussen = withShadow(document.getElementById("aussen") as HTMLElement, "<div id='innen'></div>");
    withShadow(aussen.shadowRoot?.getElementById("innen") as HTMLElement, "<h2>Tief</h2>");
    expect(shown("h2", false)).toEqual(["Tief"]);
  });

  it("lässt aus, was in `exclude` liegt — den Dialog —, auch über eine Shadow-Grenze", () => {
    page("<div id='host'></div><h2>Echt</h2>");
    const host = withShadow(document.getElementById("host") as HTMLElement, "<div id='dlg'><h2>Einstellungen</h2></div>");
    expect(shown("h2", false, [host.shadowRoot?.getElementById("dlg") as HTMLElement])).toEqual(["Echt"]);
  });

  it("lässt die Überschriften jedes Ankernavigations-Widgets aus", () => {
    page("<anchor-nav-widget id='w'></anchor-nav-widget><h2>Echt</h2>");
    withShadow(document.getElementById("w") as HTMLElement, "<h2>Auf einen Blick</h2>");
    expect(shown("h2", false)).toEqual(["Echt"]);
  });

  it("überspringt leere Überschriften und normalisiert Leerraum", () => {
    page("<h2>   </h2><h2>  Viel   Luft \n dazwischen </h2>");
    expect(shown("h2", false)).toEqual(["Viel Luft dazwischen"]);
  });
});

describe("captureHeadings: Herkunft aus Title- und Text-Blöcken", () => {
  // Aufbau wie im Content Designer, am 05.11.2026 live abgelesen: die
  // Überschrift eines Widgets hat keinen eigenen Baustein-Marker, ihre Kette
  // beginnt direkt bei `column-block`.
  const SEITE = `
    <div data-c13y-component="section-block">
      <div data-c13y-component="column-block">
        <div data-c13y-component="title-block"><h2>Aus dem Title-Block</h2></div>
        <div data-c13y-component="text-container-block">
          <div data-c13y-component="big-heading-block"><h2>Aus dem Text-Block</h2></div>
        </div>
        <div data-sb-custom-block-widget-host><h2>Aus einem Widget</h2></div>
        <h2>Ohne Baustein</h2>
      </div>
    </div>`;

  it("nimmt mit Filter nur Title- und Text-Block, ohne Filter alles", () => {
    page(SEITE);
    expect(shown("h2", true)).toEqual(["Aus dem Title-Block", "Aus dem Text-Block"]);
    expect(shown("h2", false)).toHaveLength(4);
  });

  it("filtert, was ein Widget in seinem Shadow Root führt", () => {
    page(`
      <div data-c13y-component="column-block">
        <div data-c13y-component="title-block"><h2>Abschnitt</h2></div>
        <div data-sb-custom-block-widget-host id="host"></div>
      </div>`);
    withShadow(document.getElementById("host") as HTMLElement, "<h2>Im Widget</h2>");
    expect(shown("h2", true)).toEqual(["Abschnitt"]);
  });

  it("lässt einen Title-Block innerhalb eines Widgets nicht durch", () => {
    // Der Aufstieg trifft den Wirt vor dem Baustein darüber: die Überschrift
    // gehört dem Widget, nicht dem Block, in dem das Widget steht.
    page(`
      <div data-c13y-component="title-block">
        <div data-sb-custom-block-widget-host><h2>Im Widget</h2></div>
      </div>`);
    expect(shown("h2", true)).toEqual([]);
  });

  it("zählt auf einer Seite ohne Marken des Content Designers jede Überschrift", () => {
    // Klassischer Editor: ohne Rückfall bliebe das Verzeichnis leer, und der
    // Redakteur sähe den Grund nicht.
    page("<article><h2>Eins</h2><h2>Zwei</h2></article>");
    expect(shown("h2", true)).toEqual(["Eins", "Zwei"]);
  });

  // Der Fall, an dem rc.2 scheiterte: Staffbase rendert die Bausteine selbst
  // in Shadow Roots. Eine Prüfung über `document` sieht dort keine einzige
  // Marke, schließt auf „kein Content Designer“ und schaltet den Filter still ab.
  it("sieht Bausteine, die in einem Shadow Root liegen", () => {
    page("<div id='seite'></div>");
    withShadow(
      document.getElementById("seite") as HTMLElement,
      `<div data-c13y-component="column-block">
         <div data-c13y-component="title-block"><h2>Abschnitt</h2></div>
         <div data-sb-custom-block-widget-host><h2>Aus einem Widget</h2></div>
       </div>`,
    );
    expect(document.querySelectorAll("[data-c13y-component]")).toHaveLength(0);
    expect(shown("h2", true)).toEqual(["Abschnitt"]);
  });

  it("filtert auch, wenn jede Überschrift in einem Widget steckt", () => {
    // Der Aufstieg darf beim Urteil nicht abbrechen: sonst sähe er die Marke
    // oberhalb des Wirts nie und hielte die Seite für eine klassische.
    page(`
      <div data-c13y-component="column-block">
        <div data-sb-custom-block-widget-host><h2>Aus einem Widget</h2></div>
      </div>`);
    expect(shown("h2", true)).toEqual([]);
  });
});

describe("encodeHeadings / readHeadings", () => {
  const HEADINGS: CapturedHeading[] = [
    { level: 1, text: "Titel", inBlock: true },
    { level: 2, text: "Aus „Widget“", inBlock: false },
  ];

  it("übersteht den Weg durch das Attribut unverändert", () => {
    expect(readHeadings(encodeHeadings(HEADINGS))).toEqual(HEADINGS);
  });

  it("nimmt auch ein bereits dekodiertes Array", () => {
    expect(readHeadings(JSON.parse(encodeHeadings(HEADINGS)))).toEqual(HEADINGS);
  });

  it("liefert für fehlende oder kaputte Werte eine leere Liste", () => {
    expect(readHeadings(undefined)).toEqual([]);
    expect(readHeadings("")).toEqual([]);
    expect(readHeadings("{kaputt")).toEqual([]);
    expect(readHeadings('{"a":1}')).toEqual([]);
  });

  it("verwirft einzelne ungültige Einträge und behält den Rest", () => {
    expect(readHeadings('[[7,"Zu tief",1],[2,"",1],"x",[2,"Gut",1]]')).toEqual([
      { level: 2, text: "Gut", inBlock: true },
    ]);
  });
});

describe("selectHeadings", () => {
  it("macht gleiche Texte über den Slug unterscheidbar", () => {
    const same = { level: 2, text: "Thema", inBlock: true };
    expect(selectHeadings([same, same, same], "h2", false).map((e) => e.slug)).toEqual([
      "thema",
      "thema-2",
      "thema-3",
    ]);
  });

  it("nummeriert Ersatz-Slugs nach der gefilterten Liste", () => {
    const headings = [
      { level: 2, text: "!!!", inBlock: false },
      { level: 2, text: "???", inBlock: true },
    ];
    expect(selectHeadings(headings, "h2", true).map((e) => e.slug)).toEqual(["abschnitt-1"]);
  });
});

describe("resolveHeadings", () => {
  it("ordnet gleichlautende Einträge der Reihe nach je einer eigenen Überschrift zu", () => {
    page("<h2>Thema</h2><h2>Thema</h2>");
    const [a, b] = Array.from(document.querySelectorAll("h2"));
    const entries = selectHeadings(
      [
        { level: 2, text: "Thema", inBlock: true },
        { level: 2, text: "Thema", inBlock: true },
      ],
      "h2",
      false,
    );
    expect(resolveHeadings(entries, "h2", null)).toEqual([a, b]);
  });

  it("überspringt Überschriften, die das Verzeichnis nicht führt", () => {
    page("<h2>Eins</h2><h2>Aus einem Widget</h2><h2>Zwei</h2>");
    const entries = [
      { text: "Eins", slug: "eins" },
      { text: "Zwei", slug: "zwei" },
    ];
    expect(resolveHeadings(entries, "h2", null).map((e) => e?.textContent)).toEqual(["Eins", "Zwei"]);
  });

  it("liefert `null` für einen fehlenden Eintrag, ohne die folgenden zu verlieren", () => {
    page("<h2>Eins</h2><h2>Drei</h2>");
    const entries = [
      { text: "Eins", slug: "eins" },
      { text: "Zwei", slug: "zwei" },
      { text: "Drei", slug: "drei" },
    ];
    expect(resolveHeadings(entries, "h2", null).map((e) => e?.textContent ?? null)).toEqual(["Eins", null, "Drei"]);
  });

  it("findet Überschriften im Shadow Root und lässt den eigenen Container aus", () => {
    page("<div id='self'><h2>Thema</h2></div><div id='host'></div>");
    withShadow(document.getElementById("host") as HTMLElement, "<h2>Thema</h2>");
    const self = document.getElementById("self") as HTMLElement;
    const [found] = resolveHeadings([{ text: "Thema", slug: "thema" }], "h2", self);
    expect(found).not.toBeNull();
    expect(self.contains(found)).toBe(false);
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
  const eins = document.createElement("h2");
  const zwei = document.createElement("h2");
  const liste = (...pairs: [HTMLElement, string][]) =>
    pairs.map(([element, text]) => ({ element, text, slug: slugify(text) }));

  it("erkennt eine unveränderte Liste", () => {
    expect(sameHeadings(liste([eins, "Eins"], [zwei, "Zwei"]), liste([eins, "Eins"], [zwei, "Zwei"]))).toBe(true);
  });

  it("erkennt eine geänderte Länge", () => {
    expect(sameHeadings(liste([eins, "Eins"]), liste([eins, "Eins"], [zwei, "Zwei"]))).toBe(false);
  });

  it("erkennt ein anderes Element bei gleichem Text", () => {
    expect(sameHeadings(liste([eins, "Eins"]), liste([zwei, "Eins"]))).toBe(false);
  });
});
