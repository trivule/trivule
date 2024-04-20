import { Trivule, TrivuleForm, TrivuleInput } from "./validation";
const tr = new TrivuleForm("form", {
  validClass: "success",
});
tr.init();

tr.onValidate((tr) => {
  console.log(tr.inputs(true));
});
