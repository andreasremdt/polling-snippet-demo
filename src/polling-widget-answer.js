class PollingWidgetAnswer extends HTMLElement {
  #root = this.attachShadow({ mode: "open" });
  #result = this.getAttribute("result") || "0";

  connectedCallback() {
    this.#render();
  }

  #handleClick = (evt) => {
    this.parentElement.completed = true;
    this.parentElement.collect(evt.target.textContent);
  };

  #render() {
    const button = document.createElement("button");
    const result = document.createElement("span");

    button.textContent = this.textContent;
    button.setAttribute("part", "button");
    button.append(result);
    button.onclick = this.#handleClick;

    this.#root.append(button);
    this.#root.adoptedStyleSheets = [this.#styles];
  }

  get #styles() {
    const sheet = new CSSStyleSheet();

    sheet.insertRule(`
      :host {
        --progress: 0%;
      }
    `);

    sheet.insertRule(`
      button {
        position: relative;
        display: block;
        width: 100%;
        text-align: left;
        border: unset;
        border-radius: .2rem;
        font: inherit;
        margin-top: .7rem;
        padding: .5rem .8rem;
        background-color: rgba(0, 0, 0, .06);
        transition: background-color .1s linear;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
      }
    `);

    sheet.insertRule(`
      button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: var(--progress);
        height: 100%;
        background-color: rgba(0, 0, 0, .08);
        transition: width .3s ease-out;
        border-radius: .2rem;
      }
    `);

    sheet.insertRule(`
      button:hover {
        background-color: rgba(0, 0, 0, .1);
      }
    `);

    sheet.insertRule(`
      button > span {
        opacity: ${this.#result ? "1" : "0"};
        visibility: ${this.#result ? "visible" : "hidden"};
        transition: opacity .3s linear;
      }
    `);

    return sheet;
  }

  set result(value) {
    this.#result = isNaN(value) ? "0" : value;

    this.#root.adoptedStyleSheets = [this.#styles];

    this.style.setProperty("--progress", `${this.#result}%`);
    this.#root.querySelector("span").textContent = `${this.#result}%`;
  }
}

window.customElements.define("polling-widget-answer", PollingWidgetAnswer);
