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

import * as React from "react";

import { startFieldModalInjector } from "@shared/config-modal";
import { AnchorLink, parseAnchorLinks, serializeAnchorLinks } from "./anchor-links";
import { LINKS_ATTRIBUTE } from "./configuration-schema";
import { loadStudioOutline } from "./page-outline";

// Erst im Studio nachgeladen: React Aria gehört nicht ins Bündel, das jede
// veröffentlichte Seite lädt.
const LazyLinkEditor = React.lazy(() => import("./link-editor").then((module) => ({ default: module.LinkEditor })));

/** Läuft die Seite im Studio — und nicht als veröffentlichte Seite? */
export function isStudioPage(location: Location = window.location): boolean {
  return location.pathname.startsWith("/studio/");
}

/**
 * Wartet auf den Konfigurationsdialog des Widgets und setzt den Link-Editor
 * an die Stelle seines `links`-Feldes — wie der Kachel-Editor des Portfolios.
 *
 * @param root der zu beobachtende Teilbaum; standardmäßig das Dokument.
 * @returns eine Funktion, die die Beobachtung beendet und den Editor abbaut.
 */
export function startLinkEditorInjector(root: ParentNode = document): () => void {
  return startFieldModalInjector<AnchorLink[]>({
    fieldKey: LINKS_ATTRIBUTE,
    root,
    reopenLabel: "Links bearbeiten",
    modalTestId: "link-editor-modal",
    reopenTestId: "link-editor-reopen",
    // Ein frisch hinzugefügter Eintrag hat noch keinen Linktext; durch den
    // strengen Parser verschwände er beim nächsten Öffnen des Dialogs.
    parse: (raw) => parseAnchorLinks(raw, { keepUnlabelled: true }),
    serialize: serializeAnchorLinks,
    // Der Editor zeichnet seinen eigenen Rahmen.
    panelClassName: "p-0 overflow-hidden",
    render: ({ value, onChange, onSave, onClose, dirty }) =>
      React.createElement(
        React.Suspense,
        { fallback: React.createElement("p", { className: "p-4" }, "Editor wird geladen …") },
        React.createElement(LazyLinkEditor, { value, onChange, onSave, onClose, dirty, loadOutline: loadStudioOutline }),
      ),
  });
}
