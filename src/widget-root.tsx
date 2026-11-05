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

import { parseAnchorLinks } from "./anchor-links";
import { AnchorNav } from "./anchor-nav";

export interface AnchorNavWidgetProps {
  readonly heading: string | null;
  /** Das Attribut `links`, roh (siehe `parseAnchorLinks`). */
  readonly links: unknown;
  /** Der eigene Container. Überschriften darin sind kein Sprungziel. */
  readonly self: HTMLElement | null;
}

/**
 * Was der Baustein rendert.
 *
 * Eigene Datei und nicht in `index.tsx`: dort stünde sie zwischen der
 * Anmeldung beim Host und dem Lesen der Attribute, und ein Test müsste das
 * ganze Modul samt `defineBlock` laden, um eine Liste zu prüfen.
 */
export function AnchorNavWidget({ heading, links: raw, self }: AnchorNavWidgetProps): React.ReactElement | null {
  const links = useMemo(() => parseAnchorLinks(raw), [raw]);
  return <AnchorNav links={links} heading={heading} self={self} />;
}
