# Settings

Everything is managed in the **Edit Links** window. It opens automatically in Studio
as soon as you open the block's settings dialog; to close it,
click the **Edit Links** button. At the top are **Apply**,
**Cancel**, Undo/Redo, Help, and the **Editor ·
Desktop · Tablet · Mobile** toggle. **Apply** writes the title and links to the
dialog; then save as usual.

The window has three columns: on the left, the **Links**; in the middle, the selected
link; and on the right, the **Navigation** with the title and the **Page Layout**.

The page elements are pulled live from the editor—including headings that
haven’t been saved yet—and update with every change.

## Title

At the top right under **Navigation**: the heading above the list, for example, “On
this page.” Leaving it blank hides it; the list remains.

The title is translated along with the page.

## Links

The left column shows all links in the order they appear in the navigation. Each row
lists the link text and, below it, where it leads—for example, “Heading
‘Dates’”, “Widget: File Gallery”, “#contact”, or “Empty – heading of the same
name”. Clicking selects a link for editing.

- **New Link** opens a drop-down menu: at the top, **Empty Link** (creates an
  empty link and places the cursor in the link text); below that, a search
  function for the page’s headings and widgets (see below).
- A **“!”** at the end of the line means: the destination no longer exists
  on the page (heading deleted or renamed). On the page, the link
  is hidden until you select a new destination or remove it—the form
  offers **Remove Link** for this purpose.
- You can change the order using the handle on the left: drag it, or select the handle,
  press Enter to pick it up, use the arrow keys to move it to the new position, and press
  Enter to drop it. Or use the **Move Link Up** / **Move Link Down**
  above the form.
- **Duplicate Link** and **Delete Link** are also available there.

### Link Text and Destination

In the middle, above the form, it says “Link 2 of 5” and the type of destination
(“Jump to a location on this page” or “Link to an address”) is displayed.

- **Link text** – what appears in the list. Required: without link text, the
  window cannot be saved; the status bar at the top will then display the affected link.
- **Destination** – where the entry jumps to.
  - **Blank:** to the heading on the page that has the same name as the
    link text. The field displays it as a placeholder.
  - **Text of a heading:** to that heading. This allows the entry
    to be shorter than the section title, such as “Features” for “Features in
    Detail.”
  - **A block ID** such as `#a447d858-1bba-4a49-b620-b49c60dd67a7`: to this
    block on the page. This is determined by the selection and the page layout. The link
    remains valid even after the heading is renamed.
  - **An address** that begins with `/`, `http://`, `https://`, or `mailto:`
    : a standard link that the browser follows.

When comparing to the heading, the text matters, not the level—H1 through H6
are all valid targets. Multiple spaces don’t matter,
but uppercase and lowercase letters do. If there are multiple headings with the same text,
the entry jumps to the first one.

### Link to a Page Heading or Widget

Two methods; both create a link using the element’s name, with the target being
its block ID (`#…`); you can change the link text afterward:

- **New Link** → **Search for Heading or Widget**: The list shows the
  headings (with level, such as “H3 under ‘Events’”) and the widgets on the
  page by name and attribute (e.g., “Main Competitors · USP Box”) and
  can be filtered by typing—including by widget type.
- **Page Structure** on the right: the page’s outline as an indented tree.
  Drag an element into the list on the left—it lands where you drop it—
  or click it, and it goes to the end.

Items that are already linked have a checkmark or the label “already linked”; a second
attempt selects the existing link instead of duplicating it.

## When the page changes

Even when the window is closed, the widget in Studio keeps track of its targets:

- **Linked heading deleted:** It asks whether the link should also be
  navigation. If you keep it, it displays a
  “!” in the window and is missing from the page.
- **Linked heading renamed:** As soon as the cursor leaves the heading,
  it asks if the link should be updated. The new link text
  is pre-filled with the heading’s text and can be edited directly.

Your response updates the block just like any other edit: You can undo it, and the change
takes effect when you save the page.

## Preview

**Desktop**, **Tablet**, and **Mobile** display the
navigation bar at full screen width instead of the form, just as the page shows it; links without link text
or without a destination on the page are missing there, just as they are on the page. On **mobile**, it is collapsed into a single button.
The list and title remain usable next to it. In the preview,
nothing jumps, and the Studio page remains unaffected.

## Saved Form

Titles and links are grouped together in the `anchor-nav-config` attribute. Older
blocks still contain them in the `heading` and `links` fields; the page reads
the new field if specified, and the old one otherwise, so they appear unchanged.
When the window is first opened, it uses the old values; only **Apply**
writes them to the new field. The old fields are hidden in the dialog.

If the window does not appear, a text field containing the raw version appears there,
for example:

```json
{ "heading": "At a Glance", "links": [{ "id": "a", "label": "Features", "target": "Features in Detail" }] }
```

`label` is the link text, `target` is the destination (optional).
