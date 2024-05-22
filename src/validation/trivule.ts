import {
  ITrConfig,
  RuleCallBack,
  TrivuleInputParms,
  ValidatableForm,
} from '../contracts';
import { TrConfig } from '../tr.config';
import { TrBag } from './tr-bag';
import { TrivuleForm } from './tr-form';
import { TrivuleInput } from './tr-input';
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
   * Forms to validate array
   */
  private _trForms: TrivuleForm[] = [];

  /**
   * Default configuration
   */
  protected config: ITrConfig = TrConfig;
  /**
   * Select all the form in the document and apply TrivuleForm for them
   * @param config
   */
  init(config?: ITrConfig) {
    this.setConfig(config);
    document
      .querySelectorAll<HTMLFormElement>('form')
      .forEach((formElement) => {
        const trForm = new TrivuleForm(formElement, this.config);
        trForm.init();
        this._trForms.push(trForm);
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
    TrBag.rule(ruleName, call, message);
  }

  forms(): TrivuleForm[] {
    return this._trForms;
  }

  /**
   * Set default configuration
   * @param config
   */
  protected setConfig(config?: ITrConfig) {
    this.config = TrConfig;

    if (config && typeof config === 'object') {
      this.config = { ...this.config, ...config };
    }
  }

  static Rule(ruleName: string, call: RuleCallBack, message?: string) {
    TrBag.rule(ruleName, call, message);
  }
  form(selector: ValidatableForm, config: ITrConfig) {
    const trForm = new TrivuleForm(selector, config);
    trForm.init();
    return trForm;
  }

  input(params: TrivuleInputParms) {
    return new TrivuleInput(params);
  }
}
