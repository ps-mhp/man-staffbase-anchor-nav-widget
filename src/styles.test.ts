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
 * Wachen über das übersetzte Stylesheet. Das man-theme nummeriert jede `ol`
 * im Seiteninhalt — im App-Slot über `::marker`, im Designer über `::before`,
 * beide mit dem Zähler `man-ol` — und setzt Einzug, Abstände und Schrift der
 * Einträge mit `!important` (am 06.11.2026 als führende Zahlen vor jedem
 * Eintrag gesehen). Die Liste hier ist Navigation, kein Fließtext.
 */

import css from "./styles/anchor-nav.scss";

const OUTSHINE = (className: string): string => `\\.${className.replace(/-/g, "\\-")}`.repeat(5);

/** Der Rumpf der Regel, deren Selektorliste `selector` als eigenen Eintrag enthält. */
function ruleBody(selector: string): string {
  const match = css.match(new RegExp(`(?:^|[},/])\\s*${selector}\\s*(?:,[^{}]*)?\\{([^}]*)\\}`));
  return match?.[1] ?? "";
}

describe("Stylesheet gegen die Listenregeln des Themes", () => {
  it("nimmt der Liste Zähler, Einzug und Abstand", () => {
    const body = ruleBody(OUTSHINE("man-anchor-nav__list"));
    expect(body).toMatch(/list-style:\s*none\s*!important/);
    expect(body).toMatch(/padding:\s*0\s*!important/);
    expect(body).toMatch(/margin:\s*0\s*!important/);
    expect(body).toMatch(/counter-reset:\s*none\s*!important/);
  });

  it("gibt den Einträgen Abstand und Schrift der Navigation zurück", () => {
    const body = ruleBody(OUTSHINE("man-anchor-nav__item"));
    expect(body).toMatch(/margin:\s*0\s*!important/);
    expect(body).toMatch(/counter-increment:\s*none\s*!important/);
    expect(body).toMatch(/font:\s*inherit\s*!important/);
    expect(body).toMatch(/color:\s*inherit\s*!important/);
  });

  // Der Titel steht linksbündig über der Linie; den Einzug hat die Spur.
  it("rückt nur die Spur ein, nicht den Titel", () => {
    expect(ruleBody("\\.man-anchor-nav")).not.toMatch(/padding-left/);
    const track = ruleBody("\\.man-anchor-nav__track");
    expect(track).toMatch(/position:\s*relative/);
    expect(track).toMatch(/padding-left:/);
  });

  it.each(["::marker", "::before"])("leert %s der Einträge", (pseudo) => {
    const body = ruleBody(`${OUTSHINE("man-anchor-nav__item")}${pseudo}`);
    expect(body).toMatch(/content:\s*none\s*!important/);
  });
});
