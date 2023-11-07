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


/** @type {number[]} */
const xValues = [];
const TARGETLENGTH = quiz.prompts.length + 1;
while (xValues.length < TARGETLENGTH) {
  xValues.push(Math.floor(Math.random() * 10) + 1);
  if (xValues[xValues.length - 1] === xValues?.[xValues.length - 2]) xValues.pop();
}
console.log(xValues);

/** @type {MathMLElement} */ (document.querySelector("#instructions mn")).textContent = xValues[0].toString();


const xValue = /** @type {MathMLElement} */ (document.querySelector("#x-value mn"));
xValue.textContent = xValues[0].toString();