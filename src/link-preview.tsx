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
 * Die Vorschau des Entwurfs in Desktop, Tablet und Mobil: die echte
 * Navigation (`AnchorNav`), nicht eine Nachbildung – Titel, Linie, Marke und
 * auf dem Telefon der zugeklappte Knopf sehen aus wie auf der Seite.
 *
 * Ohne Seiteneffekte: `preview` schaltet Sprung zum Hash und Scroll-Spy ab,
 * und die Bühne ist `inert` – kein Klick, kein Tab durch Links, die hier
 * nirgendwohin führen. Die schmale Fassung kommt aus dem Gerät (Mobil), nicht
 * aus der Breite des Studio-Fensters.
 *
 * Gezeigt wird, was die Seite zeigen würde: dieselbe Lesung wie dort, Links
 * ohne Linktext fallen also weg.
 */

import * as React from "react";
import { ReactElement, useMemo } from "react";
import { useConfigShell } from "@man/config-ui/shell/shell-context";

import { parseAnchorLinks, toStoredLinks } from "./anchor-links";
import { AnchorNavConfig } from "./anchor-nav-config";
import { AnchorNav } from "./anchor-nav";
import { readHeading } from "./heading-text";

export function LinkPreview({ config }: { config: AnchorNavConfig }): ReactElement {
  const { view } = useConfigShell();
  const links = useMemo(() => parseAnchorLinks(toStoredLinks(config.links ?? [])), [config.links]);
  return (
    <div inert className="p-8" data-testid="link-preview">
      {links.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Noch kein Link mit Linktext – die Navigation erscheint, sobald einer da ist.
        </p>
      ) : (
        <AnchorNav
          links={links}
          heading={readHeading(config.heading)}
          self={null}
          preview={{ compact: view === "mobile" }}
        />
      )}
    </div>
  );
}
