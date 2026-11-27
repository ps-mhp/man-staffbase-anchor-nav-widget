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
 * Die Rückfrage des Wächters (`outline-watch.ts`) als kleiner Dialog über
 * dem Studio, im eigenen Shadow Root wie das Fenster „Links bearbeiten“.
 *
 * Nachgeladen erst, wenn wirklich gefragt wird: Radix und das CSS von
 * `@man/config-ui` gehören nicht in jedes Laden des Studios.
 */

import * as React from "react";
import { createRoot } from "react-dom/client";
import { Field } from "@man/config-ui/form/field";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@man/config-ui/primitives/alert-dialog";
import { Input } from "@man/config-ui/primitives/input";
import { UiRoot } from "@man/config-ui/primitives/ui-root";
import { SHIELDED_EVENTS } from "@shared/ui/config-modal";

import { ChangeDecision, OutlineChange } from "./outline-changes";
import { ChangePrompt } from "./outline-watch";

/** „die Überschrift „Termine““ oder „das Widget „Dateigalerie““. */
function elementText(change: OutlineChange): string {
  const { before } = change;
  return before.kind === "heading" ? `die Überschrift „${before.label}“` : `das Widget „${before.label}“`;
}

function linksText(prompt: ChangePrompt): string {
  const names = prompt.links.map((link) => `„${link.label}“`).join(", ");
  const where = prompt.navigations > 1 ? ` in ${prompt.navigations} Ankernavigationen` : " in der Ankernavigation";
  return prompt.links.length === 1 ? `Der Link ${names}${where} zeigt darauf.` : `Die Links ${names}${where} zeigen darauf.`;
}

export interface ChangeDialogProps {
  prompt: ChangePrompt;
  onDecide: (decision: ChangeDecision) => void;
}

/** Der Dialog selbst; offengelegt für Tests. */
export function ChangeDialog({ prompt, onDecide }: ChangeDialogProps): React.ReactElement {
  const { change } = prompt;
  const [label, setLabel] = React.useState(change.kind === "renamed" ? change.after.label : "");
  const removed = change.kind === "removed";
  return (
    <AlertDialog open onOpenChange={(open) => !open && onDecide({ action: "keep" })}>
      <AlertDialogContent data-testid="outline-change-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {removed ? "Verlinktes Element gelöscht" : "Verlinkte Überschrift geändert"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {removed
              ? `Du hast ${elementText(change)} gelöscht. ${linksText(prompt)} Soll der Link auch aus der Navigation entfernt werden? Sonst wird er dort ausgeblendet, bis du ein neues Ziel wählst.`
              : `Die Überschrift „${change.before.label}“ heißt jetzt „${change.after.label}“. ${linksText(prompt)} Soll der Link aktualisiert werden?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!removed && (
          <Field label="Neuer Linktext" hint="Vorbelegt mit dem Text der Überschrift.">
            <Input
              className="h-10"
              value={label}
              autoFocus
              data-testid="outline-change-label"
              onChange={(event) => setLabel(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onDecide({ action: "update", label });
              }}
            />
          </Field>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onDecide({ action: "keep" })} data-testid="outline-change-keep">
            {removed ? "Link behalten" : "Nicht ändern"}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={removed ? "destructive" : "default"}
            onClick={() => onDecide(removed ? { action: "remove" } : { action: "update", label })}
            data-testid="outline-change-apply"
          >
            {removed ? "Link entfernen" : "Link aktualisieren"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function stopAtHost(event: Event): void {
  event.stopPropagation();
}

/** Stellt die Frage und räumt danach wieder ab. */
export function askChange(prompt: ChangePrompt): Promise<ChangeDecision> {
  return new Promise((resolve) => {
    const host = document.createElement("div");
    host.setAttribute("data-man-anchor-nav-prompt", "");
    const container = document.createElement("div");
    host.attachShadow({ mode: "open" }).appendChild(container);
    // Tasten und Klicks im Dialog gehören nicht dem Editor darunter.
    SHIELDED_EVENTS.forEach((name) => host.addEventListener(name, stopAtHost));
    document.body.appendChild(host);
    const root = createRoot(container);
    let done = false;
    const decide = (decision: ChangeDecision): void => {
      if (done) return;
      done = true;
      // Erst nach dem Schließen abbauen: Radix gibt den Fokus noch zurück.
      setTimeout(() => {
        root.unmount();
        host.remove();
      }, 0);
      resolve(decision);
    };
    root.render(
      <UiRoot className="contents">
        <ChangeDialog prompt={prompt} onDecide={decide} />
      </UiRoot>,
    );
  });
}
