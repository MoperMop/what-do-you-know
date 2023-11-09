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
  #prompt;
  #promptSlot;

  #timer;
  #timeRemaining;
  /** @type {number | undefined} */
  #timerInterval;

  /** @type {WeakMap<HTMLFormElement, undefined>} */
  #viewed;


  constructor() {
    super();


    const shadow = this.attachShadow({ mode: "closed", slotAssignment: "manual" });
    shadow.appendChild(Quiz.template.content.cloneNode(true));


    this.#showing = /** @type {HTMLSlotElement} */ (shadow.querySelector("slot"));

    for (const form of this.querySelectorAll("form")) form.addEventListener("submit", prevent);


    this.#viewed = new WeakMap();


    this.#progress = /** @type {HTMLProgressElement} */ (shadow.querySelector("#question-progress"));
    this.#progress.max = this.questions.length;

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


      this.showPrompt();
    });


    this.#prompt = /** @type {HTMLDialogElement} */ (shadow.querySelector("dialog"));
    this.#promptSlot = /** @type {HTMLSlotElement} */ (this.#prompt.querySelector("slot"));

    this.currentPrompt = -1;

    shadow.querySelector("#close-prompt")?.addEventListener?.("click", () => { this.closePrompt(); });
    shadow.querySelector("#finish")?.addEventListener?.("click", () => { this.finish(); });
  

    this.#timer = /** @type {HTMLProgressElement} */ (shadow.querySelector("#timer"));
    this.#timeRemaining = /** @type {HTMLOutputElement} */ (shadow.querySelector("#time-remaining"));
    
    this.#timer.value = this.#timer.max = Number(this.getAttribute("time")) || 60;
  }


  /**
   * start the timer, which when completed will end the quiz
   */
  beginTimer() {
    const currentTime = Date.now();


    this.#timerInterval = setInterval(() => {
      const remainingSeconds = this.#timer.max - Math.floor((Date.now() - currentTime) / 1000);
      this.#timer.value = Math.floor(remainingSeconds);
      this.#timeRemaining.textContent = `${remainingSeconds} seconds`;
      

      if (remainingSeconds <= 0) { this.finish(); }
    });
  }
  /**
   * stop the timer begun with {@linkcode beginTimer}
   */
  stopTimer() {
    clearInterval(this.#timerInterval);
    this.#timerInterval = undefined;
  }


  get viewing() {
    const viewingElement = this.#showing.assignedElements()[0];


    return this.questions.findIndex(element => element === viewingElement);
  }
  set viewing(question) {
    const questions = this.questions;


    if (question < 0 || question >= questions.length)
      throw new RangeError(`quiz does not have an element ${question}.`);


    this.#showing.assign(questions[question]);


    this.#next.disabled = question === questions.length - 1;
    this.#previous.disabled = question === 0;

    this.#progress.value = question;


    this.#viewed.set(questions[question], undefined)
  }

  /**
    * show the most applicable prompt
    */
  showPrompt() {
    const prompts = this.prompts;


    if (this.questions.every(question => this.#viewed.has(question))) {
      this.currentPrompt++;


      this.questions.forEach((question, index) => {
        if (index === this.viewing) return;

        this.#viewed.delete(question)
      });
    }


    if (this.currentPrompt in prompts) this.#promptSlot.assign(prompts[this.currentPrompt]);
    else this.#promptSlot.assign();


    this.#prompt.showModal();
  }
  /**
    * close the prompt opened with {@linkcode showPrompt}
    */
  closePrompt() { this.#prompt.close(); }

  /**
   * finish the quiz
   */
  finish() {
    const finishEvent = new CustomEvent("finish", {
      detail: {
        currentPrompt: this.currentPrompt,
        timeRemaining: this.#timer.value,
      }
    })
    this.dispatchEvent(finishEvent);
    

    if (finishEvent.defaultPrevented) return;
    this.stopTimer();
    this.#prompt.close();
  }


  get questions() {
    return /** @type {HTMLFormElement[]} */ (
      [...this.children].filter((child) => child instanceof HTMLFormElement)
    );
  }
  get prompts() {
    return /** @type {HTMLDivElement[]} */ (
      [...this.children].filter((child) => child instanceof HTMLDivElement)
    );
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
