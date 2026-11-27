# FAQ

## The widget isn't displaying anything.

There are no entries with link text yet. Open the dialog in Studio, create entries in the
**Edit Links** window, apply the changes, and save. An
empty widget doesn't display anything—not even an empty box or a title.

## An entry is missing from the list.

It is missing the link text. A link without link text can no longer be
applied: the window displays the message “Link 2: Link text missing” and highlights it in the
list. Older blocks may still contain such entries; they appear in the window
as “No link text” in the list.

## Does opening the window change an older block?

No. Older blocks still contain titles and links in the `heading` and
`links`. The window imports them upon opening; as long as you don’t change anything,
nothing is imported, and the block remains as it is. Only
**Apply** writes titles and links to the new `anchor-nav-config` field—with
the same result on the page.

## A click doesn’t work.

There is no heading on the page with exactly this text. The system compares
it to the target, or—if the target is empty—to the link text. A typo,
a difference in capitalization, or a heading that has since been renamed
heading are enough. Copy the text from the heading and paste it into the target
field.

Headings in an anchor navigation never count as targets—not even the
title of a second widget on the same page.

## A link is missing from the page.

Its target no longer exists on the page: the heading or widget
has been deleted, or—for in-text links—the heading has a different name.
In the **Edit Links** window, the link is marked with a “!”. Select a new target
or remove the link.

## Links are missing on translated pages.

The page’s headings are translated, but the link text and destination are not. A
text-based link can no longer find its corresponding heading in the other language
and is hidden there. Links to a block ID (from the
site map) are not tied to the heading text.

## When does the red marker move?

When scrolling: It stays on the section whose heading most recently reached the top
quarter of the screen. At the very bottom of the page, where the last
sections no longer scroll up that far, it stays with the last visible section.
After a click, it stays with the selected entry until you scroll again.
Before the first section, it stays with the first entry. If someone opens the
page via a link with an anchor, such as `…#equipment`, it is positioned at
that entry.

Entries with a URL (`/…`, `https://…`) do not correspond to a section on the
page; the marker does not move to them when scrolling.

## Can the order be changed?

Yes. Drag the handle on the left in the window, or select the handle, press Enter
to pick it up, use the arrow keys to move it, and press Enter to drop it. Or use the
**Link Up** / **Link Down** arrows above the form. The list does
not have to follow the order on the page.

## Two headings have the same name—where does the link go?

To the first one on the page. If you want it to go to the second one, the only solution is to
name the headings differently.

## Can an entry link to another page?

Yes. Enter a URL as the destination that begins with `/`, `http://`, or `https://`.
Clicking it will take you there just like any other link.
