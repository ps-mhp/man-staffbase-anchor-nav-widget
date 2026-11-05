# Settings

## Import Headings

The widget does not read the headings from the published page, but rather
while editing in Studio: As soon as the widget's settings dialog opens,
it imports the page's headings. At the bottom of the dialog, it shows how many
have been imported, for example, “22 page headings imported (H1: 12 · H2: 10).”

Then save. Only then will the published page recognize the list.

If the page’s headings change, reopen the dialog and save—
otherwise, the widget will display the old version. Headings that no longer exist
are automatically removed.

## Heading Level

Which level the list displays: **H1** through **H6**. The default is **H2**.

It is exactly one level, not “starting from this level.” If you select H2, you’ll get the H2
headings on the page—the H3 headings below them are excluded.

If the widget doesn’t display anything, the page isn’t using that level. In that case, check the text
to see which level the sections actually have.

## Title

The heading above the list, for example, “At a Glance.” Leaving it blank
hides it; the list remains.

The title is translated along with the page. The list entries do not need to be
translated—they are the page’s headings and carry their translations
anyway.

## Only Headings from Title and Text Blocks

Enabled by default. In this case, the list counts only headings that appear in a
**Title** or **Text** block—that is, the sections you’ve
written yourself.

When disabled, every heading of that level on the page is counted. This
also includes those displayed by other widgets in their own layout: the
titles of a news list, for example, or the labels in a portfolio.
These are not sections of the page, and a link to them jumps to a
location the reader doesn’t expect.

The toggle doesn’t work on pages without the Content Designer. On those pages, the
building blocks it uses to distinguish between headings aren’t present, and the list continues to show
all headings of that level as before—an empty widget wouldn’t make sense there.
