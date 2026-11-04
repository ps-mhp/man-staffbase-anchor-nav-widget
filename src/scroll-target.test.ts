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

import { jumpTarget } from "./scroll-target";

// `measureChromeHeight` lebt seit N3 in `@shared/staffbase-chrome` (geteilt
// mit den Schwester-Widgets) und wird dort getestet, nicht hier noch einmal.
describe("jumpTarget", () => {
  it("rollt um die Oberkante abzüglich der Chrome-Höhe", () => {
    // 100 (Oberkante im Sichtbereich) + 500 (schon gerollt) - 64 (feste Leiste)
    expect(jumpTarget(100, 500, 64)).toBe(536);
  });

  it("verschiebt nicht, wenn keine Chrome im Weg steht", () => {
    expect(jumpTarget(100, 500, 0)).toBe(600);
  });

  it("rollt auch zu einer Überschrift oberhalb des Sichtbereichs", () => {
    expect(jumpTarget(-300, 500, 64)).toBe(136);
  });
});
