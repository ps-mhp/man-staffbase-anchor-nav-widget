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

import {
  parseAnchorNavDraft,
  readStoredConfig,
  resolveAnchorNav,
  serializeAnchorNavConfig,
} from "./anchor-nav-config";
import { parseAnchorLinks } from "./anchor-links";

const LEGACY_LINKS = '[{"label":"Übersicht"},{"label":"Kontakt","target":"#k1"}]';

describe("readStoredConfig", () => {
  it("liest die kodierte und die rohe Form", () => {
    const json = '{"heading":"Auf einen Blick","links":[{"id":"a","label":"A"}]}';
    expect(readStoredConfig(encodePayload(json))).toEqual({ heading: "Auf einen Blick", links: [{ id: "a", label: "A" }] });
    expect(readStoredConfig(json)).toEqual({ heading: "Auf einen Blick", links: [{ id: "a", label: "A" }] });
  });

  it("liefert null für Leeres, Kaputtes und Nicht-Objekte", () => {
    expect(readStoredConfig("")).toBeNull();
    expect(readStoredConfig("   ")).toBeNull();
    expect(readStoredConfig(undefined)).toBeNull();
    expect(readStoredConfig("{kaputt")).toBeNull();
    expect(readStoredConfig("b64:%%%")).toBeNull();
    expect(readStoredConfig("[1,2]")).toBeNull();
  });

  it("lässt Schlüssel weg, die fehlen oder die falsche Form haben", () => {
    expect(readStoredConfig('{"heading":3,"links":"x"}')).toEqual({});
    expect(readStoredConfig('{"links":[]}')).toEqual({ links: [] });
  });
});

describe("resolveAnchorNav – die Leseseite", () => {
  it("rendert alte Blöcke ohne neues Attribut genau wie bisher", () => {
    const resolved = resolveAnchorNav({ heading: "Auf einen Blick", links: LEGACY_LINKS });
    expect(resolved.heading).toBe("Auf einen Blick");
    expect(parseAnchorLinks(resolved.links)).toEqual(parseAnchorLinks(LEGACY_LINKS));
  });

  it("liest den übersetzten alten Titel aus seiner Hülle", () => {
    expect(resolveAnchorNav({ heading: encodePayload("At a glance") }).heading).toBe("At a glance");
  });

  it("nimmt je Schlüssel den neuen Wert vor dem alten Attribut", () => {
    const config = serializeAnchorNavConfig({ heading: "Neu" });
    const resolved = resolveAnchorNav({ "anchor-nav-config": config, heading: "Alt", links: LEGACY_LINKS });
    expect(resolved.heading).toBe("Neu");
    // `links` fehlt im neuen Attribut: es gilt weiter das alte.
    expect(parseAnchorLinks(resolved.links).map((link) => link.label)).toEqual(["Übersicht", "Kontakt"]);
  });

  it("nimmt Links aus dem neuen Attribut, auch eine leere Liste", () => {
    const config = serializeAnchorNavConfig({ links: [] });
    expect(parseAnchorLinks(resolveAnchorNav({ "anchor-nav-config": config, links: LEGACY_LINKS }).links)).toEqual([]);
  });

  it("zeigt bei leerem neuem Titel keinen, auch wenn der alte einen hatte", () => {
    const config = serializeAnchorNavConfig({ heading: "  " });
    expect(resolveAnchorNav({ "anchor-nav-config": config, heading: "Alt" }).heading).toBeNull();
  });

  it("fällt bei kaputtem neuem Attribut ganz auf die alten zurück", () => {
    const resolved = resolveAnchorNav({ "anchor-nav-config": "{kaputt", heading: "Alt", links: LEGACY_LINKS });
    expect(resolved.heading).toBe("Alt");
    expect(parseAnchorLinks(resolved.links)).toHaveLength(2);
  });

  it("gibt die Links als stabile Zeichenkette weiter, damit die Ansicht nicht bei jedem Rendern neu rechnet", () => {
    const config = serializeAnchorNavConfig({ links: [{ id: "a", label: "A" }] });
    const first = resolveAnchorNav({ "anchor-nav-config": config }).links;
    const second = resolveAnchorNav({ "anchor-nav-config": config }).links;
    expect(typeof first).toBe("string");
    expect(first).toBe(second);
  });
});

describe("serializeAnchorNavConfig", () => {
  it("kodiert wie die übrigen JSON-Attribute und lässt Unbekanntes weg", () => {
    const raw = serializeAnchorNavConfig({ heading: "Titel" });
    expect(raw.startsWith("b64:")).toBe(true);
    expect(JSON.parse(decodePayload(raw) ?? "")).toEqual({ heading: "Titel" });
  });

  it("schreibt die Links in der Form des alten Attributs, leere Ziele fallen weg", () => {
    const raw = serializeAnchorNavConfig({
      links: [
        { id: "a", label: "A", target: "  " },
        { id: "b", label: "", target: "#x" },
      ],
    });
    expect(JSON.parse(decodePayload(raw) ?? "")).toEqual({
      links: [
        { id: "a", label: "A" },
        { id: "b", label: "", target: "#x" },
      ],
    });
  });

  it("ergibt für denselben Inhalt dieselbe Zeichenkette", () => {
    const config = { heading: "T", links: [{ id: "a", label: "A", target: "#x" }] };
    expect(serializeAnchorNavConfig(config)).toBe(serializeAnchorNavConfig({ links: config.links, heading: "T" }));
  });
});

describe("parseAnchorNavDraft – Ausgangsstand des Fensters", () => {
  it("beginnt ohne neues Attribut mit den lesbaren alten Feldern", () => {
    const draft = parseAnchorNavDraft("", { heading: "Auf einen Blick", links: LEGACY_LINKS });
    expect(draft.heading).toBe("Auf einen Blick");
    expect(draft.links?.map((link) => link.label)).toEqual(["Übersicht", "Kontakt"]);
  });

  it("dekodiert einen übersetzten alten Titel", () => {
    expect(parseAnchorNavDraft("", { heading: encodePayload("At a glance") }).heading).toBe("At a glance");
  });

  it("lässt nicht lesbare alte Felder weg, damit das alte Attribut weiter gilt", () => {
    expect(parseAnchorNavDraft("", {})).toEqual({});
    // Ohne Änderung schreibt das Fenster also nichts, was ein altes Attribut überdeckte.
    expect(JSON.parse(decodePayload(serializeAnchorNavConfig(parseAnchorNavDraft("", {}))) ?? "")).toEqual({});
  });

  it("behält Einträge ohne Linktext, damit ein frisch angelegter nicht verschwindet", () => {
    const draft = parseAnchorNavDraft("", { links: '[{"id":"n","label":""}]' });
    expect(draft.links).toEqual([{ id: "n", label: "" }]);
  });

  it("nimmt das neue Attribut vor den alten Feldern, je Schlüssel", () => {
    const config = serializeAnchorNavConfig({ heading: "Neu" });
    const draft = parseAnchorNavDraft(config, { heading: "Alt", links: LEGACY_LINKS });
    expect(draft.heading).toBe("Neu");
    expect(draft.links?.map((link) => link.label)).toEqual(["Übersicht", "Kontakt"]);
  });

  it("verliert über Lesen und Schreiben nichts", () => {
    const config = { heading: "T", links: [{ id: "a", label: "A", target: "#x" }, { id: "b", label: "" }] };
    expect(parseAnchorNavDraft(serializeAnchorNavConfig(config), {})).toEqual(config);
  });
});
