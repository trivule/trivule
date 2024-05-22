import { TrRule, TrMessage } from './validation/tr-bag';
import { TrLocal } from './locale/tr-local';
import { TrConfig } from './tr.config';
import { Trivule, TrBag, TrivuleForm, TrivuleInput } from './validation';

declare global {
  interface Window {
    TrivuleInput: typeof TrivuleInput;
    TrivuleForm: typeof TrivuleForm;
    Trivule: typeof Trivule;
    TrBag: typeof TrBag;
    TrLocal: typeof TrLocal;
    TrRule: typeof TrRule;
    TrMessage: typeof TrMessage;
  }
}

if (typeof window !== 'undefined') {
  window.TrivuleInput = window.TrivuleInput ?? TrivuleInput;
  window.TrivuleForm = window.TrivuleForm ?? TrivuleForm;
  window.Trivule = window.Trivule ?? Trivule;
  window.TrBag = window.TrBag ?? TrBag;
  window.TrLocal = window.TrLocal ?? TrLocal;
  window.TrRule = window.TrRule ?? TrRule;
  window.TrMessage = window.TrMessage ?? TrMessage;
}

export {
  Trivule,
  TrivuleForm,
  TrivuleInput,
  TrConfig,
  TrBag,
  TrLocal,
  TrRule,
  TrMessage,
};
