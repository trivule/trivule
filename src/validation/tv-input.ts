import { ITvConfig, RuleCallBack } from "../contracts";
import { TrivuleInputValidator } from "./tv-input-validator";
import { TvBag } from "./tv-bag";
import {
  EventCallback,
  TrivuleInputParms,
  ValidatableInput,
} from "../contracts/types";

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
  constructor(inputElement: ValidatableInput, param?: TrivuleInputParms) {
    super(inputElement, param);
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
    this.param.events?.forEach((e) => {
      this.inputElement.addEventListener(e, () => {
        this.validate();
      });
    });
  }
  /**
   * Add new rule to input element
   * @param ruleName
   * @param call
   * @param message
   */
  rule(ruleName: string, call: RuleCallBack, message?: string) {
    TvBag.rule(ruleName, call, message);
  }

  with(param: TrivuleInputParms) {
    this._setParams(param);
    this.validator.setParams(this.param);
  }

  whereName(inputName: string): boolean {
    return this.name === inputName;
  }

  onFails(fn: EventCallback) {
    this.on("tv.input.fails", (e) => {
      this.__call(fn);
    });
  }

  onPasses(fn: EventCallback) {
    this.on("tv.input.passes", (e) => {
      this.__call(fn);
    });
  }

  destroy() {
    this.param.events?.forEach((e) => {
      this.inputElement.removeEventListener(e, () => {
        this.validate();
      });
    });
    this.param.events = [];
    this.rules = [];
    this.param.rules = [];
  }

  is(input: HTMLInputElement) {
    return input === this.inputElement;
  }
}
