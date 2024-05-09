import { TrivuleForm } from "./validation";

const trivuleForm = new TrivuleForm("form");

trivuleForm.init();

trivuleForm.make([
  {
    selector: "input[name='name']",
    rules: ["required", "minlength:5"],
    feedbackElement: ".invalid-feedback",
  },
  {
    selector: document.querySelector(".age") as HTMLInputElement,
    rules: ["int", "min:18"],
    // The html element with class .age closest to the input element
    feedbackElement: ".invalid-feedback",
  },
  {
    selector: "input[name='email']", //just input Name
    rules: ["required", "email"],
  },
]);
