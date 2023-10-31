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

  #submit;


  constructor() {
    super();


    const shadow = this.attachShadow({ mode: "closed", slotAssignment: "manual" });
    shadow.appendChild(Quiz.template.content.cloneNode(true));


    this.#showing = /** @type {HTMLSlotElement} */ (shadow.querySelector("slot"));

    for (const form of this.querySelectorAll("form")) form.addEventListener("submit", prevent);


    this.#progress = /** @type {HTMLProgressElement} */ (shadow.querySelector("progress"));
    this.#progress.max = this.childElementCount;

    this.#next = /** @type {HTMLButtonElement} */ (shadow.querySelector("#next"));
    this.#next.addEventListener("click", () => { this.viewing++; });

    this.#previous = /** @type {HTMLButtonElement} */ (shadow.querySelector("#previous"));
    this.#previous.addEventListener("click", () => { this.viewing--; });

    this.viewing = 0;


    this.#submit = /** @type {HTMLButtonElement} */ (shadow.querySelector("#submit"));
    this.#submit.addEventListener("click", () => {
      const questions = this.questions;
      for (let index = 0; index < questions.length; index++) {
        const question = questions[index];


        if (question.checkValidity()) continue;

        this.viewing = index;
        question.reportValidity();

        return;
      }
    });
  }


  get viewing() {
    const viewingElement = this.#showing.assignedElements()[0];


    return [...this.questions].findIndex(element => element === viewingElement);
  }
  set viewing(question) {
    const questions = this.questions;


    if (question < 0 || question >= questions.length)
      throw new RangeError(`quiz does not have an element ${question}.`);


    this.#showing.assign(questions[question]);


    this.#next.disabled = question === questions.length - 1;
    this.#previous.disabled = question === 0;

    this.#progress.value = question;
  }


  get questions() {
    return this.querySelectorAll("form");
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