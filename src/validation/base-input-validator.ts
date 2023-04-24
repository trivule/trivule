import { Rule } from "../contracts/rules";
import { Qvalidator } from "./qv-validator";
import { AbstractInputValidator } from "./abstract-input";
import { IQvConfig, InputEventDetails } from "../contracts";
import { QvMessages } from "../messages";

export class BaseInputValidator extends AbstractInputValidator {
  /**
   * Quickv Validator
   */
  protected validator!: Qvalidator;

  constructor(
    inputElement: HTMLInputElement,
    config?: IQvConfig,
    emitEvent = true
  ) {
    super(inputElement, config, emitEvent);
  }
  validate() {
    const valid = this.valid();
    this.setValidationClass(valid);
    this.errors = this.validator.getMessages();
    this.emitChangeEvent();
    return valid;
  }
  getRules() {
    return this.rules;
  }

  hasRules() {
    return this.rules.length > 0;
  }

  getMessages() {
    return this.messages;
  }

  /**
   * Valid the input
   * @returns
   */
  valid() {
    const input: Record<string, any> = {};
    const rules: Record<string, Rule[]> = {};

    input[this.name] = this.getValue();
    rules[this.name] = this.rules;

    const qvMessages = new QvMessages();

    qvMessages.setMessages(this.messages);

    this.validator = Qvalidator.make(rules, input, qvMessages);

    return this.validator.isValid();
  }
  /**
   * Emit event if input change
   */
  private emitChangeEvent() {
    if (this.emitEvent) {
      this.inputElement.dispatchEvent(
        new CustomEvent<InputEventDetails>("qv.input.validated", {
          detail: {
            rules: this.rules,
            input: {},
            element: this.inputElement,
          },
          bubbles: true,
        })
      );
    }
  }

  getErrors(): string[] {
    return this._errors;
  }

  fails() {
    return !this.valid();
  }
}
