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

import { act, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";

import { readStoredConfig } from "./anchor-nav-config";
import { FakeEditor, FakeSpec, anchorNav, fakeEditor, heading, mountFakeEditor } from "./fake-editor.testing";
import { customBlocksOf } from "./live-editor";
import { useLinkEditorPresence } from "./link-editor-presence";
import { ChangeDecision, applyDecision, diffOutline, linkHits, snapshotOf, withWidgetConfig } from "./outline-changes";
import { ChangeDialog } from "./outline-watch-prompt";
import { AskChange, ChangePrompt, EDITOR_OPEN_RETRY_MS, WATCH_DELAY_MS, startOutlineWatch, watchEditor } from "./outline-watch";
import { OutlineEntry } from "./page-outline";

const UUID = "4a7c0b1e-1111-4222-8333-944455556666";
const TERMINE: OutlineEntry = { blockId: UUID, label: "Termine", kind: "heading", depth: 0, level: 2 };

const doc = (headingText: string | null, links: unknown[], extra: FakeSpec[] = []): FakeSpec[] => [
  anchorNav("nav", { heading: "Inhalt", links }),
  ...(headingText === null ? [] : [{ type: "textContainer", id: "tc", children: [heading("bigHeading", `sbt-h2--${UUID}`, headingText)] }]),
  ...extra,
];

const linksIn = (editor: FakeEditor): unknown => {
  const [nav] = customBlocksOf(editor, "anchor-nav-widget");
  const properties = nav.block.properties as Record<string, unknown>;
  return readStoredConfig(properties["anchor-nav-config"])?.links;
};

describe("outline-changes", () => {
  it("findet gelöschte Elemente und umbenannte Überschriften, gleich mit welcher Stufe", () => {
    const before = snapshotOf([TERMINE, { blockId: "w", label: "Galerie", kind: "widget", depth: 0 }]);
    const after = snapshotOf([{ ...TERMINE, blockId: `sbt-h3--${UUID}`, label: "Termine 2027" }]);
    expect(diffOutline(before, after)).toEqual([
      { kind: "renamed", before: TERMINE, after: { ...TERMINE, blockId: `sbt-h3--${UUID}`, label: "Termine 2027" } },
      { kind: "removed", before: { blockId: "w", label: "Galerie", kind: "widget", depth: 0 } },
    ]);
    expect(diffOutline(before, before)).toEqual([]);
  });

  it("trifft Links über die Block-ID und über den Text, wenn keine gleichnamige Überschrift bleibt", () => {
    const change = { kind: "removed", before: TERMINE } as const;
    const empty = snapshotOf([]);
    expect(linkHits({ id: "a", label: "x", target: `#${UUID}` }, change, empty)).toBe(true);
    expect(linkHits({ id: "b", label: "Termine" }, change, empty)).toBe(true);
    expect(linkHits({ id: "c", label: "x", target: "Termine" }, change, empty)).toBe(true);
    expect(linkHits({ id: "d", label: "Termine" }, change, snapshotOf([{ ...TERMINE, blockId: "other" }]))).toBe(false);
    expect(linkHits({ id: "e", label: "Portal", target: "https://man.eu" }, change, empty)).toBe(false);
  });

  it("entfernt oder aktualisiert genau die getroffenen Links", () => {
    const links = [
      { id: "a", label: "Termine", target: "Termine" },
      { id: "b", label: "Kontakt" },
    ];
    const hit = (link: { id: string }): boolean => link.id === "a";
    const renamed = { kind: "renamed", before: TERMINE, after: { ...TERMINE, label: "Neu" } } as const;
    expect(applyDecision(links, hit, renamed, { action: "remove" })).toEqual([links[1]]);
    expect(applyDecision(links, hit, renamed, { action: "update", label: " Neuer Text " })).toEqual([
      { id: "a", label: "Neuer Text", target: `#${UUID}` },
      links[1],
    ]);
    expect(applyDecision(links, hit, renamed, { action: "update", label: "" })[0].label).toBe("Neu");
    expect(applyDecision(links, hit, renamed, { action: "keep" })).toEqual(links);
  });

  it("schreibt die Konfiguration in die Blockeinstellungen und lässt den Rest stehen", () => {
    const settings = { content: { selectedBlock: { customElementName: "anchor-nav-widget", version: "1", properties: { other: 1 } } } };
    const next = withWidgetConfig(settings, { heading: "H", links: [] }) as typeof settings & {
      content: { selectedBlock: { properties: Record<string, unknown> } };
    };
    expect(next.content.selectedBlock.version).toBe("1");
    expect(next.content.selectedBlock.properties.other).toBe(1);
    expect(readStoredConfig(next.content.selectedBlock.properties["anchor-nav-config"])).toEqual({ heading: "H", links: [] });
  });
});

describe("watchEditor", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const setup = (decision: ChangeDecision, links: unknown[] = [{ id: "a", label: "Termine", target: `#${UUID}` }]) => {
    const editor = fakeEditor(doc("Termine", links));
    const prompts: ChangePrompt[] = [];
    const ask: AskChange = (prompt) => {
      prompts.push(prompt);
      return Promise.resolve(decision);
    };
    const stop = watchEditor(editor, ask);
    return { editor, prompts, stop };
  };

  const settle = async (): Promise<void> => {
    await act(async () => {
      jest.advanceTimersByTime(WATCH_DELAY_MS);
      // Frage und Antwort laufen über ein paar Versprechen.
      for (let step = 0; step < 5; step += 1) await Promise.resolve();
    });
  };

  it("fragt beim Löschen einer verlinkten Überschrift und entfernt den Link", async () => {
    const { editor, prompts, stop } = setup({ action: "remove" });
    editor.setDoc(doc(null, [{ id: "a", label: "Termine", target: `#${UUID}` }]));
    await settle();
    expect(prompts).toHaveLength(1);
    expect(prompts[0]).toMatchObject({ change: { kind: "removed" }, navigations: 1, links: [{ id: "a" }] });
    expect(linksIn(editor)).toEqual([]);
    stop();
  });

  it("behält den Link auf Wunsch", async () => {
    const { editor, prompts, stop } = setup({ action: "keep" });
    editor.setDoc(doc(null, [{ id: "a", label: "Termine", target: `#${UUID}` }]));
    await settle();
    expect(prompts).toHaveLength(1);
    expect(linksIn(editor)).toEqual([{ id: "a", label: "Termine", target: `#${UUID}` }]);
    stop();
  });

  it("fragt nach dem Umbenennen erst, wenn die Schreibmarke die Überschrift verlassen hat", async () => {
    const { editor, prompts, stop } = setup({ action: "update", label: "Termine 2027" });
    editor.setDoc(doc("Termine 2027", [{ id: "a", label: "Termine", target: `#${UUID}` }], [heading("title", "t", "Ende")]));
    // Die Schreibmarke steht in der Überschrift (nav 0..2, tc ab 2, Überschrift ab 3).
    editor.select(5);
    await settle();
    expect(prompts).toHaveLength(0);

    editor.select(25);
    await settle();
    expect(prompts).toHaveLength(1);
    expect(prompts[0].change).toMatchObject({ kind: "renamed", before: { label: "Termine" }, after: { label: "Termine 2027" } });
    expect(linksIn(editor)).toEqual([{ id: "a", label: "Termine 2027", target: `#${UUID}` }]);
    stop();
  });

  it("fragt nicht bei Änderungen ohne verlinktes Ziel und nicht, solange das Fenster offen ist", async () => {
    const { editor, prompts, stop } = setup({ action: "remove" }, [{ id: "b", label: "Anderes", target: "https://man.eu" }]);
    editor.setDoc(doc(null, [{ id: "b", label: "Anderes", target: "https://man.eu" }]));
    await settle();
    expect(prompts).toHaveLength(0);
    stop();

    const second = setup({ action: "remove" });
    function Open(): null {
      useLinkEditorPresence();
      return null;
    }
    const view = render(<Open />);
    second.editor.setDoc(doc(null, [{ id: "a", label: "Termine", target: `#${UUID}` }]));
    await settle();
    expect(second.prompts).toHaveLength(0);
    // Nach dem Schließen fragt er nach, was sich derweil geändert hat.
    view.unmount();
    await act(async () => {
      jest.advanceTimersByTime(EDITOR_OPEN_RETRY_MS);
      for (let step = 0; step < 5; step += 1) await Promise.resolve();
    });
    expect(second.prompts).toHaveLength(1);
    second.stop();
  });

  it("fragt beim Verlassen des Editors auch, wenn die Schreibmarke noch in der Überschrift steht", async () => {
    const { editor, prompts, stop } = setup({ action: "keep" });
    editor.setDoc(doc("Termine 2027", [{ id: "a", label: "Termine", target: `#${UUID}` }]));
    editor.select(5);
    await settle();
    expect(prompts).toHaveLength(0);
    editor.blur();
    await settle();
    expect(prompts).toHaveLength(1);
    stop();
  });

  it("folgt einem neuen Editor und hört beim Beenden auf", async () => {
    const editor = fakeEditor(doc("Termine", [{ id: "a", label: "Termine", target: `#${UUID}` }]));
    const ask = jest.fn<Promise<ChangeDecision>, [ChangePrompt]>().mockResolvedValue({ action: "keep" });
    const stop = startOutlineWatch(ask, 100);
    const unmount = mountFakeEditor(editor);
    jest.advanceTimersByTime(100);
    editor.setDoc(doc(null, [{ id: "a", label: "Termine", target: `#${UUID}` }]));
    await settle();
    expect(ask).toHaveBeenCalledTimes(1);
    stop();
    unmount();
  });
});

