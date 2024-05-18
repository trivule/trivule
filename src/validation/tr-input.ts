import {
  EventCallback,
  RuleCallBack,
  TrivuleInputParms,
  ValidatableInput,
} from "../contracts";
import { TrivuleInputValidator } from "./tr-input-validator";
import { TrBag } from "./tr-bag";
import { TrParameter } from "./utils/parameter";

/**
 * TrivuleInput is responsible for applying live validation to an HTML input element.
 * Creates an instance of TrivuleInput.
 * @param inputElement The HTML input element to apply live validation to.
 * @param config Optional configuration object for TrivuleInput.
 * Example:
 * ```
 * const inputElement = document.getElementById("myInput") as HTMLInputElement;
 * const trivuleInput = new TrivuleInput(inputElement);
 * trivuleInput.init();
 * ```
 */
export class TrivuleInput extends TrivuleInputValidator {
  constructor(
    inputElement: ValidatableInput | TrivuleInputParms,
    param?: TrivuleInputParms,
    parameter?: TrParameter
  ) {
    super(inputElement, param, parameter);
    this.init();
  }

  /**
   * Initializes live validation on the input element.
   * Example:
   * ```
   * const trivuleInput = new TrivuleInput(inputElement);
   * trivuleInput.init();
   * ```
   */
  init() {
    if (!this.__wasInit) {
      if (this.autoValidate) {
        this.__wasInit = true;
        this.events.forEach((e) => {
          this.inputElement.addEventListener(e, () => {
            if (!this.realTime) {
              if (e != "input" && e != "keyup" && e != "keydown") {
                this.value = this.getInputElemenyValue();
                this.emit("tr.input.update", {
                  detail: {
                    rules: this.rules,
                    input: {},
                    element: this.inputElement,
                  },
                });
              }
            } else {
              this.value = this.getInputElemenyValue();
              this.emit("tr.input.update", {
                detail: {
                  rules: this.rules,
                  input: {},
                  element: this.inputElement,
                },
              });
            }
          });
        });
      }
    }
  }
  /**
   * Add new rule to input element
   * @param ruleName
   * @param call
   * @param message
   */
  rule(ruleName: string, call: RuleCallBack, message?: string) {
    TrBag.rule(ruleName, call, message);
  }

  with(param: TrivuleInputParms) {
    this.setParams(param);
  }

  whereName(inputName: string): boolean {
    return this.name === inputName;
  }

  onFails(fn: EventCallback) {
    this.on("tr.input.fails", (e) => {
      this.__call(fn, this);
    });
  }

  onPasses(fn: EventCallback) {
    this.on("tr.input.passes", (e) => {
      this.__call(fn, this);
    });
  }

  onUpdate(fn: EventCallback) {
    this.on("tr.input.update", (e) => {
      this.__call(fn, this);
    });
  }

  destroy() {
    this.param.events?.forEach((e) => {
      this.inputElement.removeEventListener(e, () => {
        this.validate();
      });
    });
    this.param.events = [];
    this.rules.clear();
    this.param.rules = [];
  }

  is(input: HTMLInputElement) {
    return input === this.inputElement;
  }
}
