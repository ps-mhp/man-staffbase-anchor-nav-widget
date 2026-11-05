# Settings

## Title

The heading above the list, for example, “At a Glance.” Leaving it blank
hides the heading; the list remains.

The title is translated along with the page.

## Links

The list entries. In Studio, there is an editor that opens via **Edit Links**.
The links are on the left, and the fields for the selected entry are on the
right; click a link in the list to select another. **Add Link** creates and
selects a new one, and the trash can removes it. You change the order using
the handle on the left: drag it, or select the handle, press Enter to pick it
up, use the arrow keys to bring it to the new position, and press Enter to
drop it. **Apply** writes the list to the dialog; then save as usual.

The fastest way is to use **Add Page Element** at the top of the editor:
The selection shows the headings and widgets of the saved page
(▣ = widget) and can be filtered by typing. One click creates a link with its
name; the destination is the
block ID (`#…`). You can change the link text afterward. New sections
will only appear in the selection once the page has been saved.

Each link has two fields:

- **Link Text** — what appears in the list. Required: an entry without link text
  will not be displayed.
- **Target** — where the entry jumps to.
  - **Blank:** to the heading on the page with the same name as the link text.
  - **Text of a heading:** to that heading. This allows the entry to be shorter
    than the section title, such as “Features” for “Features in Detail.”
  - **A block ID** such as `#a447d858-1bba-4a49-b620-b49c60dd67a7`: to this
    block on the page. This sets the selection at the top. The link remains valid even after
    the heading is renamed.
  - **An address** that begins with `/`, `http://`, `https://`, or `mailto:`
    : a standard link that the browser follows.

When comparing to the heading, the text matters, not the level—H1 through H6
are all valid targets. Multiple spaces don’t matter,
but uppercase and lowercase letters do. If there are multiple headings with the same text,
the entry jumps to the first one.

If the editor does not appear, a text field will be displayed there containing the list as
JSON, for example:

```json
[{ "label": "Features", "target": "Features in Detail" }]
```

`label` is the link text, `target` is the destination (optional).
