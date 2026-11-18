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
import userEvent from "@testing-library/user-event";

import { EscapeLayerProvider } from "@man/config-ui/shell/escape-layers";

import { OutlinePicker, entryMeta } from "./outline-picker";
import { OutlineEntry } from "./page-outline";

const HEADING: OutlineEntry = { blockId: "h", label: "Anmeldung", kind: "heading", depth: 0, level: 3, parent: "Termine" };
const WIDGET: OutlineEntry = { blockId: "w", label: "Dateigalerie", kind: "widget", depth: 0 };

describe("entryMeta", () => {
  it("nennt Ebene, Oberüberschrift und ob schon verlinkt", () => {
    expect(entryMeta(HEADING, false)).toBe("H3 unter „Termine“");
    expect(entryMeta({ ...HEADING, parent: undefined, level: 2 }, true)).toBe("H2, schon verlinkt");
    expect(entryMeta(WIDGET, false)).toBeUndefined();
    expect(entryMeta(WIDGET, true)).toBe("schon verlinkt");
  });
});

describe("OutlinePicker", () => {
  it("hält Escape vom Fenster fern, solange die Liste offen ist, und leert dann das Feld", async () => {
    const layers: { current: () => void }[] = [];
    const registry = {
      push: (layer: { current: () => void }) => {
        layers.push(layer);
        return () => {
          layers.splice(layers.indexOf(layer), 1);
        };
      },
    };
    render(
      <EscapeLayerProvider value={registry}>
        <OutlinePicker
          outline={{ status: "ready", entries: [HEADING, WIDGET] }}
          isLinked={() => false}
          onPick={() => undefined}
        />
      </EscapeLayerProvider>,
    );
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Anm");
    // Offen: eine Escape-Ebene beim Rahmen, die das nächste Escape nimmt.
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(layers).toHaveLength(1);

    fireEvent.keyDown(input, { key: "Escape" });

    expect(input).toHaveValue("");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(layers).toHaveLength(0);
  });

  it("ist gesperrt, solange die Seite lädt, und sagt es im Feld", () => {
    render(<OutlinePicker outline={{ status: "loading" }} isLinked={() => false} onPick={() => undefined} />);
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByPlaceholderText("Seite wird geladen …")).toBeInTheDocument();
  });

  it("sagt, wenn die Seite nichts Verlinkbares hat", () => {
    render(<OutlinePicker outline={{ status: "ready", entries: [] }} isLinked={() => false} onPick={() => undefined} />);
    expect(screen.getByPlaceholderText("Keine Überschriften oder Widgets gefunden")).toBeDisabled();
  });
});
