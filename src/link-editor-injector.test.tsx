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

/**
 * Das Fenster „Links bearbeiten“ im gemeinsamen Rahmen von
 * `@man/config-ui`, eingehängt in einen echten RJSF-Dialog: Ausgangsstand aus
 * den alten Feldern, erstes Übernehmen nach `anchor-nav-config`, Prüfung,
 * Ausblenden nur im eigenen Dialog, Nachladen des Editors.
 */

import * as React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";

import { modalRoot, settleModal, settleEditor, clickElement } from "@shared/ui/config-modal.testing";
import { parseAnchorLinks } from "./anchor-links";
import { readStoredConfig, resolveAnchorNav, serializeAnchorNavConfig } from "./anchor-nav-config";
import { configurationSchema } from "./configuration-schema";
import { isStudioPage, linkEditorShell, startLinkEditorInjector } from "./link-editor-injector";

const EDITOR_SELECTOR = '[data-testid="link-editor"]';

const mockEditorLoaded = jest.fn();
jest.mock("./link-editor", () => {
  mockEditorLoaded();
  return jest.requireActual("./link-editor");
});

const LEGACY_LINKS = '[{"label":"Überblick","target":"#ueberblick"},{"label":"Termine"}]';

const fieldValue = (container: HTMLElement, key = "anchor-nav-config"): string =>
  container.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#anchor [id="root_${key}"]`)!.value;

const inModal = (selector: string): HTMLElement | null => modalRoot()?.querySelector<HTMLElement>(selector) ?? null;

/** Der eigene Dialog neben einem fremden mit gleichem Feldnamen (Infobox: `heading`). */
function Dialogs({ formData }: { formData: Record<string, string> }): React.ReactElement {
  return (
    <>
      <div id="anchor">
        <Form schema={configurationSchema} validator={validator} formData={formData} />
      </div>
      <form id="foreign">
        <div data-row="heading">
          <label htmlFor="root_heading">Überschrift</label>
          <input id="root_heading" defaultValue="Fremder Titel" />
        </div>
      </form>
    </>
  );
}

async function open(formData: Record<string, string>): Promise<{ container: HTMLElement; stop: () => void }> {
  const { container } = render(<Dialogs formData={formData} />);
  let stop = (): void => {};
  await act(async () => {
    stop = startLinkEditorInjector(container);
  });
  await settleEditor(EDITOR_SELECTOR);
  return { container, stop };
}

const apply = (): Promise<void> => clickElement(inModal('[data-testid="config-shell-apply"]'));

describe("Nachladen", () => {
  // Muss zuerst laufen: einmal geladen, bleibt das Modul im Speicher.
  it("lädt den Editor erst, wenn ein eigener Dialog erscheint", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const stop = startLinkEditorInjector(container);
    await settleModal();

    expect(mockEditorLoaded).not.toHaveBeenCalled();
    await act(async () => stop());
    container.remove();

    const opened = await open({});
    expect(mockEditorLoaded).toHaveBeenCalledTimes(1);
    expect(inModal('[data-testid="link-editor"]')).not.toBeNull();
    await act(async () => opened.stop());
  });
});

