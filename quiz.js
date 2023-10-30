//@ts-check


/**
  * a quiz containing questions that can be cycled through
  */
export default class Quiz extends HTMLElement {
  static template = /** @type {HTMLTemplateElement} */ (document.querySelector("template#quiz"));


  #form;

  #hidden
  #shown;

  #progress
  #next;
  #previous;


  constructor() {
    super();


    const shadow = this.attachShadow({mode: "closed", slotAssignment: "manual"});
    shadow.appendChild(Quiz.template.content.cloneNode(true));

    this.#form = /** @type {HTMLFormElement} */ (shadow.querySelector("form"));
    this.#form.addEventListener("submit", event => {
      event.preventDefault();
    });


    this.#shown = /** @type {HTMLSlotElement} */ (shadow.querySelector("slot:not([hidden])"));
    this.#hidden = /** @type {HTMLSlotElement} */ (shadow.querySelector("slot[hidden]"));


    this.#progress = /** @type {HTMLProgressElement} */ (shadow.querySelector("progress"));
    this.#progress.max = this.childElementCount;

    this.#next = /** @type {HTMLButtonElement} */ (shadow.querySelector("#next"));
    this.#next.addEventListener("click", () => {this.viewing++;});

    this.#previous = /** @type {HTMLButtonElement} */ (shadow.querySelector("#previous"));
    this.#previous.addEventListener("click", () => {this.viewing--;});

    this.viewing = 0;
  }


  get viewing() {
    const viewingElement = this.#shown.assignedElements()[0];


    return [...this.children].findIndex(element => element === viewingElement);
  }
  set viewing(child) {
    if (child < 0 || child >= this.childElementCount)
      throw new RangeError(`quiz does not have an element ${child}.`);


    for (const element of this.#shown.assignedElements()) {
      this.#hidden.assign(element);
    }

    this.#shown.assign(/** @type {Element} */ (this.children.item(child)));


    this.#next.disabled = child === this.childElementCount - 1;
    this.#previous.disabled = child === 0;

    this.#progress.value = child + 1;
  }


  static {
    customElements.define("quiz-", this)
  }
}