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
