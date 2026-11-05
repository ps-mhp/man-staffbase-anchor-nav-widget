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
import { fireEvent, render, screen } from "@testing-library/react";

import { AnchorLink } from "./anchor-links";
import { LinkEditor } from "./link-editor";
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

describe("LinkEditor", () => {
  it("zeigt ohne Links den Hinweis und legt einen leeren an", () => {
    const latest = setup([]);
    expect(screen.getByText(/Noch kein Link/)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("link-add"));

    expect(latest()).toHaveLength(1);
    expect(latest()[0].label).toBe("");
    expect(screen.getByText("Ohne Linktext wird dieser Eintrag nicht angezeigt.")).toBeInTheDocument();
  });

  it("übernimmt Linktext und Ziel und leert das Ziel wieder", () => {
    const latest = setup([{ id: "a", label: "" }]);

    fireEvent.change(screen.getByTestId("link-label-a"), { target: { value: "Ausstattung" } });
    fireEvent.change(screen.getByTestId("link-target-a"), { target: { value: "Ausstattung im Detail" } });
    expect(latest()).toEqual([{ id: "a", label: "Ausstattung", target: "Ausstattung im Detail" }]);

    fireEvent.change(screen.getByTestId("link-target-a"), { target: { value: "" } });
    expect(latest()[0].target).toBeUndefined();
  });

  it("entfernt einen Link", () => {
    const latest = setup([
      { id: "a", label: "A" },
      { id: "b", label: "B" },
    ]);
    fireEvent.click(screen.getByTestId("link-remove-a"));
    expect(latest().map((link) => link.id)).toEqual(["b"]);
  });

  it("ordnet mit den Pfeiltasten am Griff um und bleibt am Rand stehen", () => {
    const latest = setup([
      { id: "a", label: "A" },
      { id: "b", label: "B" },
    ]);

    fireEvent.keyDown(screen.getByTestId("link-handle-a"), { key: "ArrowDown" });
    expect(latest().map((link) => link.id)).toEqual(["b", "a"]);

    fireEvent.keyDown(screen.getByTestId("link-handle-a"), { key: "ArrowDown" });
    expect(latest().map((link) => link.id)).toEqual(["b", "a"]);
  });

  it("legt aus der Auswahl der Seite einen Link auf die Block-ID an", async () => {
    const latest = setup([], async () => [
      { blockId: "b1", label: "Neuigkeiten", kind: "heading", depth: 0 },
      { blockId: "b2", label: "Hero-Slider", kind: "widget", depth: 0 },
    ]);

    const select = await screen.findByTestId("link-outline");
    fireEvent.change(select, { target: { value: "b2" } });

    expect(latest()).toEqual([expect.objectContaining({ label: "Hero-Slider", target: "#b2" })]);
    expect(screen.getByRole("option", { name: "▣ Hero-Slider" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "Neuigkeiten" })).not.toBeDisabled();
  });

  it("meldet eine nicht ladbare Seite und lässt die Eingabe von Hand", async () => {
    setup([], async () => null);
    expect(await screen.findByTestId("link-outline-failed")).toBeInTheDocument();
    expect(screen.getByTestId("link-add")).toBeInTheDocument();
  });
});
