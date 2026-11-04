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

import { decodePayload, encodePayload } from "@shared/payload";

import { HEADING_MARKER, anchorNavTranslationProvider as provider, readHeading } from "./translation-provider";

describe("readHeading", () => {
  it("liest einen von Hand eingetragenen Titel roh", () => {
    expect(readHeading("  Auf einen Blick  ")).toBe("Auf einen Blick");
  });

  it("liest einen übersetzten Titel aus seiner Hülle", () => {
    expect(readHeading(encodePayload("At a glance"))).toBe("At a glance");
  });

  it("liefert null, wenn nichts Sichtbares übrig bleibt", () => {
    expect(readHeading("")).toBeNull();
    expect(readHeading("   ")).toBeNull();
    expect(readHeading(undefined)).toBeNull();
    expect(readHeading(42)).toBeNull();
  });
});

describe("anchorNavTranslationProvider", () => {
  it("hängt am Titel-Attribut des eigenen Bausteins", () => {
    expect(provider.ref).toEqual({ tagName: "anchor-nav-widget", attribute: "heading" });
  });

  it("schickt den Titel als Text eines markierten Absatzes hinaus", () => {
    const html = provider.toTranslatable("Auf einen Blick");
    expect(html).toContain(HEADING_MARKER);
    expect(html).toContain("Auf einen Blick");
  });

  it("schickt nichts hinaus, wenn kein Titel eingetragen ist", () => {
    expect(provider.toTranslatable("")).toBeNull();
  });

  it("maskiert spitze Klammern im Titel", () => {
    expect(provider.toTranslatable("<b>fett</b>")).toContain("&lt;b&gt;");
  });

  it("nimmt nur Antworten an, die die Markierung tragen", () => {
    expect(provider.acceptsTranslated(`<p ${HEADING_MARKER}="1">x</p>`)).toBe(true);
    expect(provider.acceptsTranslated("<p>x</p>")).toBe(false);
  });

  it("liest den übersetzten Titel in der Hülle zurück", () => {
    const zurueck = provider.fromTranslated(`<p ${HEADING_MARKER}="1">At a glance</p>`, "Auf einen Blick");
    expect(decodePayload(zurueck as string)).toBe("At a glance");
  });

  it("lässt den Titel der Ausgangssprache stehen, wenn die Antwort leer ist", () => {
    expect(provider.fromTranslated(`<p ${HEADING_MARKER}="1"></p>`, "Auf einen Blick")).toBeNull();
  });
});
