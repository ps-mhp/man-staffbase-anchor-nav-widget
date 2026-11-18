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
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigShellProvider, type ConfigShellState } from "@man/config-ui/shell/shell-context";

import { AnchorLink } from "./anchor-links";
import { AnchorNavConfig } from "./anchor-nav-config";
import { LinkEditor } from "./link-editor";
import { OutlineEntry } from "./page-outline";

const OUTLINE: OutlineEntry[] = [
  { blockId: "b1", label: "Termine", kind: "heading", depth: 0, level: 2 },
  { blockId: "b2", label: "Anmeldung", kind: "heading", depth: 0, level: 3, parent: "Termine" },
  { blockId: "b3", label: "Dateigalerie", kind: "widget", depth: 0 },
];

const shellState = (overrides: Partial<ConfigShellState> = {}): ConfigShellState => ({
  view: "editor",
  setView: () => undefined,
  preview: true,
  issuesVisible: false,
  ...overrides,
});

interface Setup {
  latest: () => AnchorNavConfig;
  onChange: jest.Mock<void, [AnchorNavConfig]>;
}

interface Options {
  shell?: Partial<ConfigShellState>;
  loadOutline?: (() => Promise<OutlineEntry[] | null>) | null;
}

/** Rendert den Editor mit zurückgespiegeltem Wert; ohne Angabe ohne Auswahl der Seite. */
function setup(value: AnchorNavConfig, options: Options = {}): Setup {
  const onChange = jest.fn<void, [AnchorNavConfig]>();
  const loadOutline = options.loadOutline === undefined ? null : options.loadOutline;
  function Harness(): React.ReactElement {
    const [config, setConfig] = React.useState(value);
    return (
      <ConfigShellProvider value={shellState(options.shell)}>
        <LinkEditor
          value={config}
          onChange={(next) => {
            onChange(next);
            setConfig(next);
          }}
          loadOutline={loadOutline}
        />
      </ConfigShellProvider>
    );
  }
  render(<Harness />);
  return { onChange, latest: () => onChange.mock.calls[onChange.mock.calls.length - 1][0] };
}

const links = (...labels: string[]): AnchorLink[] => labels.map((label, index) => ({ id: `l${index}`, label }));

const row = (name: string | RegExp): HTMLElement => screen.getByRole("row", { name });

const loader = (entries: OutlineEntry[] | null) => () => Promise.resolve(entries);

describe("LinkEditor – Liste", () => {
  it("zeigt Anzahl, Linktext und Ziel jedes Links wie im Screen", async () => {
    setup(
      {
        links: [
          { id: "a", label: "Überblick", target: "#ueberblick" },
          { id: "b", label: "Termine", target: "#b1" },
          { id: "c", label: "Downloads", target: "#b3" },
          { id: "d", label: "FAQ" },
          { id: "e", label: "Kontakt", target: "https://man.eu" },
        ],
      },
      { loadOutline: loader(OUTLINE) },
    );
    expect(screen.getByRole("heading", { name: "Links" })).toBeInTheDocument();
    expect(screen.getByText("(5)")).toBeInTheDocument();
    expect(await screen.findByText("Überschrift „Termine“")).toBeInTheDocument();
    expect(within(row(/Downloads/)).getByText("Widget: Dateigalerie")).toBeInTheDocument();
    expect(within(row(/Überblick/)).getByText("#ueberblick")).toBeInTheDocument();
    expect(within(row(/FAQ/)).getByText("Leer – gleichnamige Überschrift")).toBeInTheDocument();
    expect(within(row(/Kontakt/)).getByText("https://man.eu")).toBeInTheDocument();
  });

  it("erklärt die leere Liste und legt über „Neuer Link“ einen an, gewählt und mit Fokus im Linktext", async () => {
    const { latest } = setup({});
    expect(screen.getByText(/Noch kein Link\. Lege über/)).toBeInTheDocument();
    expect(screen.getByTestId("link-empty")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Neuer Link" }));

    const [added] = latest().links ?? [];
    expect(added.label).toBe("");
    expect(screen.getByRole("heading", { name: "Link 1 von 1" })).toBeInTheDocument();
    expect(screen.getByTestId(`link-label-${added.id}`)).toHaveFocus();
    expect(row(/Ohne Linktext/)).toBeInTheDocument();
  });

  it("wechselt mit einem Klick in der Liste den bearbeiteten Link", async () => {
    setup({ links: links("A", "B") });
    expect(screen.getByTestId("link-label-l0")).toHaveValue("A");

    await userEvent.click(screen.getByText("B"));

    expect(screen.getByTestId("link-label-l1")).toHaveValue("B");
    expect(screen.getByRole("heading", { name: "Link 2 von 2" })).toBeInTheDocument();
    // Ein Wechsel ist kein neuer Link: der Fokus bleibt in der Liste.
    expect(screen.getByTestId("link-label-l1")).not.toHaveFocus();
  });

  describe("Sortieren per Tastatur", () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    const press = (key: string): void => {
      const target = document.activeElement ?? document.body;
      fireEvent.keyDown(target, { key });
      fireEvent.keyUp(target, { key });
      act(() => jest.runAllTimers());
    };

    it("schiebt den ersten Link hinter den zweiten, und die Auswahl geht mit", async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { latest } = setup({ links: links("A", "B", "C") });
      await user.tab();
      const [handle] = screen.getAllByRole("button", { name: /Ziehen zum Sortieren/ });
      act(() => handle.focus());
      press("Enter");
      press("ArrowDown");
      press("Enter");

      expect(latest().links?.map((link) => link.label)).toEqual(["B", "A", "C"]);
      expect(screen.getByRole("heading", { name: "Link 2 von 3" })).toBeInTheDocument();
    });
  });
});

