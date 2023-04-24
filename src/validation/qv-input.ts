import { IQvConfig, RuleCallBack } from "../contracts";
import { BaseInputValidator } from "./base-input-validator";
import { QvBag } from "./qv-bag";
/**
 * @author Claude Fassinou
 */
export class QvInput extends BaseInputValidator {
  constructor(
    inputElement: HTMLInputElement,
    config?: IQvConfig,
    emitEvent = true
  ) {
    super(inputElement, config, emitEvent);
  }

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
