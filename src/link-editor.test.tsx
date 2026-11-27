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
import { OutlineSource } from "./outline-source";
import { OutlineEntry } from "./page-outline";

const OUTLINE: OutlineEntry[] = [
  { blockId: "b1", label: "Termine", kind: "heading", depth: 0, level: 2 },
  { blockId: "b2", label: "Anmeldung", kind: "heading", depth: 0, level: 3, parent: "Termine" },
  { blockId: "b3", label: "Dateigalerie", kind: "widget", depth: 0, widget: "Dateigalerie" },
  { blockId: "sbt-display-l--4a7c0b1e-1111-4222-8333-944455556666", label: "Kontakt", kind: "heading", depth: 0, level: 2 },
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
  outlineSource?: OutlineSource | null;
}

/** Rendert den Editor mit zurückgespiegeltem Wert; ohne Angabe ohne Auswahl der Seite. */
function setup(value: AnchorNavConfig, options: Options = {}): Setup {
  const onChange = jest.fn<void, [AnchorNavConfig]>();
  const outlineSource = options.outlineSource === undefined ? null : options.outlineSource;
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
          outlineSource={outlineSource}
        />
      </ConfigShellProvider>
    );
  }
  render(<Harness />);
  return { onChange, latest: () => onChange.mock.calls[onChange.mock.calls.length - 1][0] };
}

const links = (...labels: string[]): AnchorLink[] => labels.map((label, index) => ({ id: `l${index}`, label }));

const row = (name: string | RegExp): HTMLElement =>
  within(screen.getByRole("grid", { name: "Links" })).getByRole("row", { name });

