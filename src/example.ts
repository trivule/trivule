import { TrivuleForm } from "./validation";

const trivuleForm = new TrivuleForm("form");

trivuleForm.init();

trivuleForm.make([
  {
    selector: "input[name='name']",
    rules: ["required", "minlength:5"],
    feedbackElement: "#name",
  },
  {
    selector: document.querySelector(".age") as HTMLInputElement,
    rules: ["required", "int", "min:18"],
    // The html element with class .age closest to the input element
    feedbackElement: ".age",
  },
  {
    selector: "input[name='email']", //just input Name
    rules: ["required", "email"],
  },
]);
