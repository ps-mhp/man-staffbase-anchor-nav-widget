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

/** Überschriften im Dokument, damit `scrollIntoView` ein echtes Ziel hat. */
function headings(...texte: string[]): ScannedHeading[] {
  document.body.innerHTML = "";
  return texte.map((text, index) => {
    const element = document.createElement("h2");
    element.textContent = text;
    element.scrollIntoView = jest.fn();
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
    render(<AnchorNav headings={liste} heading={null} />);

    const klick = fireEvent.click(screen.getByRole("link", { name: "Zwei" }));

    expect(klick).toBe(false); // preventDefault wurde gerufen
    expect(scrollToSpy).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));
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

  it("fällt auf scrollIntoView zurück, wenn window.scrollTo fehlt", () => {
    scrollToSpy.mockRestore();
    delete (window as { scrollTo?: unknown }).scrollTo;

    const liste = headings("Eins");
    render(<AnchorNav headings={liste} heading={null} />);

    fireEvent.click(screen.getByRole("link", { name: "Eins" }));

    expect(liste[0].element.scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth", block: "start" }),
    );
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

    render(<AnchorNav headings={liste} heading={null} />);

    expect(scrollToSpy).toHaveBeenCalled();
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

  it("räumt das Hilfsattribut sofort weg, wenn die Überschrift den Fokus nicht annimmt", () => {
    // Ein nicht ans Dokument gehängtes Element ist in jsdom nicht fokussierbar:
    // `focus()` ist dort ein No-Op, genau wie bei einer Überschrift in einem
    // `display: none`-Bereich. Ohne Gegenprobe bliebe `tabindex="-1"` für immer
    // auf diesem fremden Element kleben, weil nie ein `blur` folgt.
    const element = document.createElement("h2");
    element.textContent = "Versteckt";
    element.scrollIntoView = jest.fn();
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
