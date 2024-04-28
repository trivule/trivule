import { TrLocal } from "./locale/tr-local";
import { TrConfig } from "./tr.config";
import { Trivule, TrBag, TrivuleForm, TrivuleInput } from "./validation";

declare global {
  interface Window {
    TrivuleInput: typeof TrivuleInput;
    TrivuleForm: typeof TrivuleForm;
    Trivule: typeof Trivule;
    TrBag: typeof TrBag;
    TrLocal: typeof TrLocal;
  }
}

if (typeof window !== "undefined") {
  window.TrivuleInput = window.TrivuleInput ?? TrivuleInput;
  window.TrivuleForm = window.TrivuleForm ?? TrivuleForm;
  window.Trivule = window.Trivule ?? Trivule;
  window.TrBag = window.TrBag ?? TrBag;
  window.TrLocal = window.TrLocal ?? TrLocal;
}

export { Trivule, TrivuleForm, TrivuleInput, TrConfig, TrBag, TrLocal };