describe("LinkEditor – Formular", () => {
  it("übernimmt Linktext und Ziel und leert das Ziel wieder", () => {
    const { latest } = setup({ heading: "T", links: [{ id: "a", label: "" }] });

    fireEvent.change(screen.getByTestId("link-label-a"), { target: { value: "Ausstattung" } });
    fireEvent.change(screen.getByTestId("link-target-a"), { target: { value: "Ausstattung im Detail" } });
    expect(latest()).toEqual({ heading: "T", links: [{ id: "a", label: "Ausstattung", target: "Ausstattung im Detail" }] });
    expect(within(row(/Ausstattung/)).getByText("Überschrift „Ausstattung im Detail“")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("link-target-a"), { target: { value: "" } });
    expect(latest().links?.[0].target).toBeUndefined();
  });

  it("kennzeichnet den Linktext als Pflicht und nennt im leeren Ziel die Überschrift, zu der es springt", () => {
    setup({ links: [{ id: "a", label: "Termine" }] });
    expect(screen.getByLabelText(/Linktext/)).toHaveAttribute("aria-required", "true");
    expect(screen.getByText("(Pflichtfeld)", { exact: false })).toBeInTheDocument();
    expect(screen.getByTestId("link-target-a")).toHaveAttribute("placeholder", "Leer = Überschrift „Termine“");
    expect(screen.getByText(/Leer springt zur gleichnamigen Überschrift/)).toBeInTheDocument();
    expect(screen.getByTestId("link-kind")).toHaveTextContent("Sprungziel auf dieser Seite");
  });

  it("nennt eine Adresse als solche", () => {
    setup({ links: [{ id: "a", label: "Portal", target: "/portal" }] });
    expect(screen.getByTestId("link-kind")).toHaveTextContent("Verweis auf eine Adresse");
  });

  it("zeigt den fehlenden Linktext erst, wenn „Übernehmen“ daran scheiterte", () => {
    setup({ links: [{ id: "a", label: "" }] }, { shell: { issuesVisible: true } });
    expect(screen.getByRole("alert")).toHaveTextContent("Linktext fehlt");
    expect(within(row(/Ohne Linktext/)).getByText(/Linktext fehlt/)).toBeInTheDocument();
  });

  it("verschiebt, dupliziert und löscht über die Aktionen im Kopf", async () => {
    const { latest } = setup({ links: links("A", "B") });

    expect(screen.getByRole("button", { name: "Link nach oben" })).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(screen.getByRole("button", { name: "Link nach unten" }));
    expect(latest().links?.map((link) => link.label)).toEqual(["B", "A"]);
    expect(screen.getByRole("heading", { name: "Link 2 von 2" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Link duplizieren" }));
    const copied = latest().links ?? [];
    expect(copied.map((link) => link.label)).toEqual(["B", "A", "A"]);
    expect(new Set(copied.map((link) => link.id)).size).toBe(3);
    expect(screen.getByRole("heading", { name: "Link 3 von 3" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Link löschen" }));
    expect(latest().links?.map((link) => link.label)).toEqual(["B", "A"]);
    expect(screen.getByRole("heading", { name: "Link 2 von 2" })).toBeInTheDocument();
  });
});

describe("LinkEditor – Navigation rechts", () => {
  it("pflegt den Titel und lässt die Links, wie sie sind", () => {
    const { latest } = setup({ links: links("A") });
    expect(screen.getByRole("complementary", { name: "Navigation" })).toBeInTheDocument();
    expect(screen.getByText(/Steht über den Links/)).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("link-heading"), { target: { value: "Auf dieser Seite" } });

    expect(latest()).toEqual({ heading: "Auf dieser Seite", links: links("A") });
  });
});

describe("LinkEditor – Element der Seite hinzufügen", () => {
  it("legt aus der Auswahl einen Link auf die Block-ID an und sperrt schon Verlinktes", async () => {
    const { latest } = setup(
      { links: [{ id: "x", label: "Termine", target: "#b1" }] },
      { loadOutline: loader(OUTLINE) },
    );
    const user = userEvent.setup();
    const input = await screen.findByRole("combobox", { name: "Überschrift oder Widget suchen" });
    await screen.findByPlaceholderText("Suchen …");

    await user.click(input);
    const listbox = await screen.findByRole("listbox");
    expect(within(listbox).getByText("Überschriften")).toBeInTheDocument();
    expect(within(listbox).getByText("Widgets")).toBeInTheDocument();
    expect(within(listbox).getByRole("option", { name: /Termine · H2, schon verlinkt/ })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(within(listbox).getByRole("option", { name: /Anmeldung · H3 unter „Termine“/ })).toBeInTheDocument();

    await user.click(within(listbox).getByRole("option", { name: /Dateigalerie/ }));

    expect(input).toHaveValue("");
    expect(latest().links?.map(({ label, target }) => ({ label, target }))).toEqual([
      { label: "Termine", target: "#b1" },
      { label: "Dateigalerie", target: "#b3" },
    ]);
    // Die Liste bleibt für den nächsten Treffer offen; der Rest liegt solange
    // für Hilfsmittel verborgen, deshalb über den Text.
    expect(screen.getByText("Link 2 von 2")).toBeInTheDocument();
  });

  it("filtert die Vorschläge nach dem eingegebenen Text", async () => {
    setup({}, { loadOutline: loader(OUTLINE) });
    const user = userEvent.setup();
    const input = await screen.findByRole("combobox");
    await screen.findByPlaceholderText("Suchen …");

    await user.type(input, "Anm");

    const listbox = await screen.findByRole("listbox");
    expect(within(listbox).getAllByRole("option").map((option) => option.textContent)).toEqual([
      "Anmeldung · H3 unter „Termine“",
    ]);
  });

  it("meldet eine nicht ladbare Seite und lässt „Neuer Link“", async () => {
    setup({}, { loadOutline: loader(null) });
    expect(await screen.findByTestId("link-outline-failed")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Neuer Link" })).toBeInTheDocument();
  });

  it("zeigt ohne Lader keine Auswahl", () => {
    setup({});
    expect(screen.queryByRole("combobox")).toBeNull();
  });
});

describe("LinkEditor – Vorschau", () => {
  it("zeigt in der Geräteansicht die echte Navigation statt des Formulars, Liste und Titel bleiben", () => {
    setup({ heading: "Auf dieser Seite", links: links("Überblick", "Termine") }, { shell: { view: "desktop" } });

    const preview = screen.getByTestId("link-preview");
    expect(within(preview).getByRole("navigation", { name: "Auf dieser Seite" })).toBeInTheDocument();
    expect(within(preview).getAllByRole("link").map((link) => link.textContent)).toEqual(["Überblick", "Termine"]);
    expect(screen.queryByTestId("link-label-l0")).toBeNull();
    expect(screen.getByRole("grid", { name: "Links" })).toBeInTheDocument();
    expect(screen.getByTestId("link-heading")).toBeInTheDocument();
  });

  it("klappt die Navigation in „Mobil“ zum Knopf zusammen", () => {
    setup({ heading: "Inhalt der Seite", links: links("A") }, { shell: { view: "mobile" } });
    const preview = screen.getByTestId("link-preview");
    expect(within(preview).getByRole("button", { name: "Inhalt der Seite" })).toBeInTheDocument();
    expect(within(preview).queryByRole("link")).toBeNull();
  });

  it("lässt Links ohne Linktext weg wie die Seite und erklärt eine leere Vorschau", () => {
    setup({ links: [{ id: "a", label: "" }] }, { shell: { view: "tablet" } });
    expect(screen.getByTestId("link-preview")).toHaveTextContent("Noch kein Link mit Linktext");
  });
});
