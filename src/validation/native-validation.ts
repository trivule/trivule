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
   * List of all native HTML validation rules available for HTMLInputElement and supported by Trivule
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
        const attributralue = this.inputElement.getAttribute(nativeRule);
        let rule = nativeRule;
        // if rule value exists
        if (attributralue) {
          rule = `${rule}:${attributralue}` as Rule;
        }
        this._appliedRules.push(rule);
      }
    });
  }

  /**
   * Combines the native validation rules detected with the provided additional rules.
   * @param {string[]} rules Additional rules to be merged with the native rules.
   */

  public merge(rules: string[]): Rule[] {
    const mergedRules: string[] = [...this._appliedRules];

    rules.forEach((newRule) => {
      const index = mergedRules.findIndex((rule) =>
        rule.startsWith(newRule.split(":")[0])
      );
      if (index !== -1) {
        mergedRules[index] = newRule;
      } else {
        mergedRules.push(newRule);
      }
    });

    return mergedRules as Rule[];
  }
}
