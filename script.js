//@ts-check
import Quiz from "./quiz.js";


const quiz = /** @type {Quiz} */ (document.querySelector("quiz-"));
const quizWrapper = /** @type {HTMLElement} */ (document.querySelector("#quiz-wrapper"));

const instructions = /** @type {HTMLElement} */ (document.querySelector("#instructions"));
const begin = /** @type {HTMLButtonElement} */ (document.querySelector("#begin"));
begin.addEventListener("click", () => {
  quizWrapper.hidden = false;
  instructions.hidden = true;


  quiz.beginTimer();
});

const end = /** @type {HTMLElement} */ (document.querySelector("#end"));
quiz.addEventListener("finish", () => {
  quizWrapper.hidden = true;
  end.hidden = false;
});



// @ts-ignore-error
quiz.addEventListener("showPrompt", 
  /**
   * @param {CustomEvent<{currentPrompt: number; newPrompt: boolean;}>} event
   */
  event => {
    if (!event.detail.newPrompt) return;
    switch (event.detail.currentPrompt) {
      case 0:
        /** @type {MathMLElement} */ (document.querySelector("#x-value mn")).textContent = "6";
        break;
      case 1:
        const numbers = document.querySelectorAll("mn");
        for (const number of numbers) {
          if (number.textContent === "3") number.textContent = "2";
        }
        break;
      case 2:
        const toMove = /** @type {NodeListOf<HTMLElement>} */ (quiz.querySelectorAll("[data-pos2]"));
        const questions = quiz.questions;


        for (const moving of toMove) {
          questions[Number(moving.dataset.pos2) - 1].appendChild(moving);
        }
        break;
    }
  });
