import { TrivuleInput } from "./validation";

new TrivuleInput("input", {
  rules: "required|mimes:.pdf|size:1B",
  feedbackElement: "#resume",
}).init();
