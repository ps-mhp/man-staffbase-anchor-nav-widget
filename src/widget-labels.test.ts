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

import { encodePayload } from "@shared/payload";

import { baseBlockId, isBlockUuid, sameBlock } from "./block-id";
import { UNKNOWN_WIDGET, describeWidget, humanizeElementName } from "./widget-labels";

describe("describeWidget", () => {
  it("nimmt den gespeicherten Namen", () => {
    expect(describeWidget({ name: "Hero-Slider", customElementName: "hero-slider-widget" })).toEqual({ name: "Hero-Slider" });
  });

  it("kennt unsere Widgets ohne gespeicherten Namen", () => {
    expect(describeWidget({ customElementName: "usp-widget" })).toEqual({ name: "USP-Box" });
    expect(describeWidget({ customElementName: "table-widget", properties: {} })).toEqual({ name: "Tabelle" });
  });

  it("macht fremde Elementnamen lesbar und fällt sonst auf „Widget“ zurück", () => {
    expect(describeWidget({ customElementName: "object-spin-viewer" })).toEqual({ name: "Object Spin Viewer" });
    expect(describeWidget({})).toEqual({ name: UNKNOWN_WIDGET });
    expect(describeWidget(undefined)).toEqual({ name: UNKNOWN_WIDGET });
    expect(humanizeElementName("-widget")).toBe(UNKNOWN_WIDGET);
  });

  it("liest das Merkmal aus verpackter Konfiguration, Listen und schlichten Attributen", () => {
    const usp = encodePayload(JSON.stringify({ layout: "tiles", heading: "Hauptwettbewerber", items: [] }));
    expect(describeWidget({ customElementName: "usp-widget", properties: { "usp-config": usp } })).toEqual({
      name: "USP-Box",
      detail: "Hauptwettbewerber",
    });
    const slides = encodePayload(JSON.stringify([{ headline: "Widget Gallery" }, { type: "settings" }]));
    expect(describeWidget({ customElementName: "hero-slider-widget", properties: { slides } }).detail).toBe("Widget Gallery");
    expect(describeWidget({ customElementName: "x-widget", properties: { title: "  Kennzahlen  " } }).detail).toBe("Kennzahlen");
  });

  it("übersteht kaputte Konfiguration und lässt leere Merkmale weg", () => {
    expect(describeWidget({ customElementName: "usp-widget", properties: { a: "b64:@@@", b: "{kaputt", c: 3 } })).toEqual({
      name: "USP-Box",
    });
    expect(describeWidget({ customElementName: "usp-widget", properties: { c: JSON.stringify({ heading: " " }) } })).toEqual({
      name: "USP-Box",
    });
  });
});

describe("block-id", () => {
  const uuid = "7bca7d25-2d32-494d-a185-d25d0e5de097";

  it("vergleicht ohne Stufe der Typoskala", () => {
    expect(baseBlockId(`sbt-display-2xl--${uuid}`)).toBe(uuid);
    expect(baseBlockId(uuid)).toBe(uuid);
    expect(sameBlock(`sbt-body-l--${uuid}`, uuid)).toBe(true);
    expect(sameBlock("a", "b")).toBe(false);
  });

  it("erkennt Block-IDs des Content Designers, nicht eigene Anker", () => {
    expect(isBlockUuid(uuid)).toBe(true);
    expect(isBlockUuid(`sbt-h2--${uuid}`)).toBe(true);
    expect(isBlockUuid("kontakt")).toBe(false);
  });
});
