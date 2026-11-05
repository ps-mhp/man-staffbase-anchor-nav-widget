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

import { readBlocksOnly, readLevel } from "./configuration-schema";

describe("readLevel", () => {
  it("nimmt jede gültige Ebene an", () => {
    expect(readLevel("h1")).toBe("h1");
    expect(readLevel("h6")).toBe("h6");
  });

  it("fällt bei fehlendem Attribut auf h2 zurück", () => {
    expect(readLevel(undefined)).toBe("h2");
    expect(readLevel(null)).toBe("h2");
  });

  it("fällt bei unbekanntem Wert auf h2 zurück", () => {
    expect(readLevel("h7")).toBe("h2");
    expect(readLevel("überschrift")).toBe("h2");
    expect(readLevel(3)).toBe("h2");
  });

  it("liest Groß- und Kleinschreibung gleich", () => {
    expect(readLevel("H3")).toBe("h3");
  });
});

describe("readBlocksOnly", () => {
  it("filtert ohne Angabe — Bloecke aus der Zeit vor der Einstellung eingeschlossen", () => {
    expect(readBlocksOnly(undefined)).toBe(true);
    expect(readBlocksOnly(null)).toBe(true);
    expect(readBlocksOnly("")).toBe(true);
  });

  it("schaltet nur bei einem ausdruecklichen Nein ab", () => {
    // Aus dem DOM kommt die Zeichenkette, aus dem Dialog der echte Wert.
    expect(readBlocksOnly("false")).toBe(false);
    expect(readBlocksOnly("False")).toBe(false);
    expect(readBlocksOnly(false)).toBe(false);
  });

  it("nimmt ein Ja in beiden Formen an", () => {
    expect(readBlocksOnly("true")).toBe(true);
    expect(readBlocksOnly(true)).toBe(true);
  });
});
