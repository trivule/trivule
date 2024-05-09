import { TrivuleInput } from "./validation";

new TrivuleInput({
  selector: "input",
  rules: "required|minlength:2|maxlength:3",
  feedbackElement: "#resume",
  messages:
    "This field cannot be empty|The field is too short| The field is too long",
}).init();
