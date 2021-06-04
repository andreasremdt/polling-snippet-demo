# Polling Widget Demo

This small demo showcases how the [Web Components specification](https://developer.mozilla.org/en-US/docs/Web/Web_Components) could be used to implement a polling widget, which allows for quick and simple polling on any kind of website.

This code is for demo purposes only and not meant in production environments.

## Usage

1. Clone this repository.

```bash
git clone https://github.com/andreasremdt/polling-widget
cd polling-widget
```

2. Install dependencies.

```bash
npm install
```

3. Compile the source code into a minified bundle.

```bash
npm run build
```

4. Run the demo HTML files, located in the `public` folder. A new browser window should appear, displaying the demo.

```bash
npm run serve
```

5. If desired, run the test suite.

```bash
npm test
```

## Technical Details

This demo was realized using the Web Components standards, namely Custom Elements, Shadow DOM, and Constructable Stylesheets. Since the used technologies are quite new and no polyfill is provided out-of-the box, this demo _will not_ work in Firefox or Safari, but only Chromium-based browsers. [Polyfills](https://www.npmjs.com/package/construct-style-sheets-polyfill?activeTab=readme) are available, if needed.

In `index.html` are 2 snippets, the first does not contain any custom styling, while the second one is slightly modified to look different and to showcase that potential customers can change the design to their needs.

### Why Web Components

While frameworks and libraries like React or Vue are great for rendering SPAs, the purpose of this demo was to create an embedable snippet which allows users to voice their opinion in a simple poll without using an `iframe`.

While this would be definitely feasible in React or any other framework, the user and customer convenience would suffer for the following reasons:

- Third-party libraries need to be downloaded first to the user's computer in order to properly display the snippet. While this can be optimized using a CDN, it's still an unessecary dependency and would increase the bundle size.
- Encapsulation is hard to achieve. Depending on customer needs, the embed snippet should either have a unique look or visually fit right into an existing design. Most major libraries render plain HTML elements, hence styling falls back to IDs, classes, and attributes. Conflicting styles might be a problem for the customer, depending on their architecture.

Using Web Components has its advantages in this case:

- They are framework-agnostic, because they are treated like HTML elements and can be used in any existing environment, e.g. if the customer uses React or Angular to build their application.
- They provide encapsulation out of the box, both for markup and styles. The snippet can carry its own styling which will not conflict with any global CSS rules, but can be customized if needed.
- Using the snippet is as easy as writing HTML. No JavaScript configuration or API is needed, though could be provided.

## Possible Improvements

- Don't rely on APIs that are not available in certain browsers and need polyfilling (e.g. Constructed Stylesheets). Alternatively, inline styles could be used.
- Provide a JavaScript API to interact with, e.g. to pass in data (questions, answers) or firing events like `submit`.
- Storage persisting can be improved by serializing the options and better handling the data.
- The currently made selection of the user could be highlighted visually.
- Detection for duplicated snippet IDs is missing.

## Documentation

### Installation

To use this snippet, you need to load it first into your page:

```html
<script src="../dist/polling-widget.js" defer></script>
```

For a better page load performance, it's recommended to place the `script` tag right before your closing `body` tag or use the `defer` attribute when putting it into the document's `head`.

### Usage

The snippet is used by embedding it as an HTML element into your code:

```html
<polling-widget title="What day is it?" id="your-custom-id">
  <polling-widget-answer>Monday</polling-widget-answer>
  <polling-widget-answer>Tuesday</polling-widget-answer>
  <polling-widget-answer>I work in shifts, don't ask me</polling-widget-answer>
</polling-widget>
```

The main element (`polling-widget`) has two attributes:

- `title`: Put your question in here, it will be displayed on top of the results.
- `id`: Provide a unique ID, like you would for other HTML elements. This ID is used to store your results in local storage.

To provide answers, use the element `polling-widget-answer`. There are no attributes to configure, just put the answer inside as text.

If you want to display a custom message after a user participated in the poll, you may put any HTML associated to a slot named `finished` into the snippet:

```html
<polling-widget title="What day is it?" id="your-custom-id">
  <polling-widget-answer>Monday</polling-widget-answer>
  <!-- more answers -->

  <p slot="finished">
    Thank your for taking our quick poll! <b>{{ count }}</b> others provided
    their opinion.
  </p>
</polling-widget>
```

What you put inside the `finished` slot is up to you, the HTML structure will be reflected and displayed once the user clicked at one of the answers.

Notice `{{ count }}` inside the text - use this special variable to display the total amount of votes. It will be replaced by a number when rendered.

### Styling

All aspects of the snippet can be styled freely. For that, you can either address the elements (`polling-widget` or `polling-widget-answer`) directly, or use the `::part()` syntax. The following, stylable parts are available:

- `polling-widget::part(title)`: addresses the title.
- `polling-widget-answer::part(button)`: addresses the button inside each answer.

The existing CSS styles can be overriden like with any other HTML element by setting appropriate rules, e.g. `background-color: red`.
