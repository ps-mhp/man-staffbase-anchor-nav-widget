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
 * Die Zeichen der Zielarten, in der Liste wie in der Auswahl der Seite:
 * Überschriften mit ihrer Ebene (H1–H4), sofern die Seite sie verrät, sonst
 * „T“ für „Text einer Überschrift“; Widgets, Block-IDs und Adressen je eigen.
 */

import { Hash, Heading1, Heading2, Heading3, Heading4, Link2, PanelTop, Type } from "lucide-react";
import type { IconComponent } from "@man/config-ui/form/segmented";

import { LinkTargetInfo } from "./link-describe";
import { HeadingLevel, OutlineEntry } from "./page-outline";

const HEADING_ICONS: Readonly<Record<HeadingLevel, IconComponent>> = {
  1: Heading1,
  2: Heading2,
  3: Heading3,
  4: Heading4,
};

const headingIcon = (level: HeadingLevel | undefined): IconComponent =>
  level === undefined ? Type : HEADING_ICONS[level];

/** Das Zeichen eines Links nach seiner Zielart. */
export function targetIcon(info: LinkTargetInfo): IconComponent {
  switch (info.kind) {
    case "page-widget":
      return PanelTop;
    case "block":
      return Hash;
    case "address":
      return Link2;
    default:
      return headingIcon(info.level);
  }
}

/** Das Zeichen eines Elements der Seite. */
export function outlineIcon(entry: OutlineEntry): IconComponent {
  return entry.kind === "widget" ? PanelTop : headingIcon(entry.level);
}
