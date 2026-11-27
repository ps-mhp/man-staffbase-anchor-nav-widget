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
 * Die Block-ID ohne Stufen-Präfix.
 *
 * Die Typoskala des Content Designers (`content-designer-extensions`,
 * `id-codec.ts`) schreibt die gewählte Stufe in die ID:
 * `sbt-display-2xl--7bca7d25-…`. Wechselt der Redakteur die Stufe, wechselt
 * die ID, der Block bleibt derselbe. Verglichen wird deshalb immer über den
 * Teil hinter `--`; Links speichern nur ihn.
 */

const TOKEN_ID = /^sbt-[a-z0-9-]+?--(.+)$/;

export function baseBlockId(id: string): string {
  return TOKEN_ID.exec(id)?.[1] ?? id;
}

/** Ob zwei Block-IDs denselben Block meinen. */
export const sameBlock = (a: string, b: string): boolean => baseBlockId(a) === baseBlockId(b);

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Ob die ID wie eine Block-ID des Content Designers aussieht – nicht wie ein eigener Anker. */
export const isBlockUuid = (id: string): boolean => UUID.test(baseBlockId(id));