describe("startLinkEditorInjector", () => {
  it("öffnet das Fenster im gemeinsamen Rahmen mit Vorschau-Umschalter", async () => {
    const { stop } = await open({});

    expect(modalRoot()!.textContent).toContain("Ankernavigation");
    expect(modalRoot()!.querySelector("h1")).toHaveTextContent("Links bearbeiten");
    expect(inModal('[aria-label="Ansicht"]')).not.toBeNull();
    expect(inModal('[role="grid"][aria-label="Links"]')).not.toBeNull();

    await act(async () => stop());
  });

  it("blendet die alten Felder nur im eigenen Dialog aus", async () => {
    const { container, stop } = await open({ heading: "Auf einen Blick", links: LEGACY_LINKS });

    for (const key of ["heading", "links"]) {
      const field = container.querySelector(`#anchor [id="root_${key}"]`);
      expect(field).not.toBeNull();
      expect(field!.closest<HTMLElement>('[style*="display: none"]')).not.toBeNull();
    }
    expect(container.querySelector<HTMLElement>('#foreign [data-row="heading"]')?.style.display).toBe("");
    expect(container.querySelector<HTMLElement>("#foreign")?.style.display).toBe("");

    await act(async () => stop());
    expect(container.querySelector('#anchor [id="root_heading"]')!.closest('[style*="display: none"]')).toBeNull();
  });

  it("beginnt mit den alten Feldern und lässt ohne Änderung nichts übernehmen", async () => {
    const { container, stop } = await open({ heading: "Auf einen Blick", links: LEGACY_LINKS });

    expect(fieldValue(container)).toBe("");
    expect(inModal('[data-testid="link-heading"]')).toHaveValue("Auf einen Blick");
    expect(inModal('[role="grid"][aria-label="Links"]')).toHaveTextContent("Überblick");
    expect(inModal('[role="grid"][aria-label="Links"]')).toHaveTextContent("Termine");
    expect(inModal('[data-testid="config-shell-apply"]')).toBeDisabled();

    await act(async () => stop());
  });

  it("schreibt beim ersten Übernehmen Titel und Links nach anchor-nav-config, die Seite zeigt dasselbe", async () => {
    const { container, stop } = await open({ heading: "Auf einen Blick", links: LEGACY_LINKS });
    const before = resolveAnchorNav({ heading: "Auf einen Blick", links: LEGACY_LINKS });

    const heading = inModal('[data-testid="link-heading"]') as HTMLInputElement;
    await act(async () => {
      fireEvent.change(heading, { target: { value: "Auf dieser Seite" } });
    });
    expect(inModal('[role="status"]')).toHaveTextContent("Titel geändert");
    await act(async () => {
      fireEvent.change(heading, { target: { value: "Auf einen Blick" } });
    });
    // Zurück auf dem alten Stand ist nichts offen – und nichts zu übernehmen.
    expect(inModal('[data-testid="config-shell-apply"]')).toBeDisabled();

    await act(async () => {
      fireEvent.change(heading, { target: { value: "Auf dieser Seite" } });
    });
    await apply();

    const raw = fieldValue(container);
    expect(readStoredConfig(raw)?.heading).toBe("Auf dieser Seite");
    // Die alten Felder bleiben, wie sie sind; es gilt jetzt anchor-nav-config.
    expect(fieldValue(container, "heading")).toBe("Auf einen Blick");
    expect(fieldValue(container, "links")).toBe(LEGACY_LINKS);
    const after = resolveAnchorNav({ "anchor-nav-config": raw, heading: "Auf einen Blick", links: LEGACY_LINKS });
    expect(after.heading).toBe("Auf dieser Seite");
    expect(parseAnchorLinks(after.links).map(({ label, target }) => ({ label, target }))).toEqual(
      parseAnchorLinks(before.links).map(({ label, target }) => ({ label, target })),
    );

    await act(async () => stop());
  });

  it("nimmt eine vorhandene anchor-nav-config vor den alten Feldern", async () => {
    const config = serializeAnchorNavConfig({ heading: "Neu", links: [{ id: "a", label: "Kontakt" }] });
    const { stop } = await open({ "anchor-nav-config": config, heading: "Alt", links: LEGACY_LINKS });

    expect(inModal('[data-testid="link-heading"]')).toHaveValue("Neu");
    expect(inModal('[role="grid"][aria-label="Links"]')).toHaveTextContent("Kontakt");
    expect(inModal('[role="grid"][aria-label="Links"]')).not.toHaveTextContent("Überblick");

    await act(async () => stop());
  });

  it("übernimmt keinen Link ohne Linktext und nennt den Fehler", async () => {
    const { container, stop } = await open({});

    await clickElement(Array.from(modalRoot()!.querySelectorAll("button")).find((b) => b.textContent === "Neuer Link") ?? null);
    await apply();

    expect(fieldValue(container)).toBe("");
    // Ein einzelner Fehler steht mit seiner Meldung am Status.
    expect(inModal('[role="status"]')).toHaveTextContent("Link 1: Linktext fehlt");
    expect(inModal('[role="alert"]')).toHaveTextContent("Linktext fehlt");

    await act(async () => stop());
  });

  it("zeigt in der Vorschau die echte Navigation, ohne die Wirtsseite anzufassen", async () => {
    window.history.replaceState(null, "", "/studio#termine");
    const scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { stop } = await open({ heading: "Auf einen Blick", links: LEGACY_LINKS });

    await clickElement(Array.from(modalRoot()!.querySelectorAll("button, [role='radio']")).find((b) => b.textContent === "Desktop") ?? null);
    await settleModal();

    expect(inModal('[data-testid="link-preview"]')).toHaveAttribute("inert");
    expect(inModal('[data-testid="link-preview"] nav')).toHaveTextContent("Auf einen Blick");
    expect(scrollTo).not.toHaveBeenCalled();
    expect(window.location.hash).toBe("#termine");

    await act(async () => stop());
    scrollTo.mockRestore();
    window.history.replaceState(null, "", "/");
  });
});

describe("linkEditorShell", () => {
  it("nennt im Status, was sich geändert hat", () => {
    const statusText = linkEditorShell.statusText!;
    const saved = { heading: "T", links: [{ id: "a", label: "A" }] };
    expect(statusText(saved, saved)).toBeUndefined();
    expect(statusText({ ...saved, links: [{ id: "a", label: "B" }] }, saved)).toBe("1 Link geändert");
  });

  it("erklärt in der Hilfe Liste, Linktext, Ziel, Titel und Vorschau", () => {
    const { container } = render(<>{linkEditorShell.help}</>);
    for (const text of ["Neuer Link", "Element der Seite hinzufügen", "Linktext", "Ziel", "Titel", "Mobil"]) {
      expect(container).toHaveTextContent(text);
    }
  });
});

describe("isStudioPage", () => {
  it("erkennt das Studio am Pfad", () => {
    expect(isStudioPage({ pathname: "/studio/content/pages/1" } as Location)).toBe(true);
  });

  it("sieht in einer veröffentlichten Seite kein Studio", () => {
    expect(isStudioPage({ pathname: "/content/page/1" } as Location)).toBe(false);
    expect(isStudioPage({ pathname: "/studios/x" } as Location)).toBe(false);
  });
});
