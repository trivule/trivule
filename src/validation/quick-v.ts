import { IQvConfig, RuleCallBack } from "../contracts";
import { QvConfig } from "../qv.config";
import { QvBag } from "./qv-bag";
import { QvForm } from "./qv-form";
/**
 * @author Claude Fassinou
 */
export class Quickv {
  /**
   * Default configuration
   */
  protected config: IQvConfig = QvConfig;
  /**
   * Select all the form in the document and apply QvForm for them
   * @param config
   */
  init(config?: IQvConfig) {
    this.setConfig(config);
    document
      .querySelectorAll<HTMLFormElement>("form")
      .forEach((formElement) => {
        new QvForm(formElement).init(this.config);
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
  protected setConfig(config?: IQvConfig) {
    this.config = QvConfig;
    if (config && typeof config === "object") {
      this.config = { ...this.config, ...config };
    }
  }
}
