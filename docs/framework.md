# Framework

Your webpage will be a [**Widget Page**](#widget-page) that embeds one or more [**Widgets**](#widget). 

Use your **Widget Page** to write supporting text, but implement any core interactions as **Widgets** embedded on your **Widget Page**.

## Widget Page

A **Widget Page** is an interactive page for displaying content—such as text and images—in small sections that are revealed one at a time. A **Widget Page** can embed one or more [**Widgets**](#widget) as part of its content.

### Widget Page Elements

#### Column

All **Widget Page** content is organized into a single **column**, which is centered on the page.

To create a **column**, apply the `column` class and a column width class (e.g., `column-md`). The column width class determines the maximum width of the **column**, and allows a **column**’s width to shrink and expand responsively.

```html
<body>
  <div class="column column-md">
    <!-- Column content -->
  </div>
</body>
```

##### Column Widths

- `column-sm`
- `column-md`
- `column-lg`

#### Section

A **column** contains one or more **sections**. A **section** is a collection of [Text](#text) or [Image](#image)s that should appear at one time, before a [Continue Button](#continue-button). As a student clicks **continue buttons**, new **sections** are revealed, one at a time.

```html
<body>
  <div class="column column-md">
    <section>
      <!-- Section content -->
    </section>
  </div>
</body>
```

#### Text

A **text** element displays text and can contain multiple heading and paragraph elements. To create a **text** element, apply the `text` class.

```html
<body>
  <div class="column column-md">
    <section>
      <div class="text">
        <h1>Katherine Johnson</h1>
        <p>Creola Katherine Johnson ...</p>
      </div>
    </section>
  </div>
</body>
```

#### Image

An **image** element displays an image. To create an **image**, apply the `image` class to an `img` element.

```html
<body>
  <div class="column column-md">
    <section>
      <img class="image" src="katherine-johnson-1.jpg">
    </section>
  </div>
</body>
```

#### Continue Button

A **continue button** reveals the next section when it is clicked. Use the `button-semantic`, `button-primary`, and `button-continue` classes.

```html
<body>
  <div class="column column-md">
    <section>
      <!-- Section content -->
      <button class="button-semantic button-primary button-continue">
        <span class="button-text">Continue</span>
        <svg class="button-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M16 8L14.59 6.59L9 12.17V0H7V12.17L1.42 6.58L0 8L8 16L16 8Z" fill="white" />
        </svg>
      </button>
    </section>
  </div>
</body>
```

## Widget

A **Widget** is a specific interactive experience embedded amongst supporting content on a [**Widget Page**](#widget-page). To ensure widgets are reusable across widget pages, each widget is implemented as a class that extends the `Widget` base class in `assets/src/js/Widget.js`. Each widget also has its own CSS file, located in `assets/src/css/`.

### Example

Multiple choice questions are implemented as **Widget**s, because they are a specific interactive experience that should be embedded amongst the content on a **Widget Page**.

As such, the multiple choice widget is defined as a class, called `MultipleChoiceWidget`, that extends the `Widget` class. It also has its own CSS file, `assets/src/css/multiple-choice-widget.css`.

### Embedding a Widget

To embed a **Widget** on a **Widget Page**, first **import it** then **register it**.

- To **import** a widget is to import the JavaScript class that encapsulates the widget's functionality and link the CSS that contains the widget’s styles.
- To **register** a widget is to tell the **Widget Page** to create a new instance of the widget class.

#### Example

Let’s add a multiple choice widget to our widget page.

First, in the `head` of the page, add the multiple choice widget styles, defined in `multiple-choice-widget.css`.

```html
<head>
	<!-- ... -->
	<link rel="stylesheet" href="../css/multiple-choice-widget.css">
</head>
```

Then, in the `body`, add the HTML that will compose the multiple choice widget.

```html
<body>
	<section>
        <!-- Widget page content -->
        <div class="widget multiple-choice-widget">
            <!-- Matching widget HTML -->
        </div>
	</section>
</body>
```

Finally, import the multiple choice widget's JavaScript and register the widget with the widget page.

```html
<script type="module">
  import { WidgetPage } from "../js/WidgetPage.js";
  import { MultipleChoiceWidget } from "../js/MultipleChoiceWidget.js";

  document.addEventListener("DOMContentLoaded", () => {
    const widgetPage = new WidgetPage("widget-page-example", document.body);
    widgetPage.registerWidget(".multiple-choice-widget", MultipleChoiceWidget);
  });
</script>
```

That’s it!
