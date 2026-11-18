# FAQ

## The widget isn't displaying anything.

There are no entries with link text yet. Open the dialog in Studio, create entries in the
**Edit Links** window, apply the changes, and save. An
empty widget doesn't display anything—not even an empty box or a title.

## An entry is missing from the list.

It is missing the link text. A link without link text can no longer be
applied: the window displays the message “Link 2: Link text missing” and highlights it in the
list. Older blocks may still contain such entries; they appear in the window
in the list as “No link text.”

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

## A click doesn’t work on translated pages.

The page’s headings are translated, but the link text and destination are not. In the
other language, the entry can no longer find its heading, and the
list continues to display the link texts in the language in which they were maintained.

## When does the red marker change?

When scrolling: It is positioned at the section whose heading most recently reached the top
quarter of the screen. At the very bottom of the page, where the last
sections no longer scroll that far up, it is positioned at the last visible section.
After a click, it remains at the selected entry until you scroll again.
Before the first section, it is positioned on the first entry. If someone opens the
page via a link with an anchor, such as `…#equipment`, it is positioned on
that entry.

Entries with a URL (`/…`, `https://…`) do not have a section on the
page; the bookmark does not reach them when scrolling.

## Can the order be changed?

Yes. Drag the handle in the window on the left, or select the handle, press Enter
to pick it up, use the arrow keys to move it, and press Enter to drop it. Or use the
**Link Up** / **Link Down** arrows above the form. The list does
not have to follow the order on the page.

## Two headings have the same name—where does the link go?

To the first one on the page. If you want it to go to the second one, the only solution is to
give the headings different names.

## Can an entry link to another page?

Yes. Enter an address as the destination that begins with `/`, `http://`, or `https://`.
Clicking it works just like any other link.
