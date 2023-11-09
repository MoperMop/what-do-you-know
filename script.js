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