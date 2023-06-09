import { Rule } from "../contracts";

/**
 * Provides validation based on the set of native HTML validation rules assigned to the input field concerned
 */
export class NativeValidation {
  /**
   * The HTML input element
   */
  private inputElement!: HTMLInputElement;

  /**
   * List of all native HTML validation rules available for HTMLInputElement and supported by Quickv
   */
  private _nativeRules: Rule[] = [
    "required",
    "min",
    "max",
    "minlength",
    "maxlength",
  ];

  /**
   * Native HTML validation rules assigned to input element
   */
  private _appliedRules: string[] = [];

  constructor(inputElement: HTMLInputElement | string) {
    this.setInputElement(inputElement);
    this.getNativeRulesApplied();
    this.merge();
  }

  /**
   * Assigns the specified HTML input field to the `inputElement` property of the `NativeValidation` instance
   *
   * @param inputElement The HTML input element to which validation based on native validation rules will be applied.
   */
  private setInputElement(inputElement: HTMLInputElement | string) {
    if (!(inputElement instanceof HTMLInputElement)) {
      const el = document.querySelector<HTMLInputElement>(inputElement);

      if (el) {
        inputElement = el;
      }
    }

    if (!(inputElement instanceof HTMLElement)) {
      throw new Error(
        "The 'inputElement' parameter must be of type HTMLInputElement."
      );
    }

    this.inputElement = inputElement;
  }

  /**
   * Gets the native validation rules applied to the HTML input field.
   */
  private getNativeRulesApplied() {
    this._nativeRules.forEach((nativeRule) => {
      if (this.inputElement.hasAttribute(nativeRule)) {
        this._appliedRules.push(nativeRule);
      }
    });
  }

  /**
   * Generates Quickv validation rules based on the native HTML validation rules applied to the targeted input field.
   * @returns {string} The merged rule string, or an empty string if no rule is applied.
   */
  private merge(): string {
    let rules: string[] = [];

    if (this._appliedRules.length == 0) {
      return "";
    }

    this._appliedRules.forEach((appliedRule) => {
      const rule =
        appliedRule === "required"
          ? appliedRule
          : `${appliedRule}:${this.inputElement.getAttribute(appliedRule)}`;

      rules.push(rule);
    });

    return rules.join("|");
  }
}
