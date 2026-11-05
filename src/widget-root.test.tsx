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

import React from "react";
import { render, screen } from "@testing-library/react";

import { AnchorNavWidget } from "./widget-root";

/** Stellt `matchMedia` auf „nichts trifft zu": volle Darstellung, weiche Übergänge. */
function setMedia(): void {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
}

describe("AnchorNavWidget", () => {
  beforeEach(() => {
    setMedia();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    delete (window as { matchMedia?: unknown }).matchMedia;
  });

  it("zeigt die gepflegten Links aus dem Attribut", () => {
    render(
      <AnchorNavWidget
        heading="Auf einen Blick"
        links={JSON.stringify([{ label: "Eins" }, { target: "ohne Linktext" }, { label: "Zwei", target: "/seite" }])}
        self={null}
      />,
    );
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["Eins", "Zwei"]);
  });

  it("gibt ohne Links nichts aus", () => {
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    for (const links of [undefined, "[]", "kaputt"]) {
      const { container, unmount } = render(<AnchorNavWidget heading="Titel" links={links} self={null} />);
      expect(container).toBeEmptyDOMElement();
      unmount();
    }
    jest.restoreAllMocks();
  });
});
