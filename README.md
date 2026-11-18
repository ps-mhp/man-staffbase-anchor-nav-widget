# anchor-nav-widget

Staffbase-Custom-Widget. Entwickelt, gebaut und released wird es aus dem
Meta-Repo [`ps-mhp/man-staffbase-cms-extensions`](https://github.com/ps-mhp/man-staffbase-cms-extensions);
dieses Repo enthält nur Quellcode und das ausgelieferte Bundle unter `dist/`.

```bash
scripts/sync.sh anchor-nav-widget
npm run build -- --env widget=anchor-nav-widget
npm test -- src/widgets/anchor-nav-widget
scripts/release.sh anchor-nav-widget
```

## Konfiguration

Im Studio öffnet der Einstellungsdialog das Vollbild-Fenster „Links
bearbeiten“ aus `@man/config-ui` (`src/link-editor-injector.tsx`, nachgeladen
aus `src/link-editor.tsx`). Titel und Links stehen gemeinsam im Attribut
`anchor-nav-config`; die Felder älterer Fassungen, `heading` und `links`,
bleiben im Schema, werden im eigenen Dialog ausgeblendet und gelten auf der
Seite je Angabe weiter, solange `anchor-nav-config` sie nicht trägt
(`src/anchor-nav-config.ts`). Nutzerdoku: `docs/settings.md`.
