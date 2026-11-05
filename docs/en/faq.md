# FAQ

## The widget isn't displaying anything.

There are no entries with link text yet. Open the dialog in Studio, create entries via
**Edit Links**, apply the changes, and save. An empty
widget doesn't display anything—not even an empty box or a title.

## An entry is missing from the list.

It is missing the link text. In the Editor, the line “Without link text,
this entry will not be displayed” will appear.

## Clicking does not take you anywhere.

There is no heading on the page with exactly that text. The system compares
the text to the target, or—if the target is empty—to the link text. A typo,
a difference in capitalization, or a heading that has since been renamed
is enough to cause this. Copy the text from the heading and paste it into the target
field.

Headings in anchor navigation never count as targets—not even the
title of a second widget on the same page.

## A click doesn’t work on translated pages.

The page’s headings are translated, but the link text and target are not. In the
other language, the entry can no longer find its heading, and the
list continues to display the link texts in the language in which they were maintained.

## The red marker does not follow the scroll.

This is intentional. It remains at the entry that was last clicked. Before the
first click, it is positioned at the title—or, if no title has been entered, at the
first entry. If someone opens the page via a link with a jump marker,
such as `…#equipment`, it is positioned at that entry.

## Can the order be changed?

Yes. In the editor, drag the handle on the left, or select the handle, press
Enter to pick it up, use the arrow keys to bring it to the new position, and
press Enter to drop it. The list does not have to follow the order of the page.

## Two headings have the same name—where does the link jump to?

To the first one on the page. If you want it to jump to the second one, the only solution is to
give the headings different names.

## Can an entry link to another page?

Yes. Enter a URL as the destination that begins with `/`, `http://`, or `https://`.
Clicking it works just like any other link.
