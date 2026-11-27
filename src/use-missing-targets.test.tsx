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
import { act, render, screen } from "@testing-library/react";

import { AnchorLink } from "./anchor-links";
import { AnchorNav } from "./anchor-nav";
import { fakeEditor, heading, mountFakeEditor } from "./fake-editor.testing";
import { DOM_CHECK_SCHEDULE_MS, isCheckable, missingInEditor } from "./use-missing-targets";

const UUID = "4a7c0b1e-1111-4222-8333-944455556666";
const LINKS: AnchorLink[] = [
  { id: "block", label: "Termine", target: `#${UUID}` },
  { id: "text", label: "Anmeldung" },
  { id: "anker", label: "Anker", target: "#kontakt" },
  { id: "url", label: "Portal", target: "/portal" },
];

describe("isCheckable", () => {
  it("prüft Block-IDs und Überschriftentexte, nie Adressen oder eigene Anker", () => {
    expect(LINKS.map(isCheckable)).toEqual([true, true, false, false]);
  });
});

describe("useMissingTargets im Studio", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.history.pushState({}, "", "/studio/content/page/x/edit");
  });
  afterEach(() => {
    jest.useRealTimers();
    window.history.pushState({}, "", "/");
  });

  it("folgt dem Editor: eine gelöschte Überschrift verschwindet aus der Navigation", () => {
    const editor = fakeEditor([heading("bigHeading", `sbt-h2--${UUID}`, "Termine"), heading("mediumHeading", "m", "Anmeldung")]);
    expect([...missingInEditor(LINKS, editor)]).toEqual([]);
    const unmount = mountFakeEditor(editor);
    render(<AnchorNav links={LINKS} heading={null} self={null} />);
    expect(screen.getAllByRole("link")).toHaveLength(4);

    act(() => {
      editor.setDoc([heading("mediumHeading", "m", "Anmeldung")]);
      jest.runAllTimers();
    });
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["Anmeldung", "Anker", "Portal"]);
    unmount();
  });

  it("blendet ohne lesbaren Editor nichts aus und folgt ihm, sobald er da ist", () => {
    render(<AnchorNav links={LINKS} heading={null} self={null} />);
    act(() => {
      jest.advanceTimersByTime(20_000);
    });
    expect(screen.getAllByRole("link")).toHaveLength(4);

    const unmount = mountFakeEditor(fakeEditor([heading("mediumHeading", "m", "Anmeldung")]));
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["Anmeldung", "Anker", "Portal"]);
    unmount();
  });
});

describe("useMissingTargets auf der Seite", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = "";
  });

  it("sieht bei Fehlenden später nach und blendet spät gezeichnete Ziele wieder ein", () => {
    render(<AnchorNav links={[LINKS[1], LINKS[3]]} heading={null} self={null} />);
    act(() => {
      jest.advanceTimersByTime(DOM_CHECK_SCHEDULE_MS[0]);
    });
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["Portal"]);

    const late = document.createElement("h2");
    late.textContent = "Anmeldung";
    document.body.appendChild(late);
    act(() => {
      jest.advanceTimersByTime(DOM_CHECK_SCHEDULE_MS[1] - DOM_CHECK_SCHEDULE_MS[0]);
    });
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["Anmeldung", "Portal"]);
  });
});
