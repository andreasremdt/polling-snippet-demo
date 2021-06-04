import "./polling-widget-answer";

class PollingWidget extends HTMLElement {
  #root = this.attachShadow({ mode: "open" });
  #title = this.getAttribute("title");
  #disabled = this.hasAttribute("disabled");
  #completed = false;

  connectedCallback() {
    if (!this.hasAttribute("id")) {
      throw new Error(`Please provide a unique ID to this poll.`);
    }

    this.#render();
  }

  collect(answer) {
    const localStorageId = this.getAttribute("id");
    const fromLocalStorage = localStorage.getItem(localStorageId);
    const results = fromLocalStorage ? JSON.parse(fromLocalStorage) : {};

    if (results.hasOwnProperty(answer)) {
      results[answer]++;
    } else {
      results[answer] = 1;
    }

    if (results.hasOwnProperty("totalPolls")) {
      results.totalPolls++;
    } else {
      results.totalPolls = 1;
    }

    localStorage.setItem(localStorageId, JSON.stringify(results));

    this.#showResults(results);
  }

  #showResults(results) {
    Array.from(this.children).forEach((child) => {
      if (child.tagName == "POLLING-WIDGET-ANSWER") {
        child.result = (
          (results[child.textContent] * 100) /
          results.totalPolls
        ).toFixed();
      } else if (child.getAttribute("slot") == "finished") {
        child.innerHTML = child.innerHTML.replace(
          /{{\s?count\s?}}/gi,
          results.totalPolls
        );
      }
    });
  }

  #render() {
    const title = document.createElement("h2");
    const defaultSlot = document.createElement("slot");
    const footer = document.createElement("footer");
    const finishedSlot = document.createElement("slot");

    title.textContent = this.getAttribute("title");
    title.setAttribute("part", "title");

    footer.append(finishedSlot);
    finishedSlot.setAttribute("name", "finished");

    this.#root.append(title, defaultSlot, footer);
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get #styles() {
    const sheet = new CSSStyleSheet();

    sheet.insertRule(`
      :host {
        border: 1px solid rgba(0,0,0,.08);
        box-shadow: 0 .3rem 2rem -.5rem rgba(0,0,0,.1);
        display: block;
        border-radius: .4rem;
        padding: 1rem;
        margin: 3rem 0;
        pointer-events: ${this.#disabled ? "none" : "all"};
      }
    `);

    sheet.insertRule(`
      footer {
        display: ${this.#completed ? "block" : "none"};
      }
    `);

    sheet.insertRule(`
      h2 {
        margin: 0 0 1.5rem 0;
      }
    `);

    return sheet;
  }

  get title() {
    return this.#title;
  }

  set title(value) {
    this.#title = value;
  }

  get disabled() {
    return this.#disabled;
  }

  set disabled(value) {
    this.#disabled = value;

    if (value) {
      this.#root.adoptedStyleSheets = [this.#styles];
    }
  }

  get completed() {
    return this.#completed;
  }

  set completed(value) {
    this.#completed = value;
    this.#disabled = true;

    if (value) {
      this.#root.adoptedStyleSheets = [this.#styles];
    }
  }
}

window.customElements.define("polling-widget", PollingWidget);
