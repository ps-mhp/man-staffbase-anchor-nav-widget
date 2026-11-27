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
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AddLinkMenu, entryMeta, sourceText } from "./add-link-menu";
import { OutlineEntry } from "./page-outline";

const HEADING: OutlineEntry = { blockId: "h", label: "Anmeldung", kind: "heading", depth: 0, level: 3, parent: "Termine" };
const WIDGET: OutlineEntry = { blockId: "w", label: "Dateigalerie", kind: "widget", depth: 0, widget: "Dateigalerie" };
const USP: OutlineEntry = { blockId: "u", label: "Hauptwettbewerber", kind: "widget", depth: 0, widget: "USP-Box", parent: "Termine" };

describe("entryMeta", () => {
  it("nennt Ebene, Oberüberschrift und ob schon verlinkt", () => {
    expect(entryMeta(HEADING, false)).toBe("H3 unter „Termine“");
    expect(entryMeta({ ...HEADING, parent: undefined, level: 2 }, true)).toBe("H2, schon verlinkt");
    expect(entryMeta(WIDGET, false)).toBeUndefined();
    expect(entryMeta(WIDGET, true)).toBe("schon verlinkt");
  });

  it("nennt bei Widgets mit Merkmal die Art und wo sie stehen", () => {
    expect(entryMeta(USP, false)).toBe("USP-Box, unter „Termine“");
  });
});

describe("sourceText", () => {
  it("sagt, woher die Elemente kommen", () => {
    expect(sourceText({ status: "ready", entries: [], live: true })).toMatch(/Aktueller Stand im Editor/);
    expect(sourceText({ status: "ready", entries: [], live: false })).toMatch(/zuletzt gespeicherten/);
    expect(sourceText({ status: "loading" })).toBe("Seite wird geladen …");
    expect(sourceText(null)).toMatch(/nicht verfügbar/);
  });
});

describe("AddLinkMenu", () => {
  it("bietet den leeren Link und wählt ein Element", async () => {
    const onAddEmpty = jest.fn();
    const onPick = jest.fn();
    render(
      <AddLinkMenu
        outline={{ status: "ready", entries: [HEADING, USP], live: true }}
        isLinked={() => false}
        onAddEmpty={onAddEmpty}
        onPick={onPick}
      />,
    );
    await userEvent.click(screen.getByTestId("add-empty-link"));
    expect(onAddEmpty).toHaveBeenCalled();

    const menu = screen.getByRole("menu", { name: "Elemente der Seite" });
    await userEvent.click(within(menu).getByRole("menuitem", { name: /Hauptwettbewerber · USP-Box/ }));
    expect(onPick).toHaveBeenCalledWith(USP);
  });

  it("findet Widgets auch über ihre Art", async () => {
    render(
      <AddLinkMenu
        outline={{ status: "ready", entries: [HEADING, USP], live: false }}
        isLinked={() => false}
        onAddEmpty={() => undefined}
        onPick={() => undefined}
      />,
    );
    await userEvent.type(screen.getByTestId("add-link-search"), "usp");
    const menu = screen.getByRole("menu", { name: "Elemente der Seite" });
    expect(within(menu).getAllByRole("menuitem").map((item) => item.textContent)).toEqual([
      "Hauptwettbewerber · USP-Box, unter „Termine“",
    ]);
  });

  it("sagt während des Ladens, dass die Seite lädt", () => {
    render(<AddLinkMenu outline={{ status: "loading" }} isLinked={() => false} onAddEmpty={() => undefined} onPick={() => undefined} />);
    expect(screen.getAllByText("Seite wird geladen …").length).toBeGreaterThan(0);
  });
});