describe("ChangeDialog", () => {
  const prompt = (kind: "removed" | "renamed"): ChangePrompt => ({
    change: kind === "removed" ? { kind, before: TERMINE } : { kind, before: TERMINE, after: { ...TERMINE, label: "Termine 2027" } },
    links: [{ id: "a", label: "Termine" }],
    navigations: 1,
  });

  it("bietet beim Löschen „Link entfernen“ und „Link behalten“", () => {
    const onDecide = jest.fn();
    render(<ChangeDialog prompt={prompt("removed")} onDecide={onDecide} />);
    expect(screen.getByText(/die Überschrift „Termine“ gelöscht/)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("outline-change-apply"));
    expect(onDecide).toHaveBeenCalledWith({ action: "remove" });
  });

  it("schlägt beim Umbenennen den neuen Text vor und nimmt einen eigenen", () => {
    const onDecide = jest.fn();
    render(<ChangeDialog prompt={prompt("renamed")} onDecide={onDecide} />);
    const input = screen.getByTestId("outline-change-label");
    expect(input).toHaveValue("Termine 2027");
    fireEvent.change(input, { target: { value: "Termine" } });
    fireEvent.click(screen.getByTestId("outline-change-apply"));
    expect(onDecide).toHaveBeenCalledWith({ action: "update", label: "Termine" });
  });

  it("ändert nichts bei „Nicht ändern“", () => {
    const onDecide = jest.fn();
    render(<ChangeDialog prompt={prompt("renamed")} onDecide={onDecide} />);
    fireEvent.click(screen.getByTestId("outline-change-keep"));
    expect(onDecide).toHaveBeenCalledWith({ action: "keep" });
  });
});
