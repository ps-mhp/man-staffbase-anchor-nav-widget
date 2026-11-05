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
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AnchorLink } from "./anchor-links";
import { LinkEditor, moveLinks } from "./link-editor";
import { OutlineEntry } from "./page-outline";

/** Rendert den Editor mit zurückgespiegeltem Wert und liefert die jüngste gemeldete Liste. */
function setup(value: AnchorLink[], loadOutline?: () => Promise<OutlineEntry[] | null>): () => AnchorLink[] {
  const onChange = jest.fn<void, [AnchorLink[]]>();
  function Harness(): React.ReactElement {
    const [links, setLinks] = React.useState(value);
    return (
      <LinkEditor
        value={links}
        onChange={(next) => {
          onChange(next);
          setLinks(next);
        }}
        onSave={() => {}}
        onClose={() => {}}
        dirty={false}
        loadOutline={loadOutline}
      />
    );
  }
  render(<Harness />);
  return () => onChange.mock.calls[onChange.mock.calls.length - 1][0];
}

describe("moveLinks", () => {
  const links: AnchorLink[] = ["a", "b", "c"].map((id) => ({ id, label: id.toUpperCase() }));
  const ids = (list: AnchorLink[]): string[] => list.map((link) => link.id);

  it("schiebt einen Eintrag vor oder hinter das Ziel", () => {
    expect(ids(moveLinks(links, new Set(["a"]), "c", "after"))).toEqual(["b", "c", "a"]);
    expect(ids(moveLinks(links, new Set(["c"]), "a", "before"))).toEqual(["c", "a", "b"]);
  });

  it("lässt die Liste bei unbekanntem Ziel unverändert", () => {
    expect(ids(moveLinks(links, new Set(["a"]), "x", "after"))).toEqual(["a", "b", "c"]);
  });
});

describe("LinkEditor", () => {
  it("zeigt ohne Links den Hinweis, legt einen leeren an und wählt ihn aus", () => {
    const latest = setup([]);
    expect(screen.getByText(/Noch kein Link/)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("link-add"));

    expect(latest()).toHaveLength(1);
    expect(latest()[0].label).toBe("");
    expect(screen.getByTestId(`link-label-${latest()[0].id}`)).toBeInTheDocument();
    expect(screen.getByText("Ohne Linktext wird dieser Eintrag nicht angezeigt.")).toBeInTheDocument();
  });

  it("übernimmt Linktext und Ziel des gewählten Links und leert das Ziel wieder", () => {
    const latest = setup([{ id: "a", label: "" }]);

    fireEvent.change(screen.getByTestId("link-label-a"), { target: { value: "Ausstattung" } });
    fireEvent.change(screen.getByTestId("link-target-a"), { target: { value: "Ausstattung im Detail" } });
    expect(latest()).toEqual([{ id: "a", label: "Ausstattung", target: "Ausstattung im Detail" }]);
    expect(within(screen.getByTestId("link-row-a")).getByText("Ausstattung")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("link-target-a"), { target: { value: "" } });
    expect(latest()[0].target).toBeUndefined();
  });

  it("wechselt mit einem Klick in der Liste den bearbeiteten Link", () => {
    setup([
      { id: "a", label: "A" },
      { id: "b", label: "B" },
    ]);
    expect(screen.getByTestId("link-label-a")).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByTestId("link-row-b"), { pointerType: "mouse", button: 0 });
    fireEvent.pointerUp(screen.getByTestId("link-row-b"), { pointerType: "mouse", button: 0 });
    fireEvent.click(screen.getByTestId("link-row-b"));

    expect(screen.getByTestId("link-label-b")).toHaveValue("B");
  });

  it("entfernt den gewählten Link und wählt den nächsten", () => {
    const latest = setup([
      { id: "a", label: "A" },
      { id: "b", label: "B" },
    ]);
    fireEvent.click(screen.getByTestId("link-remove-a"));
    expect(latest().map((link) => link.id)).toEqual(["b"]);
    expect(screen.getByTestId("link-label-b")).toBeInTheDocument();
  });

  it("legt aus der Auswahl der Seite einen Link auf die Block-ID an", async () => {
    const latest = setup([{ id: "x", label: "Neuigkeiten", target: "#b1" }], async () => [
      { blockId: "b1", label: "Neuigkeiten", kind: "heading", depth: 0 },
      { blockId: "b2", label: "Hero-Slider", kind: "widget", depth: 0 },
    ]);

    const user = userEvent.setup();
    const input = await screen.findByRole("combobox");
    await screen.findByPlaceholderText("Überschrift oder Widget suchen …");
    // React Aria benennt den Knopf über das Label der Auswahl.
    await user.click(within(screen.getByTestId("link-outline")).getAllByRole("button")[0]);

    const listbox = await screen.findByRole("listbox");
    // Die Liste bleibt im Editor und damit im Shadow Root des Dialogs.
    expect(screen.getByTestId("link-editor")).toContainElement(listbox);
    expect(within(listbox).getByRole("option", { name: /Neuigkeiten/ })).toHaveAttribute("aria-disabled", "true");
    await user.click(within(listbox).getByRole("option", { name: /Hero-Slider/ }));
    expect(input).toHaveValue("");

    expect(latest().map(({ label, target }) => ({ label, target }))).toEqual([
      { label: "Neuigkeiten", target: "#b1" },
      { label: "Hero-Slider", target: "#b2" },
    ]);
  });

  it("meldet eine nicht ladbare Seite und lässt die Eingabe von Hand", async () => {
    setup([], async () => null);
    expect(await screen.findByTestId("link-outline-failed")).toBeInTheDocument();
    expect(screen.getByTestId("link-add")).toBeInTheDocument();
  });
});
