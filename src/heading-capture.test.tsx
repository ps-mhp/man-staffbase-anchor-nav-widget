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

import { act } from "@testing-library/react";

import { readHeadings } from "./heading-scan";
import { isStudioPage, startHeadingCapture } from "./heading-capture";

/** Wie RJSF das Feld rendert: `root_<schlüssel>`, in einem Dialog. */
function dialogWithField(): { dialog: HTMLElement; field: HTMLInputElement } {
  const dialog = document.createElement("div");
  dialog.setAttribute("role", "dialog");
  dialog.innerHTML = "<h2>Ankernavigation bearbeiten</h2><form><input id='root_headings' value=''></form>";
  document.body.append(dialog);
  return { dialog, field: dialog.querySelector("input") as HTMLInputElement };
}

describe("isStudioPage", () => {
  it("erkennt das Studio am Pfad", () => {
    expect(isStudioPage({ pathname: "/studio/content/page/1/edit" } as Location)).toBe(true);
    expect(isStudioPage({ pathname: "/content/page/1" } as Location)).toBe(false);
  });
});

describe("startHeadingCapture", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("schreibt die Überschriften der Seite in das Feld, ohne den Dialog selbst", async () => {
    document.body.innerHTML = `
      <div data-c13y-component="title-block"><h1>Titel</h1></div>
      <div data-sb-custom-block-widget-host><h2>Aus einem Widget</h2></div>`;
    const { field } = dialogWithField();
    const seen: string[] = [];
    field.addEventListener("input", () => seen.push(field.value));

    let stop: () => void = () => undefined;
    await act(async () => {
      stop = startHeadingCapture();
    });

    expect(readHeadings(field.value)).toEqual([
      { level: 1, text: "Titel", inBlock: true },
      { level: 2, text: "Aus einem Widget", inBlock: false },
    ]);
    // Über ein `input`-Ereignis, sonst erfährt das Formular von React nichts.
    expect(seen).toEqual([field.value]);
    expect(field.style.display).toBe("none");
    expect(document.body.textContent).toContain("2 Überschriften der Seite übernommen (H1: 1 · H2: 1)");

    act(() => stop());
  });
});
