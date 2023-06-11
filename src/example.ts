import { QvForm, QvInput } from "./validation";
import { NativeValidation } from "./validation/native-validation";

const qvForm = new QvForm("#myForm");

const input = document.querySelector(".input") as HTMLInputElement;

if (input) {
  const validation = new NativeValidation(input);

  const additionRules = "startWith:meshach|email";

  const rules = validation.merge(additionRules);

  console.log(rules);
}

qvForm.init();
