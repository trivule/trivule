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

  constructor(inputElement: HTMLInputElement) {
    this.inputElement = inputElement;
    this.getNativeRulesApplied();
  }

  /**
   * Gets the native validation rules applied to the HTML input field.
   */
  private getNativeRulesApplied() {
    this._nativeRules.forEach((nativeRule) => {
      if (this.inputElement.hasAttribute(nativeRule)) {
        const rule =
          nativeRule === "required"
            ? nativeRule
            : `${nativeRule}:${this.inputElement.getAttribute(nativeRule)}`;

        this._appliedRules.push(rule);
      }
    });
  }

  /**
   * Combines the native validation rules detected with the provided additional rules.
   * @param {string} additionRules Additional rules to be merged with the native rules.
   * @returns {string} The merged set of rules.
   */

  public merge(additionRules: string): string {
    if (this._appliedRules.length == 0) {
      return additionRules;
    }

    const mergedRules =
      additionRules.length == 0
        ? this._appliedRules.join("|")
        : this._appliedRules.join("|") + "|" + additionRules;

    return mergedRules;
  }
}