const loader = (entries: OutlineEntry[] | null, kind: OutlineSource["kind"] = "saved"): OutlineSource => ({
  kind,
  load: () => Promise.resolve(entries),
});

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
      { outlineSource: loader(OUTLINE) },
    );
    expect(screen.getByRole("heading", { name: "Links" })).toBeInTheDocument();
    expect(screen.getByText("(5)")).toBeInTheDocument();
    expect(await screen.findByText("Überschrift „Termine“")).toBeInTheDocument();
    expect(within(row(/Downloads/)).getByText("Widget: Dateigalerie")).toBeInTheDocument();
    expect(within(row(/Überblick/)).getByText("#ueberblick")).toBeInTheDocument();
    expect(within(row(/FAQ/)).getByText("Leer – gleichnamige Überschrift")).toBeInTheDocument();
    expect(within(row(/Kontakt/)).getByText("https://man.eu")).toBeInTheDocument();
  });

  it("erklärt die leere Liste und legt über „Neuer Link“ → „Leerer Link“ einen an, gewählt und mit Fokus im Linktext", async () => {
    const { latest } = setup({});
    expect(screen.getByText(/Noch kein Link\. Über/)).toBeInTheDocument();
    expect(screen.getByTestId("link-empty")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Neuer Link" }));
    await userEvent.click(await screen.findByTestId("add-empty-link"));

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

describe("LinkEditor – „Neuer Link“ mit Auswahl der Seite", () => {
  const openMenu = async (user: ReturnType<typeof userEvent.setup>): Promise<HTMLElement> => {
    await user.click(screen.getByRole("button", { name: "Neuer Link" }));
    return screen.findByRole("menu", { name: "Elemente der Seite" });
  };

  it("legt aus dem Aufklappmenü einen Link auf die Block-ID ohne Stufe an und sperrt schon Verlinktes", async () => {
    const { latest } = setup({ links: [{ id: "x", label: "Termine", target: "#b1" }] }, { outlineSource: loader(OUTLINE) });
    const user = userEvent.setup();
    await screen.findAllByText("Aus der zuletzt gespeicherten Fassung der Seite.");
    const menu = await openMenu(user);

    expect(within(menu).getByText("Überschriften")).toBeInTheDocument();
    expect(within(menu).getByText("Widgets")).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: /Termine · H2, schon verlinkt/ })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(within(menu).getByRole("menuitem", { name: /Anmeldung · H3 unter „Termine“/ })).toBeInTheDocument();

    await user.click(within(menu).getByRole("menuitem", { name: /Kontakt/ }));

    expect(latest().links?.map(({ label, target }) => ({ label, target }))).toEqual([
      { label: "Termine", target: "#b1" },
      { label: "Kontakt", target: "#4a7c0b1e-1111-4222-8333-944455556666" },
    ]);
    expect(screen.queryByRole("menu", { name: "Elemente der Seite" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Link 2 von 2" })).toBeInTheDocument();
  });

  it("filtert die Elemente nach dem eingegebenen Text", async () => {
    setup({}, { outlineSource: loader(OUTLINE) });
    const user = userEvent.setup();
    await screen.findAllByText("Aus der zuletzt gespeicherten Fassung der Seite.");
    const menu = await openMenu(user);

    await user.type(screen.getByTestId("add-link-search"), "Anm");

    expect(within(menu).getAllByRole("menuitem").map((item) => item.textContent)).toEqual([
      "Anmeldung · H3 unter „Termine“",
    ]);
  });

  it("sagt, ob die Elemente live aus dem Editor kommen", async () => {
    setup({}, { outlineSource: loader(OUTLINE, "live") });
    expect((await screen.findAllByText("Aktueller Stand im Editor, auch Ungespeichertes.")).length).toBeGreaterThan(0);
  });

  it("meldet eine nicht ladbare Seite und lässt den leeren Link", async () => {
    setup({}, { outlineSource: loader(null) });
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Neuer Link" }));
    expect(await screen.findByTestId("add-link-source")).toHaveTextContent("ließ sich nicht laden");
    expect(screen.getByTestId("add-empty-link")).toBeInTheDocument();
  });

  it("zeigt ohne Quelle keinen Seitenaufbau", () => {
    setup({});
    expect(screen.queryByTestId("page-structure")).toBeNull();
  });
});

describe("LinkEditor – Ziel fehlt", () => {
  it("markiert Links ohne Ziel mit „!“, warnt im Formular und blendet sie in der Vorschau aus", async () => {
    const { latest } = setup(
      {
        links: [
          { id: "a", label: "Termine", target: "#b1" },
          { id: "b", label: "Weg", target: "#0f0f0f0f-1111-4222-8333-944455556666" },
          { id: "c", label: "Eigener Anker", target: "#kontakt" },
        ],
      },
      { outlineSource: loader(OUTLINE) },
    );
    await screen.findAllByText("Aus der zuletzt gespeicherten Fassung der Seite.");
    expect(within(row(/Weg/)).getByTestId("item-warning")).toHaveAttribute(
      "title",
      "Ziel fehlt auf der Seite – in der Navigation ausgeblendet",
    );
    expect(within(row(/Termine/)).queryByTestId("item-warning")).toBeNull();
    expect(within(row(/Eigener Anker/)).queryByTestId("item-warning")).toBeNull();

    await userEvent.click(screen.getByText("Weg"));
    expect(screen.getByTestId("link-missing")).toHaveTextContent("gibt es auf der Seite nicht mehr");
    await userEvent.click(screen.getByTestId("link-missing-remove"));
    expect(latest().links?.map((link) => link.id)).toEqual(["a", "c"]);
  });

  it("lässt den Link in der Vorschau weg", async () => {
    setup(
      { links: [{ id: "a", label: "Termine", target: "#b1" }, { id: "b", label: "Weg", target: "#0f0f0f0f-1111-4222-8333-944455556666" }] },
      { outlineSource: loader(OUTLINE), shell: { view: "desktop" } },
    );
    const preview = screen.getByTestId("link-preview");
    await screen.findAllByText("Aus der zuletzt gespeicherten Fassung der Seite.");
    expect(within(preview).getAllByRole("link").map((link) => link.textContent)).toEqual(["Termine"]);
  });
});

describe("LinkEditor – Seitenaufbau", () => {
  it("zeigt die Elemente eingerückt und legt per Klick einen Link an; Verlinktes wählt den vorhandenen", async () => {
    const { latest } = setup({ links: [{ id: "x", label: "Termine", target: "#b1" }] }, { outlineSource: loader(OUTLINE) });
    const structure = await screen.findByTestId("page-structure");
    const tree = within(structure).getByRole("grid", { name: "Seitenaufbau" });
    await screen.findAllByText("Aus der zuletzt gespeicherten Fassung der Seite.");
    expect(within(tree).getAllByRole("row").map((item) => item.textContent)).toEqual([
      "Termineschon verlinkt",
      "Anmeldung",
      "Dateigalerie",
      "Kontakt",
    ]);

    await userEvent.click(within(tree).getByRole("row", { name: "Anmeldung" }));
    expect(latest().links?.map((link) => link.label)).toEqual(["Termine", "Anmeldung"]);

    await userEvent.click(within(tree).getByRole("row", { name: "Termine" }));
    expect(latest().links).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Link 1 von 2" })).toBeInTheDocument();
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
