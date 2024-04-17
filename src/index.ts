import { TvLocal } from "./locale/tv-local";
import { TvConfig } from "./tv.config";
import { Trivule, TvBag, TrivuleForm, TrivuleInput } from "./validation";

declare global {
  interface Window {
    TrivuleInput: typeof TrivuleInput;
    TrivuleForm: typeof TrivuleForm;
    Trivule: typeof Trivule;
    TvBag: typeof TvBag;
    TvLocal: typeof TvLocal;
  }
}

if (typeof window !== "undefined") {
  window.TrivuleInput = window.TrivuleInput ?? TrivuleInput;
  window.TrivuleForm = window.TrivuleForm ?? TrivuleForm;
  window.Trivule = window.Trivule ?? Trivule;
  window.TvBag = window.TvBag ?? TvBag;
  window.TvLocal = window.TvLocal ?? TvLocal;
}

export { Trivule, TrivuleForm, TrivuleInput, TvConfig, TvBag };
