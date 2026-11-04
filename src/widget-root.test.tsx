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

  it("zeigt die Überschriften der gewählten Ebene", () => {
    document.body.innerHTML = "<h3>Drei</h3><h2>Zwei</h2>";
    render(<AnchorNavWidget level="h3" heading="Auf einen Blick" self={null} />);
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["Drei"]);
  });

  it("gibt nichts aus, wenn die Seite die Ebene nicht verwendet", () => {
    document.body.innerHTML = "<h2>Zwei</h2>";
    const { container } = render(<AnchorNavWidget level="h4" heading="Auf einen Blick" self={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("listet sich nicht selbst auf", () => {
    document.body.innerHTML = "<h2>Echt</h2>";
    const self = document.createElement("div");
    self.innerHTML = "<h2>Auf einen Blick</h2>";
    document.body.appendChild(self);

    render(<AnchorNavWidget level="h2" heading={null} self={self} />);

    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["Echt"]);
  });
});
