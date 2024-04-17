import { ITvConfig, RuleCallBack } from "../contracts";
import { TvConfig } from "../tv.config";
import { TvBag } from "./tv-bag";
import { TrivuleForm } from "./tv-form";
/**
 *
 * Initializes Trivule and applies form validation to all forms in the document.
 * @param config Optional configuration object for Trivule.
 * Example:
 * ```
 * const trivule = new Trivule();
 * trivule.init();
 * ```
 * @author Claude Fassinou
 */
export class Trivule {
  /**
   * Default configuration
   */
  protected config: ITvConfig = TvConfig;
  /**
   * Select all the form in the document and apply TrivuleForm for them
   * @param config
   */
  init(config?: ITvConfig) {
    this.setConfig(config);
    document
      .querySelectorAll<HTMLFormElement>("form")
      .forEach((formElement) => {
        new TrivuleForm(formElement).init();
      });
  }
  /**
   * Adds a new validation rule to Trivule's rule bag.
   * @param ruleName The name of the rule.
   * @param call The rule callback function.
   * @param message Optional error message for the rule.
   * Example:
   * ```
   * trivule.rule('customRule', (value) => value === 'foo', 'Value must be "foo"');
   * ```
   */
  rule(ruleName: string, call: RuleCallBack, message?: string) {
    TvBag.rule(ruleName, call, message);
  }
  /**
   * Set default configuration
   * @param config
   */
  protected setConfig(config?: ITvConfig) {
    this.config = TvConfig;
    if (config && typeof config === "object") {
      this.config = { ...this.config, ...config };
    }
  }

  static Rule(ruleName: string, call: RuleCallBack, message?: string) {
    TvBag.rule(ruleName, call, message);
  }
}
