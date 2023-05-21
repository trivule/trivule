import { IQvConfig, RuleCallBack } from "../contracts";
import { BaseInputValidator } from "./base-input-validator";
import { QvBag } from "./qv-bag";

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
export class QvInput extends BaseInputValidator {
  constructor(
    inputElement: HTMLInputElement,
    config?: IQvConfig,
    emitEvent = true
  ) {
    super(inputElement, config, emitEvent);
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
    this.events.forEach((e) => {
      this.inputElement.addEventListener(e, () => {
        this.validate();
      });
    });
  }
  /**
   * Add new rule
   * @param ruleName
   * @param call
   * @param message
   */
  rule(ruleName: string, call: RuleCallBack, message?: string) {
    QvBag.rule(ruleName, call, message);
  }
}
