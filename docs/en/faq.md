# FAQ

## The widget isn't displaying anything.

If the widget's settings dialog has never been opened
and saved since the widget was inserted, it doesn't recognize the page's headings. In Studio,
open the dialog, check the number of headings that have been imported, and save.

If it says “0 headings,” Studio can’t find any—in which case
saving won’t help. Otherwise: The page has no headings at the specified level. Select a different level
or set a heading in the text. An empty widget displays nothing—
not even an empty box or a title.

## It shows too few headings.

Headings with empty text are ignored. And headings within the
widget itself do not count, otherwise it would reference itself.

If entries are still missing, “Only Headings from Title and
Text Blocks” is enabled, and the missing heading is in a different
block. Turning off this toggle will include it.

## It shows headings that aren’t sections at all.

Other widgets have their own headings—the titles of a news list,
for example. If these appear in the list, “Only Headings from Title and
Text Blocks” is turned off. Turning it on limits the list to the
sections you’ve written yourself.

If they remain there even after that, the page is not in the Content Designer. There,
the building blocks that the toggle uses to distinguish between sections do not exist, and the toggle
does not work.

## It displays its own title as an entry.

This shouldn’t happen. If it does occur, the heading is outside
the widget container—for example, as a separate text block above it. In that case, either use the
widget’s title or select a layer that the text block doesn’t have.

## The red marker does not move along with the page.

It follows the scrolling and remains with the heading that most recently reached the top
quarter of the window. At the very top of the page, it is positioned next to the title
— or, if no title has been entered, next to the first entry. If you’ve set “Reduce
motion,” you’ll see it jump instead of glide—this is by design.

## A new or renamed heading is missing.

The list is based on the last time the widget dialog was saved. Open the dialog and
save to apply the change.

## Can the order be changed?

No. The list follows the order in the text. If you want to change the order of the links,
change the order of the sections.

## Two headings have the same name—does the link jump to the correct one?

Yes. The links remember the heading itself, not its name.
