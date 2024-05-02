import { RuleCallBack } from "./contracts";
import { TrLocal } from "./locale/tr-local";
import { TrBag, TrivuleForm, TrivuleInput } from "./validation";
const trInput = new TrivuleForm("#gift-form");
trInput.init();

const notSudoRule: RuleCallBack = (input: string) => {
  return {
    value: input,
    passes: input != "sudo",
    type: "text", //optional
    alias: undefined, //optional
  };
};
TrBag.rule(
  "notSudo",
  notSudoRule,
  "The input value should not bet 'sudo'",
  "en"
);
