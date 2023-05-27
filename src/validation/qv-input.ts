import { IQvConfig, RuleCallBack } from "../contracts";
import { QvInputValidator } from "./qv-input-validator";
import { QvBag } from "./qv-bag";
import { QvInputParms, ValidatableInput } from "../contracts/types";
import { QvLocal } from "../locale/qv-local";

/**
 * QvInput is responsible for applying live validation to an HTML input element.
 * Creates an instance of QvInput.
 * @param inputElement The HTML input element to apply live validation to.
 * @param config Optional configuration object for QvInput.
 * Example:
 * ```
 * const inputElement = document.getElementById("myInput") as HTMLInputElement;
 * const qvInput = new QvInput(inputElement);
 * qvInput.init();
 * ```
 */
export class QvInput extends QvInputValidator {
  constructor(
    inputElement: ValidatableInput,
    config?: IQvConfig,
    param?: QvInputParms
  ) {
    super(inputElement, config, param);
  }

  /**
   * Initializes live validation on the input element.
   * Example:
   * ```
   * const qvInput = new QvInput(inputElement);
   * qvInput.init();
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
    QvBag.rule(ruleName, call, message);
  }

  with(param: QvInputParms) {
    this._setParams(param);
    this.validator.setParams(this.param);
  }

  whereName(inputName: string): boolean {
    return this.name === inputName;
  }
}
