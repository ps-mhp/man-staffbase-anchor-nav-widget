# Settings

## Title

The heading above the list, for example, "At a Glance." Leaving it blank
hides the heading; the list remains.

The title is translated along with the page.

## Links

The list entries. In Studio, there is an editor here with one
row per link. Click **Edit Links** to open it; click **Add Link**
to add a row; the trash can icon removes it. You can
change the order using the handle on the left: drag it, or select the handle and use
the up and down arrow keys to move it. **Apply** writes the
list to the dialog; then save as usual.

Each line has two fields:

- **Link Text** — what appears in the list. Required: an entry without link text
  will not be displayed.
- **Target** — where the entry links to.
  - **Blank:** to the heading on the page with the same name as the link text.
  - **Text of a heading:** to that heading. This allows the entry to be shorter
    than the section title, such as “Features” for “Features in Detail.”
  - **An address** that begins with `#`, `/`, `http://`, `https://`, or `mailto:`
    is a standard link that the browser follows.

When comparing to the heading, the text matters, not the level—H1 through H6
are all valid targets. Multiple spaces do not matter,
but case sensitivity does. If there are multiple headings with the same text,
the entry jumps to the first one.

If the editor does not appear, a text field will be displayed there containing the list as
JSON, for example:

```json
[{ "label": "Features", "target": "Features in Detail" }]
```

`label` is the link text, `target` is the destination (optional).
