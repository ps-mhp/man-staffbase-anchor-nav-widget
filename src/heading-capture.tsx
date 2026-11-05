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
 * Erfasst die Überschriften der Seite im Studio.
 *
 * Läuft ausschließlich unter `/studio/`, nur solange der Dialog des Widgets
 * offen ist, und durchläuft die Seite genau einmal je Öffnen. Die
 * veröffentlichte Seite liest nur noch das Ergebnis aus dem Attribut.
 */

import React, { useEffect, useState } from "react";

import { ConfigField, setNativeFieldValue, startConfigFieldInjector } from "@shared/config-field-injector";

import { HEADINGS_ATTRIBUTE } from "./configuration-schema";
import { CapturedHeading, captureHeadings, encodeHeadings } from "./heading-scan";

/** `true` im Studio von Staffbase, wo Seiten bearbeitet werden. */
export function isStudioPage(location: Location = window.location): boolean {
  return location.pathname.startsWith("/studio/");
}

/**
 * Die Überschriften der Seite, ohne den Dialog selbst.
 *
 * Findet das Dokument nichts, wird in jedem gleichursprünglichen `iframe`
 * gesucht: falls das Studio die Leinwand dort rendert, läge die Seite sonst
 * außer Reichweite.
 */
export function capturePageHeadings(dialog: Node | null): CapturedHeading[] {
  const exclude = dialog ? [dialog] : [];
  const direct = captureHeadings(document.body, exclude);
  if (direct.length > 0) return direct;

  for (const frame of Array.from(document.querySelectorAll("iframe"))) {
    let body: HTMLElement | null;
    try {
      body = frame.contentDocument?.body ?? null;
    } catch {
      continue; // fremder Ursprung
    }
    if (body === null) continue;
    const framed = captureHeadings(body);
    if (framed.length > 0) return framed;
  }
  return [];
}

/** „H1: 3 · H2: 8“ — damit der Redakteur sieht, dass etwas ankam. */
function summarize(headings: readonly CapturedHeading[]): string {
  const counts = new Map<number, number>();
  for (const { level } of headings) counts.set(level, (counts.get(level) ?? 0) + 1);
  return [...counts.entries()]
    .sort(([a], [b]) => a - b)
    .map(([level, count]) => `H${level}: ${count}`)
    .join(" · ");
}

export function HeadingCapture({ field }: { readonly field: ConfigField }): React.ReactElement {
  const [captured, setCaptured] = useState<readonly CapturedHeading[] | null>(null);

  useEffect(() => {
    const dialog = field.closest('[role="dialog"]') ?? field.form;
    const headings = capturePageHeadings(dialog);
    const value = encodeHeadings(headings);
    if (field.value !== value) setNativeFieldValue(field, value);
    setCaptured(headings);
  }, [field]);

  if (captured === null) return <p>Überschriften werden übernommen …</p>;
  if (captured.length === 0) {
    return <p>Auf dieser Seite wurden keine Überschriften gefunden.</p>;
  }
  return (
    <p>
      {captured.length} Überschriften der Seite übernommen ({summarize(captured)}). Sie werden beim Speichern
      festgehalten.
    </p>
  );
}

/** Hängt das Erfassen an das ausgeblendete Feld `headings`. */
export function startHeadingCapture(root: ParentNode = document): () => void {
  return startConfigFieldInjector({
    fieldKey: HEADINGS_ATTRIBUTE,
    hideField: true,
    root,
    render: (field) => <HeadingCapture field={field} />,
  });
}
