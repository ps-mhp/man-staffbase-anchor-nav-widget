# Settings

Everything is managed in the **Edit Links** window. It opens automatically in Studio
as soon as you open the block's settings dialog; to close it,
click the **Edit Links** button. At the top are **Apply**,
**Cancel**, Undo/Redo, Help, and the **Editor ·
Desktop · Tablet · Mobile** toggle. **Apply** writes the title and links to the
dialog; then save as usual.

The window has three columns: on the left, the **Links**; in the middle, the selected
link—or, after clicking **New Link**, the **Site Map**; and on the right, the **Navigation**
with settings that apply to the entire navigation: titles and navigation at
the edge of the screen.

The page elements are pulled live from the editor—including headings that
haven’t been saved yet—and update with every change.

## Title

On the right under **Navigation**: the heading above the list, for example, “On
this page.” Leaving it blank hides it; the list remains.

The title is translated along with the page.

## Navigation at the Edge of the Screen

On the right under **Navigation**, enabled by default. On desktop and tablet,
when you first scroll, a small navigation bar appears on the right edge of the screen: one
line per section, with the current one in red. When you hover over a line,
the link text appears to the left of it; a click takes you there, and the arrows above and
below jump to the previous or next section, respectively. On a phone, in
the Studio, and in the window preview, it does not appear. If there are multiple
anchor navigation bars on a page, only the first one displays it.

## Links

The left column shows all links in the order of the navigation. Each row
lists the link text and, below it, where it leads—for example, “Heading
‘Dates’,” “Widget: File Gallery,” “#contact,” or “Empty—heading of the same name
.” Clicking selects a link for editing.

- **New Link** opens the **Site Map** in the center (see below). Without
  any links, the window opens directly to it.
- A **“!”** at the end of the line means: the destination no longer exists
  on the page (heading deleted or renamed). On the page, the link is
  hidden until you select a new destination or remove it—the form
  offers a **Remove Link** option for this.
- You can change the order using the handle on the left: drag it, or select the handle,
  press Enter to grab it, use the arrow keys to move it to the new position, and press
  Enter to drop it. Or use the **Move Link Up** / **Move Link Down** arrows
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
    block on the page. This is how the site map sets it. The link
    remains valid even after the heading is renamed.
  - **An address** that begins with `/`, `http://`, `https://`, or `mailto:`
    : a standard link that the browser follows.

When comparing to the heading, the text matters, not the level—H1 through H6
are all valid targets. Multiple spaces do not matter,
but case sensitivity does. If there are multiple headings with the same text,
the entry jumps to the first one.

### Site Map

The site map displays the page’s headings and widgets as boxes—
arranged as in the draft: sections one below the other, columns side by side in
their respective widths. Each box lists the type (such as “H2” or “Widget · USP Box”)
and the text or widget. Linked boxes are blue.

- **Clicking on a box** creates a link using its text (the target is the
  block ID `#…`) and opens the link text in the box for editing; press Enter
  to confirm. Clicking on a box that already has a link opens its
  link text.
- The icon in the upper-right corner of the blue box removes the link.
- Boxes can also be dragged into the list on the left—the link will appear where
  you drop it.
- **Empty Link** creates a link for an address or a custom destination;
  **Done** returns to the selected link.

## When the page changes

Even when the window is closed, the widget in Studio keeps track of its targets:

- **Linked heading deleted:** It asks whether the link should also be removed from the
  navigation. If you keep it, it displays a
  “!” in the window and is missing from the page.
- **Linked heading renamed:** As soon as the cursor leaves the heading,
  it asks if the link should be updated. The new link text
  is pre-filled with the heading’s text and can be edited directly.

Your response changes the block just like any other edit: You can undo it, and the change
takes effect when you save the page.

## Preview

**Desktop**, **Tablet**, and **Mobile** display the
navigation bar at full device width instead of the form, just as the page shows it; links without link text
or without a destination on the page are missing there, just as they are on the page. On **Mobile**, it is collapsed into a single button;
the list and title remain usable next to it. In the preview,
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
