# FAQ

## The widget isn't displaying anything.

There are no entries with link text yet. Open the dialog in Studio, use
**Edit Links** to create entries, apply the changes, and save. An empty
widget won't display anything—not even an empty box or a title.

## An entry is missing from the list.

It’s missing the link text. In the Editor, the line “Without link text,
this entry will not be displayed” appears.

## Clicking doesn’t take me anywhere.

A heading with exactly that text does not exist on the page. The system compares
it to the target, or—if the target is empty—to the link text. A typo,
a difference in capitalization, or a heading that has since been renamed
is enough. Copy the text from the heading and paste it into the target
field.

Headings in anchor navigation never count as targets—not even the
title of a second widget on the same page.

## A click doesn’t work on translated pages.

The page’s headings are translated, but the link text and destination are not. In the
other language, the entry can no longer find its heading, and the
list continues to display the link texts in the language in which they were maintained.

## The red marker does not follow scrolling.

This is intentional. It remains on the entry that was last clicked. Before the
first click, it is on the title—or, if no title has been entered, on the
first entry. If someone opens the page via a link with a jump marker,
such as `…#equipment`, it remains on that entry.

## Can the order be changed?

Yes. In the editor, drag the handle on the left, or select the handle, press Enter
to select it, use the arrow keys to move it, and press Enter to drop it. The list does not have to follow the order of the page.

## Two headings have the same name—where does the link go?

To the first one on the page. If you want it to go to the second one, the only solution is to
name the headings differently.

## Can an entry link to another page?

Yes. Enter a URL as the destination that begins with `/`, `http://`, or `https://`.
Clicking it will take you there just like any other link.
