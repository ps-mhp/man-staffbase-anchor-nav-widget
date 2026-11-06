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

import { AnchorLink } from "./anchor-links";
import { AnchorNav, COMPACT_TOGGLE_LABEL, FALLBACK_NAV_LABEL } from "./anchor-nav";
import * as headingScan from "./heading-scan";
import { COMPACT_QUERY, REDUCED_MOTION_QUERY } from "./media-query";

/** Verweise auf Überschriften, die zugleich als H2 im Dokument stehen. */
function page(...texte: string[]): { links: AnchorLink[]; elements: HTMLElement[] } {
  document.body.innerHTML = "";
  const elements = texte.map((text) => {
    const element = document.createElement("h2");
    element.textContent = text;
    element.getBoundingClientRect = () => ({ top: 1000 }) as DOMRect;
    document.body.appendChild(element);
    return element;
  });
  return { links: texte.map((label, index) => ({ id: `l${index}`, label })), elements };
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

/** Ein fester Kopfbalken, wie Staffbase ihn führt. */
function fixedHeader(): void {
  const header = document.createElement("div");
  header.id = "header";
  header.style.position = "fixed";
  header.getBoundingClientRect = () => ({ bottom: 64, height: 64 }) as DOMRect;
  document.body.appendChild(header);
}

describe("AnchorNav", () => {
  let scrollToSpy: jest.SpyInstance;

  beforeEach(() => {
    setMedia();
    window.history.replaceState(null, "", "/seite");
    // jsdom implementiert `scrollTo` nicht und meldet sonst bei jedem Aufruf
    // einen „not implemented“-Fehler.
    scrollToSpy = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    delete (window as { matchMedia?: unknown }).matchMedia;
    scrollToSpy.mockRestore();
    jest.restoreAllMocks();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });

  it("zeigt jeden Link als Verweis", () => {
    const { links } = page("Eins", "Zwei");
    render(<AnchorNav links={links} heading="Auf einen Blick" self={null} />);
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(["Eins", "Zwei"]);
  });

  it("gibt ohne Links nichts aus", () => {
    const { container } = render(<AnchorNav links={[]} heading="Auf einen Blick" self={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("zeigt den Titel, wenn einer gesetzt ist", () => {
    render(<AnchorNav links={page("Eins").links} heading="Auf einen Blick" self={null} />);
    expect(screen.getByText("Auf einen Blick")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveAccessibleName("Auf einen Blick");
  });

  it("benennt die Navigation auch ohne Titel", () => {
    render(<AnchorNav links={page("Eins").links} heading={null} self={null} />);
    expect(screen.getByRole("navigation")).toHaveAccessibleName(FALLBACK_NAV_LABEL);
  });

  it("rührt die Seite beim Laden nicht an: kein Durchlauf, kein Beobachter, kein Timer", async () => {
    const { links } = page("Eins", "Zwei");
    const find = jest.spyOn(headingScan, "findHeading");
    const observe = jest.spyOn(MutationObserver.prototype, "observe");
    const resizeObserver = jest.fn();
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = resizeObserver;
    jest.useFakeTimers();
    try {
      render(<AnchorNav links={links} heading="Auf einen Blick" self={null} />);
      expect(jest.getTimerCount()).toBe(0);
      await act(async () => {
        jest.advanceTimersByTime(60_000);
      });
      expect(find).not.toHaveBeenCalled();
      expect(observe).not.toHaveBeenCalled();
      expect(resizeObserver).not.toHaveBeenCalled();
      expect(scrollToSpy).not.toHaveBeenCalled();
    } finally {
      jest.useRealTimers();
      delete (window as unknown as { ResizeObserver?: unknown }).ResizeObserver;
    }
  });

  it("scrollt beim Klick zur Überschrift und markiert den Eintrag", () => {
    const { links, elements } = page("Eins", "Zwei");
    // Unterschiedliche Oberkanten: sonst ist unbewiesen, dass die zweite
    // Überschrift das Ziel war.
    elements[0].getBoundingClientRect = () => ({ top: 2000 }) as DOMRect;
    elements[1].getBoundingClientRect = () => ({ top: 100 }) as DOMRect;
    const find = jest.spyOn(headingScan, "findHeading");
    render(<AnchorNav links={links} heading={null} self={null} />);
    expect(find).not.toHaveBeenCalled();

    const zwei = screen.getByRole("link", { name: "Zwei" });
    expect(zwei).not.toHaveAttribute("aria-current");
    const klick = fireEvent.click(zwei);

    expect(klick).toBe(false); // preventDefault wurde gerufen
    expect(find).toHaveBeenCalledTimes(1);
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 100, behavior: "smooth" });
    expect(zwei).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "Eins" })).not.toHaveAttribute("aria-current");
  });

  it("springt mit einem Ziel zur Überschrift mit diesem Text", () => {
    const { elements } = page("Kurz", "Ausstattung im Detail");
    elements[1].getBoundingClientRect = () => ({ top: 300 }) as DOMRect;
    render(
      <AnchorNav links={[{ id: "a", label: "Ausstattung", target: "Ausstattung im Detail" }]} heading={null} self={null} />,
    );

    fireEvent.click(screen.getByRole("link", { name: "Ausstattung" }));

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 300, behavior: "smooth" });
    expect(window.location.hash).toBe("#ausstattung");
  });

  it("markiert auch, wenn die Überschrift fehlt, und rollt dann nicht", () => {
    page();
    render(<AnchorNav links={[{ id: "a", label: "Gibt es nicht" }]} heading={null} self={null} />);

    const link = screen.getByRole("link", { name: "Gibt es nicht" });
    expect(fireEvent.click(link)).toBe(false);

    expect(scrollToSpy).not.toHaveBeenCalled();
    expect(link).toHaveAttribute("aria-current", "true");
  });

  it("überlässt eine Adresse dem Browser und markiert sie trotzdem", () => {
    page();
    const find = jest.spyOn(headingScan, "findHeading");
    render(<AnchorNav links={[{ id: "a", label: "Intranet", target: "https://example.test/" }]} heading={null} self={null} />);

    const link = screen.getByRole("link", { name: "Intranet" });
    expect(link).toHaveAttribute("href", "https://example.test/");
    expect(fireEvent.click(link)).toBe(true); // nicht verhindert

    expect(find).not.toHaveBeenCalled();
    expect(link).toHaveAttribute("aria-current", "true");
  });

  it("rollt unter eine feste Kopfleiste, statt dahinter zu landen", () => {
    const { links, elements } = page("Eins"); // leert document.body — die Leiste erst danach.
    elements[0].getBoundingClientRect = () => ({ top: 100 }) as DOMRect;
    Object.defineProperty(window, "scrollY", { configurable: true, value: 500 });
    fixedHeader();

    render(<AnchorNav links={links} heading={null} self={null} />);
    fireEvent.click(screen.getByRole("link", { name: "Eins" }));

    // 100 (Oberkante) + 500 (schon gerollt) - 64 (feste Leiste) = 536.
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 536, behavior: "smooth" });
  });

  /**
   * Ein rollfähiger Container mit einer Überschrift darin. `container.scrollTo`
   * wird gestellt: jsdom kennt `Element.prototype.scrollTo` nicht, ohne Mock
   * liefe der Test in den `scrollTop`-Rückfall statt in den Produktivzweig.
   */
  function containerWithHeading(): { container: HTMLElement; containerScrollTo: jest.Mock; links: AnchorLink[] } {
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

    return { container, containerScrollTo, links: [{ id: "l0", label: "Eins" }] };
  }

  it("rollt den eigenen Container, statt wirkungslos das Fenster zu rollen", () => {
    // Im Content Designer rollt die Leinwand in einem eigenen Container;
    // window.scrollTo träfe dort nur das Hauptdokument.
    const { containerScrollTo, links } = containerWithHeading();

    render(<AnchorNav links={links} heading={null} self={null} />);
    fireEvent.click(screen.getByRole("link", { name: "Eins" }));

    expect(scrollToSpy).not.toHaveBeenCalled();
    // (300 - 50) relativ zum Container + 20 (schon gerollt) = 270.
    expect(containerScrollTo).toHaveBeenCalledWith({ top: 270, behavior: "smooth" });
  });

  it("rollt den eigenen Container hart, wenn weniger Bewegung gewünscht ist", () => {
    setMedia(REDUCED_MOTION_QUERY);
    const { containerScrollTo, links } = containerWithHeading();

    render(<AnchorNav links={links} heading={null} self={null} />);
    fireEvent.click(screen.getByRole("link", { name: "Eins" }));

    expect(containerScrollTo).toHaveBeenCalledWith({ top: 270, behavior: "auto" });
  });

  it("zieht im Container nur die wirkliche Überlappung der Chrome ab", () => {
    // Die Leiste reicht bis 64, der Container beginnt bei 40: nur 24 Pixel zählen.
    const { container, containerScrollTo, links } = containerWithHeading();
    container.getBoundingClientRect = () => ({ top: 40 }) as DOMRect;
    fixedHeader();

    render(<AnchorNav links={links} heading={null} self={null} />);
    fireEvent.click(screen.getByRole("link", { name: "Eins" }));

    // (300 - 40) + 20 - 24 = 256.
    expect(containerScrollTo).toHaveBeenCalledWith({ top: 256, behavior: "smooth" });
  });

  it("setzt den Hash der Seite, ohne die Chronik zu füllen", () => {
    const vorher = window.history.length;
    render(<AnchorNav links={page("Eins", "Zwei").links} heading={null} self={null} />);

    fireEvent.click(screen.getByRole("link", { name: "Zwei" }));

    expect(window.location.hash).toBe("#zwei");
    expect(window.history.length).toBe(vorher);
  });

  it("springt hart, wenn weniger Bewegung gewünscht ist", () => {
    setMedia(REDUCED_MOTION_QUERY);
    render(<AnchorNav links={page("Eins").links} heading={null} self={null} />);

    fireEvent.click(screen.getByRole("link", { name: "Eins" }));

    expect(scrollToSpy).toHaveBeenCalledWith(expect.objectContaining({ behavior: "auto" }));
  });

  it("misst die Marke nach einer Fensteränderung neu", () => {
    render(<AnchorNav links={page("Eins", "Zwei").links} heading={null} self={null} />);

    const marke = document.querySelector(".man-anchor-nav__marker") as HTMLElement;
    expect(marke.style.transform).toBe("translateY(0px)");

    const erstesItem = document.querySelector(".man-anchor-nav__item") as HTMLElement;
    Object.defineProperty(erstesItem, "offsetTop", { configurable: true, value: 42 });
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(marke.style.transform).toBe("translateY(42px)");
  });

  // Der Titel steht über der Linie, nicht an ihr: Linie, Marke und Liste
  // teilen sich eine eigene Spur.
  it("legt Linie und Marke neben die Liste, den Titel darüber", () => {
    render(<AnchorNav links={page("Eins", "Zwei").links} heading="Auf einen Blick" self={null} />);

    const track = document.querySelector(".man-anchor-nav__track") as HTMLElement;
    expect(track).not.toBeNull();
    expect(track.querySelector(".man-anchor-nav__rail")).not.toBeNull();
    expect(track.querySelector(".man-anchor-nav__marker")).not.toBeNull();
    expect(track.querySelector(".man-anchor-nav__list")).not.toBeNull();
    expect(track.contains(screen.getByText("Auf einen Blick"))).toBe(false);
  });

  it("setzt die Marke ohne aktiven Eintrag auf den ersten, nicht auf den Titel", () => {
    render(<AnchorNav links={page("Eins", "Zwei").links} heading="Auf einen Blick" self={null} />);
    const titel = screen.getByText("Auf einen Blick");
    Object.defineProperty(titel, "offsetTop", { configurable: true, value: 0 });
    Object.defineProperty(titel, "offsetHeight", { configurable: true, value: 30 });
    const erstesItem = document.querySelector(".man-anchor-nav__item") as HTMLElement;
    Object.defineProperty(erstesItem, "offsetTop", { configurable: true, value: 12 });
    Object.defineProperty(erstesItem, "offsetHeight", { configurable: true, value: 20 });

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    const marke = document.querySelector(".man-anchor-nav__marker") as HTMLElement;
    expect(marke.style.transform).toBe("translateY(12px)");
    expect(marke.style.height).toBe("20px");
  });

  it("zeigt zugeklappt weder Linie noch Marke", () => {
    setMedia(COMPACT_QUERY);
    render(<AnchorNav links={page("Eins").links} heading="Auf einen Blick" self={null} />);

    expect(document.querySelector(".man-anchor-nav__rail")).toBeNull();
    expect(document.querySelector(".man-anchor-nav__marker")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Auf einen Blick/ }));
    expect(document.querySelector(".man-anchor-nav__track .man-anchor-nav__rail")).not.toBeNull();
  });

  it("setzt die Marke auf den angeklickten Eintrag", () => {
    render(<AnchorNav links={page("Eins", "Zwei").links} heading={null} self={null} />);
    const zweitesItem = document.querySelectorAll(".man-anchor-nav__item")[1] as HTMLElement;
    Object.defineProperty(zweitesItem, "offsetTop", { configurable: true, value: 30 });

    fireEvent.click(screen.getByRole("link", { name: "Zwei" }));

    const marke = document.querySelector(".man-anchor-nav__marker") as HTMLElement;
    expect(marke.style.transform).toBe("translateY(30px)");
  });

  it("springt beim Start zum Abschnitt aus dem Hash und markiert ihn", () => {
    window.history.replaceState(null, "", "/seite#zwei");
    const { links, elements } = page("Eins", "Zwei");
    elements[0].getBoundingClientRect = () => ({ top: 2000 }) as DOMRect;
    elements[1].getBoundingClientRect = () => ({ top: 300 }) as DOMRect;

    render(<AnchorNav links={links} heading={null} self={null} />);

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 300, behavior: "auto" });
    expect(screen.getByRole("link", { name: "Zwei" })).toHaveAttribute("aria-current", "true");
  });

  it("sucht beim Start nicht, wenn der Hash zu keinem Eintrag passt", () => {
    window.history.replaceState(null, "", "/seite#gibt-es-nicht");
    const find = jest.spyOn(headingScan, "findHeading");

    render(<AnchorNav links={page("Eins").links} heading={null} self={null} />);

    expect(find).not.toHaveBeenCalled();
    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("übersteht einen Hash, den decodeURIComponent nicht lesen kann", () => {
    window.history.replaceState(null, "", "/seite#100%");
    const { links } = page("Eins");

    expect(() => render(<AnchorNav links={links} heading={null} self={null} />)).not.toThrow();
    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("zeigt auf schmalen Schirmen einen Knopf statt der Liste", () => {
    setMedia(COMPACT_QUERY);
    render(<AnchorNav links={page("Eins").links} heading="Auf einen Blick" self={null} />);

    const knopf = screen.getByRole("button", { name: "Auf einen Blick" });
    expect(knopf).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("beschriftet den Knopf ohne Titel mit dem Ersatztext", () => {
    setMedia(COMPACT_QUERY);
    render(<AnchorNav links={page("Eins").links} heading={null} self={null} />);
    expect(screen.getByRole("button", { name: COMPACT_TOGGLE_LABEL })).toBeInTheDocument();
  });

  it("klappt auf Tipp auf und nach dem Sprung wieder zu", () => {
    setMedia(COMPACT_QUERY);
    render(<AnchorNav links={page("Eins").links} heading={null} self={null} />);

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(screen.getByRole("link", { name: "Eins" }));
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("gibt der Zielüberschrift den Fokus und räumt das Hilfsattribut wieder weg", () => {
    const { links, elements } = page("Eins");
    render(<AnchorNav links={links} heading={null} self={null} />);

    fireEvent.click(screen.getByRole("link", { name: "Eins" }));
    expect(elements[0]).toHaveFocus();

    fireEvent.blur(elements[0]);
    expect(elements[0]).not.toHaveAttribute("tabindex");
  });

  it("meldet den Blur-Lauscher beim Unmount ab", () => {
    // Sonst entfernte ein später feuerndes blur ein tabindex, das inzwischen
    // die Wirtsseite gesetzt hat.
    const { links, elements } = page("Eins");
    const { unmount } = render(<AnchorNav links={links} heading={null} self={null} />);

    fireEvent.click(screen.getByRole("link", { name: "Eins" }));
    expect(elements[0]).toHaveAttribute("tabindex", "-1");

    unmount();
    elements[0].setAttribute("tabindex", "0"); // von der Wirtsseite gesetzt.
    fireEvent.blur(elements[0]);

    expect(elements[0]).toHaveAttribute("tabindex", "0");
  });

  it("springt auch unter React.StrictMode noch an, obwohl Effekte doppelt laufen", () => {
    // Ein im Render angelegter AbortController wäre nach dem synthetischen
    // Abmontieren dauerhaft abgebrochen; tabindex bliebe kleben.
    const { links, elements } = page("Eins");
    render(
      <React.StrictMode>
        <AnchorNav links={links} heading={null} self={null} />
      </React.StrictMode>,
    );

    fireEvent.click(screen.getByRole("link", { name: "Eins" }));
    expect(elements[0]).toHaveAttribute("tabindex", "-1");

    fireEvent.blur(elements[0]);

    expect(elements[0]).not.toHaveAttribute("tabindex");
  });

  it("räumt das Hilfsattribut sofort weg, wenn die Überschrift den Fokus nicht annimmt", () => {
    // Wie eine Überschrift in einem `display: none`-Bereich: `focus()` bleibt
    // wirkungslos, und ohne Gegenprobe folgte nie ein `blur`.
    const { links, elements } = page("Versteckt");
    elements[0].focus = () => {};

    render(<AnchorNav links={links} heading={null} self={null} />);
    fireEvent.click(screen.getByRole("link", { name: "Versteckt" }));

    expect(elements[0]).not.toHaveAttribute("tabindex");
  });

  it("überlässt einen Klick mit Zusatztaste dem Browser", () => {
    render(<AnchorNav links={page("Eins").links} heading={null} self={null} />);

    fireEvent.click(screen.getByRole("link", { name: "Eins" }), { metaKey: true });

    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it("springt zu einem Block per ID, auch im Shadow Root, unter die Kopfleiste", () => {
    page();
    fixedHeader();
    const host = document.createElement("div");
    document.body.appendChild(host);
    const block = document.createElement("div");
    block.id = "a447d858-1bba-4a49-b620-b49c60dd67a7";
    block.getBoundingClientRect = () => ({ top: 500 }) as DOMRect;
    host.attachShadow({ mode: "open" }).appendChild(block);
    render(<AnchorNav links={[{ id: "a", label: "News", target: `#${block.id}` }]} heading={null} self={null} />);

    const link = screen.getByRole("link", { name: "News" });
    expect(fireEvent.click(link)).toBe(false);

    const [[{ top }]] = scrollToSpy.mock.calls as [[{ top: number }]];
    expect(top).toBeLessThan(500);
    expect(window.location.hash).toBe(`#${block.id}`);
    expect(link).toHaveAttribute("aria-current", "true");
  });

  it("überlässt eine Block-ID dem Browser, wenn der Block fehlt", () => {
    page();
    render(<AnchorNav links={[{ id: "a", label: "Weg", target: "#gibt-es-nicht" }]} heading={null} self={null} />);
    expect(fireEvent.click(screen.getByRole("link", { name: "Weg" }))).toBe(true);
    expect(scrollToSpy).not.toHaveBeenCalled();
  });
});
