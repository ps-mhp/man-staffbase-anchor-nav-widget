# Anchor Navigation

The widget displays a list of links that you maintain yourself. Clicking
a link takes you to the corresponding heading on the page; a red marker indicates which
entry was clicked most recently.

The list doesn't generate automatically. In the settings dialog, you specify which
entries are included, what they’re called, and the order in which they appear. The
widget only scans the page when someone clicks an entry—it doesn’t
do anything in the background while the page is loading.

## What it’s for

Long pages with a clear structure—a vehicle model with its trim levels,
a guideline with its sections. It’s not worth it on short pages.

## What it doesn’t do

- **Doesn’t find headings on its own.** Each entry is created manually.
  If a section is added to the page, it is also included in the list.
- **Does not follow scrolling.** The marker does not follow the scroll, but remains on the
  last clicked entry.
- **Does not nest.** The list is flat, not a tree.
