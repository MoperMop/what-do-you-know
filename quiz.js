//@ts-check


/**
  * a quiz containing questions that can be cycled through
  */
export default class Quiz extends HTMLElement {
  static template = /** @type {HTMLTemplateElement} */ (document.querySelector("template#quiz"));


  #showing;

  #progress
  #next;
  #previous;


  constructor() {
    super();


    const shadow = this.attachShadow({mode: "closed", slotAssignment: "manual"});
    shadow.appendChild(Quiz.template.content.cloneNode(true));


    this.#showing = /** @type {HTMLSlotElement} */ (shadow.querySelector("slot"));

    for (const form of this.querySelectorAll("form")) form.addEventListener("submit", prevent);


    this.#progress = /** @type {HTMLProgressElement} */ (shadow.querySelector("progress"));
    this.#progress.max = this.childElementCount;

    this.#next = /** @type {HTMLButtonElement} */ (shadow.querySelector("#next"));
    this.#next.addEventListener("click", () => {this.viewing++;});

    this.#previous = /** @type {HTMLButtonElement} */ (shadow.querySelector("#previous"));
    this.#previous.addEventListener("click", () => {this.viewing--;});

    this.viewing = 0;
  }


  get viewing() {
    const viewingElement = this.#showing.assignedElements()[0];


    return [...this.querySelectorAll("form")].findIndex(element => element === viewingElement);
  }
  set viewing(form) {
    const forms = this.querySelectorAll("form");


    if (form < 0 || form >= forms.length)
      throw new RangeError(`quiz does not have an element ${form}.`);


    this.#showing.assign(forms[form]);


    this.#next.disabled = form === forms.length - 1;
    this.#previous.disabled = form === 0;

    this.#progress.value = form;
  }


  static {
    customElements.define("quiz-", this)
  }
}


/**
 * an event listener that calls event.preventDefaut()
 * @param {Event} event 
 */
function prevent(event) {
  event.preventDefault();
}