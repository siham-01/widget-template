# Style Guide

Styles common to all widget pages and widgets are defined in `assets/src/css/widget-page.css`.

## Buttons

Use the `button-semantic` class along with...

* `button-primary`, for a button that indicates a primary action
* `button-secondary`, for a button that indicates a secondary action
* `button-tertiary`, for a button that indicates a tertiary action

## Colors

Pull colors from the color scales defined in the `widget-page.css` `:root`. For example:

```css
.container {
    border: 0.2em solid var(--neutral-100);
}
```
