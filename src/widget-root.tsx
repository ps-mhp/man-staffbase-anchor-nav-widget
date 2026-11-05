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

import React, { useMemo } from "react";

import { AnchorNav } from "./anchor-nav";
import { HeadingLevel } from "./configuration-schema";
import { readHeadings } from "./heading-scan";
import { useResolvedHeadings } from "./use-resolved-headings";

export interface AnchorNavWidgetProps {
  readonly level: HeadingLevel;
  readonly heading: string | null;
  /** Der eigene Container. Alles darin bleibt bei der Suche außen vor. */
  readonly self: HTMLElement | null;
  /** Nur Überschriften aus Title- und Text-Blöcken zeigen. */
  readonly blocksOnly: boolean;
  /** Das Attribut `headings`, wie es im Studio erfasst wurde (roh, siehe `readHeadings`). */
  readonly headings: unknown;
}

/**
 * Was der Baustein rendert.
 *
 * Eigene Datei und nicht in `index.tsx`: dort stünde sie zwischen der
 * Anmeldung beim Host und dem Lesen der Attribute, und ein Test müsste das
 * ganze Modul samt `defineBlock` laden, um eine Liste zu prüfen.
 */
export function AnchorNavWidget({
  level,
  heading,
  self,
  blocksOnly,
  headings: raw,
}: AnchorNavWidgetProps): React.ReactElement | null {
  const texts = useMemo(() => readHeadings(raw), [raw]);
  const headings = useResolvedHeadings(texts, level, blocksOnly, self);
  return <AnchorNav headings={headings} heading={heading} />;
}
