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

import { setPublicPathFromBundle } from "@shared/public-path";
// Muss vor jedem dynamischen `import()` laufen, damit nachgeladene Teile von
// dem CDN kommen, von dem das Bundle stammt, und nicht von der Wirtsseite.
setPublicPathFromBundle("anchor-nav-widget.js");

import React from "react";
import ReactDOM from "react-dom/client";

import { BlockFactory, BlockDefinition, ExternalBlockDefinition, BaseBlock } from "widget-sdk";
import { startWidget } from "@shared/dev-mode/start-widget";
import { getTranslationRegistry } from "@shared/translation/registry";
import {
  BLOCKS_ATTRIBUTE,
  HEADING_ATTRIBUTE,
  LEVEL_ATTRIBUTE,
  configurationSchema,
  readBlocksOnly,
  readLevel,
  uiSchema,
} from "./configuration-schema";
import { ANCHOR_NAV_WIDGET_TAG, anchorNavTranslationProvider, readHeading } from "./translation-provider";
import { AnchorNavWidget } from "./widget-root";
import icon from "../resources/anchor-nav-widget.svg";
import pkg from "../package.json";

/** Die Attribute des Widgets; gespiegelt im Konfigurationsschema. */
const widgetAttributes: string[] = [LEVEL_ATTRIBUTE, HEADING_ATTRIBUTE, BLOCKS_ATTRIBUTE];

const factory: BlockFactory = (BaseBlockClass, _widgetApi) => {
  /**
   * <anchor-nav-widget level="h2" heading="Auf einen Blick" blocks="true"></anchor-nav-widget>
   */
  return class AnchorNavWidgetBlock extends BaseBlockClass implements BaseBlock {
    private _root: ReactDOM.Root | null = null;

    public renderBlock(container: HTMLElement): void {
      const attrs = this.parseAttributes<Record<string, unknown>>();

      this._root ??= ReactDOM.createRoot(container);
      this._root.render(
        <AnchorNavWidget
          level={readLevel(attrs[LEVEL_ATTRIBUTE])}
          heading={readHeading(attrs[HEADING_ATTRIBUTE])}
          self={container}
          blocksOnly={readBlocksOnly(attrs[BLOCKS_ATTRIBUTE])}
        />,
      );
    }

    public unmountBlock(_container: HTMLElement): void {
      this._root?.unmount();
      this._root = null;
    }

    public static get observedAttributes(): string[] {
      return widgetAttributes;
    }

    public attributeChangedCallback(...args: [string, string | undefined, string | undefined]): void {
      super.attributeChangedCallback.apply(this, args);
    }
  };
};

export const blockDefinition: BlockDefinition = {
  name: ANCHOR_NAV_WIDGET_TAG,
  factory: factory,
  attributes: widgetAttributes,
  blockLevel: "block",
  configurationSchema: configurationSchema,
  uiSchema: uiSchema,
  label: "Ankernavigation",
  iconUrl: icon,
};

const externalBlockDefinition: ExternalBlockDefinition = {
  blockDefinition,
  author: pkg.author,
  version: pkg.version,
};

/**
 * Meldet den Baustein bei der Wirtsseite an — über `startWidget`, das zuerst
 * fragt, ob ein lokaler Entwicklungsserver dieses Widget ausliefert. Die
 * Übersetzung hängt am Anmelden und nicht am Laden: sonst belegte das
 * installierte Bundle den Träger, bevor feststeht, welches Bundle gilt.
 *
 * Die Abfrage davor lässt das Modul in Jest laden, wo es keine Wirtsseite
 * gibt: ohne sie bräche schon der bloße Import der Datei jeden Test.
 */
if (typeof window.defineBlock === "function") {
  void startWidget({
    name: ANCHOR_NAV_WIDGET_TAG,
    version: pkg.version,
    register: () => {
      getTranslationRegistry().register(anchorNavTranslationProvider);
      window.defineBlock(externalBlockDefinition);
    },
  });
}
