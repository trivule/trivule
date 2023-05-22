import { Rule } from "../contracts/rule";
import { Qvalidator } from "./qv-validator";
import { AbstractInputValidator } from "./abstract-input";
import { IQvConfig, InputEventDetails } from "../contracts";
import { QvMessages } from "../messages";
import { CssSelector, ValidatableInput } from "../contracts/types";

export class QvInputValidator extends AbstractInputValidator {
  /**
   * Quickv Validator
   */
  protected validator!: Qvalidator;

  constructor(
    inputElement: ValidatableInput,
    config?: IQvConfig,
    emitEvent = true
  ) {
    super(inputElement, config, emitEvent);
  }
  /**
   * Performs validation on the input element. And emits qv.input.validated event if necessary.
   * @returns true if the input element is valid, false otherwise.
   * Example:
   * ```
   * const qvInput = new QvInput(inputElement);
   * const isValid = qvInput.validate();
   * if (isValid) {
   *   // Proceed with form submission or handle valid input
   * } else {
   *   // Display error messages or handle invalid input
   * }
   * ```
   */
  validate() {
    const valid = this.valid();
    this.setValidationClass(valid);
    this.errors = this.validator.getMessages();
    this.emitChangeEvent();
    return valid;
  }

  /**
   * Returns the validation rules defined for the input element.
   * @returns An array of validation rules.
   * Example:
   * ```
   * const qvInput = new QvInput(inputElement);
   * const rules = qvInput.getRules();
   * console.log(rules); // Output: ['required', 'email']
   * ```
   */
  getRules() {
    return this.rules;
  }
  /**
   * Checks if the input element has validation rules.
   * @returns A boolean indicating if rules are defined.
   * Example:
   * ```
   * const qvInput = new QvInput(inputElement);
   * const hasRules = qvInput.hasRules();
   * console.log(hasRules); // Output: true or false
   * ```
   */
  hasRules() {
    return this.rules.length > 0;
  }

  /**
   * Get the validation messages associated with the input element.
   * @returns An object containing the validation messages.
   * Example:
   * ```
   * const qvInput = new QvInput(inputElement);
   * const messages = qvInput.getMessages();
   * console.log(messages); // Output: { ruleName1: 'Message 1', ruleName2: 'Message 2', ... }
   * ```
   */
  getMessages(): Record<string, string> {
    return this.messages;
  }

  /**
   * Performs validation on the input element using the defined validation rules. Don't emit qv.input.validated event
   * @returns true if the input element is valid, false otherwise.
   * Example:
   * ```
   * const qvInput = new QvInput(inputElement);
   * const isValid = qvInput.valid();
   * if (isValid) {
   *   // Proceed with form submission or handle valid input
   * } else {
   *   // Display error messages or handle invalid input
   * }
   * ```
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
  /**
   * Check if the input element has failed validation.
   * @returns `true` if the input element has failed validation, `false` otherwise.
   * Example:
   * ```
   * const qvInput = new QvInput(inputElement);
   * if (qvInput.fails()) {
   *   console.log('Validation failed');
   * } else {
   *   console.log('Validation succeeded');
   * }
   * ```
   */
  fails(): boolean {
    return !this.valid();
  }
}
