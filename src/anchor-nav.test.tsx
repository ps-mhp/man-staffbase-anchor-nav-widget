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
import { act, fireEvent, render, screen } from "@testing-library/react";

import { AnchorNav, COMPACT_TOGGLE_LABEL, FALLBACK_NAV_LABEL } from "./anchor-nav";
import { ScannedHeading } from "./heading-scan";
import { COMPACT_QUERY, REDUCED_MOTION_QUERY } from "./media-query";

/** Überschriften im Dokument. */
function headings(...texte: string[]): ScannedHeading[] {
  document.body.innerHTML = "";
  return texte.map((text, index) => {
    const element = document.createElement("h2");
    element.textContent = text;
    element.getBoundingClientRect = () => ({ top: 1000 }) as DOMRect;
    document.body.appendChild(element);
    return { element, text, slug: `abschnitt-${index + 1}` };
  });
}

/** Stellt `matchMedia` so, dass genau die aufgezählten Abfragen zutreffen. */
function setMedia(...wahr: string[]): void {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: wahr.includes(query),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
}

describe("AnchorNav", () => {
  let scrollToSpy: jest.SpyInstance;

  beforeEach(() => {
    setMedia();
    window.history.replaceState(null, "", "/seite");
    // Reiner No-Op-Ersatz: jsdom implementiert `scrollTo` nicht wirklich und
    // meldet sonst bei jedem Aufruf einen „not implemented“-Fehler.
    scrollToSpy = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    delete (window as { matchMedia?: unknown }).matchMedia;
    scrollToSpy.mockRestore();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });

  it("zeigt jede Überschrift als Verweis", () => {
    render(<AnchorNav headings={headings("Eins", "Zwei")} heading="Auf einen Blick" />);
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["Eins", "Zwei"]);
  });

  it("gibt ohne Überschriften nichts aus", () => {
    const { container } = render(<AnchorNav headings={[]} heading="Auf einen Blick" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("zeigt den Titel, wenn einer gesetzt ist", () => {
    render(<AnchorNav headings={headings("Eins")} heading="Auf einen Blick" />);
    expect(screen.getByText("Auf einen Blick")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveAccessibleName("Auf einen Blick");
  });

  it("benennt die Navigation auch ohne Titel", () => {
    render(<AnchorNav headings={headings("Eins")} heading={null} />);
    expect(screen.getByRole("navigation")).toHaveAccessibleName(FALLBACK_NAV_LABEL);
  });

  it("scrollt beim Klick zur Überschrift statt dem Anker zu folgen", () => {
    const liste = headings("Eins", "Zwei");
    // Unterschiedliche Oberkanten: ohne sie belegt der Test nur, dass
    // irgendein `scrollTo` lief, nicht, dass die zweite Überschrift (und
    // nicht die erste) das Ziel war.
    liste[0].element.getBoundingClientRect = () => ({ top: 2000 }) as DOMRect;
    liste[1].element.getBoundingClientRect = () => ({ top: 100 }) as DOMRect;
    render(<AnchorNav headings={liste} heading={null} />);

    const klick = fireEvent.click(screen.getByRole("link", { name: "Zwei" }));

    expect(klick).toBe(false); // preventDefault wurde gerufen
    // 100 (Oberkante von "Zwei") + 0 (scrollY) - 0 (keine Chrome) = 100.
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 100, behavior: "smooth" });
  });

  it("rollt unter eine feste Kopfleiste, statt dahinter zu landen", () => {
    // scrollIntoView({ block: "start" }) legt die Oberkante der Überschrift auf
    // die Oberkante des Sichtbereichs — genau dort, wo Staffbases feste
    // Kopfzeile steht. Der eigene Rollvorgang zieht ihre Höhe ab.
    const liste = headings("Eins"); // leert document.body — die Leiste erst danach anhängen.
    liste[0].element.getBoundingClientRect = () => ({ top: 100 }) as DOMRect;
    Object.defineProperty(window, "scrollY", { configurable: true, value: 500 });

    const header = document.createElement("div");
    header.id = "header";
    header.style.position = "fixed";
    header.getBoundingClientRect = () => ({ bottom: 64, height: 64 }) as DOMRect;
    document.body.appendChild(header);

    render(<AnchorNav headings={liste} heading={null} />);
    fireEvent.click(screen.getByRole("link", { name: "Eins" }));

    // 100 (Oberkante) + 500 (schon gerollt) - 64 (feste Leiste) = 536.
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 536, behavior: "smooth" });
  });

  /**
   * Baut einen rollfähigen Container mit einer Überschrift darin.
   *
   * `container.scrollTo` wird hier bewusst gestellt: jsdom kennt
   * `Element.prototype.scrollTo` nicht (anders als `window.scrollTo`, das
   * `beforeEach` bereits mockt), ohne eigenen Mock läuft der Test unweigerlich
   * in den `scrollTop`-Rückfall statt in den Produktivzweig
   * `scrollParent.scrollTo({ top, behavior })` — genau der Fehler, an dem die
   * vorigen beiden Review-Runden schon gescheitert sind.
   */
  function containerWithHeading(): { container: HTMLElement; containerScrollTo: jest.Mock; liste: ScannedHeading[] } {
    document.body.innerHTML = "";
    const container = document.createElement("div");
    container.style.overflowY = "auto";
    Object.defineProperty(container, "scrollHeight", { configurable: true, value: 2000 });
    Object.defineProperty(container, "clientHeight", { configurable: true, value: 400 });
    container.getBoundingClientRect = () => ({ top: 50 }) as DOMRect;
    container.scrollTop = 20;
    const containerScrollTo = jest.fn();
    container.scrollTo = containerScrollTo;
    document.body.appendChild(container);

    const element = document.createElement("h2");
    element.textContent = "Eins";
    element.getBoundingClientRect = () => ({ top: 300 }) as DOMRect;
    container.appendChild(element);
    const liste = [{ element, text: "Eins", slug: "abschnitt-1" }];

    return { container, containerScrollTo, liste };
  }

  it("rollt den eigenen Container, statt wirkungslos das Fenster zu rollen", () => {
    // Im Content Designer rollt die Leinwand in einem eigenen Container statt
    // am Dokument (siehe use-active-heading.ts). window.scrollTo trifft dort
    // ausschließlich das Hauptdokument — der Klick bewegt dann sichtbar gar
    // nichts.
    const { containerScrollTo, liste } = containerWithHeading();

    render(<AnchorNav headings={liste} heading={null} />);
    fireEvent.click(screen.getByRole("link", { name: "Eins" }));

    // window.scrollTo bliebe wirkungslos und darf deshalb nicht laufen.
    expect(scrollToSpy).not.toHaveBeenCalled();
    // (300 - 50) Oberkante relativ zum Container + 20 (schon gerollt) - 0
    // (keine Chrome) = 270.
    expect(containerScrollTo).toHaveBeenCalledWith({ top: 270, behavior: "smooth" });
  });

  it("rollt den eigenen Container hart, wenn weniger Bewegung gewünscht ist", () => {
    // Derselbe Produktivzweig wie oben, aber mit `prefers-reduced-motion`:
    // `behavior` muss auch im Container-Fall durchgereicht werden, nicht nur
    // beim Rollen des Fensters.
    setMedia(REDUCED_MOTION_QUERY);
    const { containerScrollTo, liste } = containerWithHeading();

    render(<AnchorNav headings={liste} heading={null} />);
    fireEvent.click(screen.getByRole("link", { name: "Eins" }));

    expect(containerScrollTo).toHaveBeenCalledWith({ top: 270, behavior: "auto" });
  });

  it("zieht im Container nur die wirkliche Überlappung ab, nicht die volle Chrome-Höhe", () => {
    // B4: die feste Leiste reicht bis 64, der Container beginnt aber erst bei
    // 200 -- die Leiste steht im Content-Designer-Normalfall über der
    // Leinwand, nicht über dem Container selbst. Ein voller Abzug verschöbe
    // das Ziel um die ganze Leistenhöhe zu weit nach unten.
    const { container, containerScrollTo, liste } = containerWithHeading();
    container.getBoundingClientRect = () => ({ top: 200 }) as DOMRect;

    const header = document.createElement("div");
    header.id = "header";
    header.style.position = "fixed";
    header.getBoundingClientRect = () => ({ bottom: 64, height: 64 }) as DOMRect;
    document.body.appendChild(header);

    render(<AnchorNav headings={liste} heading={null} />);
    fireEvent.click(screen.getByRole("link", { name: "Eins" }));

    // (300 - 200) Oberkante relativ zum Container + 20 (schon gerollt) - 0
    // (keine Überlappung, Container beginnt unterhalb der Leiste) = 120.
    expect(containerScrollTo).toHaveBeenCalledWith({ top: 120, behavior: "smooth" });
  });

  it("zieht im Container nur den überlappenden Teil der Chrome ab", () => {
    // Die Leiste reicht bis 64, der Container beginnt bei 40 -- nur die
    // 24 Pixel Überlappung zählen, nicht die volle Leistenhöhe.
    const { container, containerScrollTo, liste } = containerWithHeading();
    container.getBoundingClientRect = () => ({ top: 40 }) as DOMRect;

    const header = document.createElement("div");
    header.id = "header";
    header.style.position = "fixed";
    header.getBoundingClientRect = () => ({ bottom: 64, height: 64 }) as DOMRect;
    document.body.appendChild(header);

    render(<AnchorNav headings={liste} heading={null} />);
    fireEvent.click(screen.getByRole("link", { name: "Eins" }));

    // (300 - 40) Oberkante relativ zum Container + 20 (schon gerollt) - 24
    // (Überlappung) = 256.
    expect(containerScrollTo).toHaveBeenCalledWith({ top: 256, behavior: "smooth" });
  });

  it("setzt den Hash der Seite, ohne die Chronik zu füllen", () => {
    const vorher = window.history.length;
    render(<AnchorNav headings={headings("Eins", "Zwei")} heading={null} />);

    fireEvent.click(screen.getByRole("link", { name: "Zwei" }));

    expect(window.location.hash).toBe("#abschnitt-2");
    expect(window.history.length).toBe(vorher);
  });

  it("springt hart, wenn weniger Bewegung gewünscht ist", () => {
    setMedia(REDUCED_MOTION_QUERY);
    const liste = headings("Eins");
    render(<AnchorNav headings={liste} heading={null} />);

    fireEvent.click(screen.getByRole("link", { name: "Eins" }));

    expect(scrollToSpy).toHaveBeenCalledWith(expect.objectContaining({ behavior: "auto" }));
  });

  it("misst die Marke nach einer Größenänderung neu", () => {
    // jsdom kennt keinen ResizeObserver; ein eigener Mock erfasst die
    // registrierte Rückruffunktion, damit der Test eine Größenänderung
    // auslösen kann, ohne dass sich eine der fünf Abhängigkeiten der
    // bestehenden Messung ändert (active, headings, compact, open, heading).
    let onResize: (() => void) | null = null;
    const observe = jest.fn();
    const disconnect = jest.fn();
    class FakeResizeObserver {
      constructor(callback: () => void) {
        onResize = callback;
      }
      observe = observe;
      disconnect = disconnect;
    }
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;

    const liste = headings("Eins", "Zwei");
    render(<AnchorNav headings={liste} heading={null} />);

    const marke = document.querySelector(".man-anchor-nav__marker") as HTMLElement;
    expect(marke.style.transform).toBe("translateY(0px)");

    // Layoutänderung ohne eine der fünf Abhängigkeiten: nur die gemessene
    // Lage selbst ändert sich (z. B. ein nachladender Web-Font). Gemessen wird
    // am `<li>`, nicht an `liste[0].element` — Letzteres ist die fremde
    // Überschrift auf der Seite, das Segment zeigt auf den Eintrag im
    // Verzeichnis selbst.
    const erstesItem = document.querySelector(".man-anchor-nav__item") as HTMLElement;
    Object.defineProperty(erstesItem, "offsetTop", { configurable: true, value: 42 });
    expect(onResize).not.toBeNull();
    act(() => {
      (onResize as () => void)();
    });

    expect(marke.style.transform).toBe("translateY(42px)");

    delete (window as unknown as { ResizeObserver?: unknown }).ResizeObserver;
  });

  it("legt den ResizeObserver auch an, wenn das nav erst nach dem ersten Rendern entsteht", () => {
    // Der echte Pfad: `usePageHeadings` liefert beim ersten Rendern eine
    // leere Liste (die Komponente gibt dann `null` zurueck, `nav` existiert
    // nicht), die Ueberschriften kommen erst mit einem spaeteren Rendern
    // nach. Ein Test, der direkt mit gefuellter Liste rendert, nimmt genau
    // den einen Pfad, der schon funktioniert, und uebersieht diesen Fehler.
    const observe = jest.fn();
    const disconnect = jest.fn();
    class FakeResizeObserver {
      observe = observe;
      disconnect = disconnect;
    }
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;

    // `headings(...)` leert `document.body` zuerst — deshalb vor dem ersten
    // Rendern aufgebaut, sonst risse ein späterer Aufruf den Container von
    // Testing Library mit weg.
    const liste = headings("Eins");

    const { rerender } = render(<AnchorNav headings={[]} heading={null} />);
    expect(observe).not.toHaveBeenCalled();

    rerender(<AnchorNav headings={liste} heading={null} />);

    expect(observe).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalledWith(document.querySelector(".man-anchor-nav"));

    // Fallen alle Ueberschriften wieder weg, haengt der Beobachter sonst am
    // abgehaengten nav weiter.
    rerender(<AnchorNav headings={[]} heading={null} />);
    expect(disconnect).toHaveBeenCalledTimes(1);

    delete (window as unknown as { ResizeObserver?: unknown }).ResizeObserver;
  });

  it("zeichnet den aktiven Eintrag aus", () => {
    const liste = headings("Eins", "Zwei");
    liste[0].element.getBoundingClientRect = () => ({ top: -10 }) as DOMRect;
    render(<AnchorNav headings={liste} heading={null} />);

    expect(screen.getByRole("link", { name: "Eins" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "Zwei" })).not.toHaveAttribute("aria-current");
  });

  it("springt beim Start zum Abschnitt aus dem Hash", () => {
    window.history.replaceState(null, "", "/seite#abschnitt-2");
    const liste = headings("Eins", "Zwei");
    // Unterschiedliche Oberkanten: sonst ist unbewiesen, dass die zweite
    // Überschrift (und nicht die erste) das Sprungziel war.
    liste[0].element.getBoundingClientRect = () => ({ top: 2000 }) as DOMRect;
    liste[1].element.getBoundingClientRect = () => ({ top: 300 }) as DOMRect;

    render(<AnchorNav headings={liste} heading={null} />);

    // 300 (Oberkante von "Zwei") + 0 (scrollY) - 0 (keine Chrome) = 300.
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 300, behavior: "auto" });
  });

  it("springt beim Start nicht, wenn der Hash zu nichts passt", () => {
    window.history.replaceState(null, "", "/seite#gibt-es-nicht");
    const liste = headings("Eins");

    render(<AnchorNav headings={liste} heading={null} />);

    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("übersteht einen Hash, den decodeURIComponent nicht lesen kann", () => {
    // "%" ohne zwei folgende Hex-Ziffern lässt decodeURIComponent mit einem
    // URIError scheitern — unabgesichert reißt das die React-Wurzel ab.
    window.history.replaceState(null, "", "/seite#100%");
    const liste = headings("Eins");

    expect(() => render(<AnchorNav headings={liste} heading={null} />)).not.toThrow();

    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("zeigt auf schmalen Schirmen einen Knopf statt der Liste", () => {
    setMedia(COMPACT_QUERY);
    render(<AnchorNav headings={headings("Eins")} heading="Auf einen Blick" />);

    const knopf = screen.getByRole("button", { name: "Auf einen Blick" });
    expect(knopf).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("beschriftet den Knopf ohne Titel mit dem Ersatztext", () => {
    setMedia(COMPACT_QUERY);
    render(<AnchorNav headings={headings("Eins")} heading={null} />);
    expect(screen.getByRole("button", { name: COMPACT_TOGGLE_LABEL })).toBeInTheDocument();
  });

  it("klappt auf Tipp auf und nach dem Sprung wieder zu", () => {
    setMedia(COMPACT_QUERY);
    render(<AnchorNav headings={headings("Eins")} heading={null} />);

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(screen.getByRole("link", { name: "Eins" }));
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("gibt der Zielüberschrift den Fokus und räumt das Hilfsattribut wieder weg", () => {
    const liste = headings("Eins");
    render(<AnchorNav headings={liste} heading={null} />);

    fireEvent.click(screen.getByRole("link", { name: "Eins" }));
    expect(liste[0].element).toHaveFocus();

    fireEvent.blur(liste[0].element);
    expect(liste[0].element).not.toHaveAttribute("tabindex");
  });

  it("meldet den Blur-Lauscher beim Unmount ab", () => {
    // Unmountet das Widget, während eine angesprungene Überschrift noch den
    // Fokus hat, bleibt der Lauscher sonst bestehen. Setzt die Wirtsseite in
    // der Zwischenzeit ihr eigenes tabindex auf demselben Element, entfernte
    // ein später feuerndes blur genau das — ein fremder Zustand, den das
    // Widget nach seinem Ende nicht mehr anfassen darf.
    const liste = headings("Eins");
    const { unmount } = render(<AnchorNav headings={liste} heading={null} />);

    fireEvent.click(screen.getByRole("link", { name: "Eins" }));
    expect(liste[0].element).toHaveAttribute("tabindex", "-1");

    unmount();
    liste[0].element.setAttribute("tabindex", "0"); // von der Wirtsseite gesetzt.
    fireEvent.blur(liste[0].element);

    expect(liste[0].element).toHaveAttribute("tabindex", "0");
  });

  it("springt auch unter React.StrictMode noch an, obwohl Effekte doppelt laufen", () => {
    // B5: `useRef(new AbortController())` legt den Controller im Render an,
    // nicht im Effekt. `useRef` behält zwar nur den allerersten Wert, aber
    // unter StrictMode (React montiert zu Entwicklungszeiten synthetisch ab
    // und wieder an, um genau solche Effektfehler aufzudecken) bricht der
    // Aufräumeffekt denselben, über alle Zyklen hinweg geteilten Controller
    // beim ersten synthetischen Abmontieren ab. Jeder Klick danach registriert
    // seinen Blur-Lauscher mit einem bereits abgebrochenen Signal —
    // `addEventListener` mit abgebrochenem Signal ist ein No-Op, das
    // `tabindex="-1"` bliebe für immer auf der fremden Überschrift kleben.
    const liste = headings("Eins");
    render(
      <React.StrictMode>
        <AnchorNav headings={liste} heading={null} />
      </React.StrictMode>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Eins" }));
    expect(liste[0].element).toHaveAttribute("tabindex", "-1");

    fireEvent.blur(liste[0].element);

    expect(liste[0].element).not.toHaveAttribute("tabindex");
  });

  it("räumt das Hilfsattribut sofort weg, wenn die Überschrift den Fokus nicht annimmt", () => {
    // Ein nicht ans Dokument gehängtes Element ist in jsdom nicht fokussierbar:
    // `focus()` ist dort ein No-Op, genau wie bei einer Überschrift in einem
    // `display: none`-Bereich. Ohne Gegenprobe bliebe `tabindex="-1"` für immer
    // auf diesem fremden Element kleben, weil nie ein `blur` folgt.
    const element = document.createElement("h2");
    element.textContent = "Versteckt";
    const liste: ScannedHeading[] = [{ element, text: "Versteckt", slug: "versteckt" }];

    render(<AnchorNav headings={liste} heading={null} />);
    fireEvent.click(screen.getByRole("link", { name: "Versteckt" }));

    expect(element).not.toHaveAttribute("tabindex");
  });

  it("überlässt einen Klick mit Zusatztaste dem Browser", () => {
    const liste = headings("Eins");
    render(<AnchorNav headings={liste} heading={null} />);

    fireEvent.click(screen.getByRole("link", { name: "Eins" }), { metaKey: true });

    expect(scrollToSpy).not.toHaveBeenCalled();
  });
});
