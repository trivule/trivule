import { QValidation, QvBag } from ".";
import { IQvConfig, Rule, RulesMessages } from "../contracts";
import { ValidationErrorMessage } from "../messages";
import { QvConfig } from "../qv.config";
import { getRule } from "../utils";

/**
 * @author Claude Fassinou
 */
export abstract class AbstractInputValidator {
  //Qv config
  protected config: IQvConfig = QvConfig;
  /** Input element which must be validate */
  protected inputElement!: HTMLInputElement;
  /** Error feedback element */
  protected feedbackElement: HTMLElement | null = null;

  /**
   * Rules list
   */
  protected rules: Rule[] = [];

  /**
   * Input messages
   */
  protected messages: RulesMessages = {} as any;

  /** Current input errors */
  protected _errors: string[] = [];

  /**
   * Input name
   */
  protected name = "";

  /**
   * How to show the message
   */
  protected showMessage = "first";

  protected showMessages = ["first", "full", "last"];

  /** Wich class assign to input if validation pass */
  protected validClass = "";

  /** Wich class assign to input if validation failed */
  protected invalidClass = "is-invalid";

  /**
   * Defaults event with trigge validat
   */
  protected events: string[] = ["blur", "input", "change"];

  constructor(
    selector: HTMLInputElement,
    config?: IQvConfig,
    protected emitEvent = true
  ) {
    this.setConfig(config);
    this.setInputElement(selector);
    this.setInputRules();
    this.setInputName();
    this.setFeedbackElement();
    this.setShowMessage();
    this.setInputValidationClass();

    this.getElementQvMessages();
    this.setEvent();
  }
  /**
   *Set input rules from input
   * @returns
   */
  protected setInputRules() {
    let ruleSrring: any = this.inputElement.dataset.qvRules ?? "";
    if (ruleSrring) {
      for (const rule of ruleSrring.split("|") as Rule[]) {
        if (QvBag.hasRule(getRule(rule).ruleName)) {
          this.rules.push(rule);
        } else {
          throw new Error(
            `The validation rule ${rule} is not supported by QuickV`
          );
        }
      }
    }
    return this;
  }

  abstract validate(): boolean;

  protected setEvent() {
    const ev = this.inputElement.dataset.qvEvents;

    if (ev) {
      this.events = ev.split("|");
    }
  }

  private setInputElement(inputElement: any) {
    if (!(inputElement instanceof HTMLElement)) {
      const el = document.querySelector(inputElement);
      if (el) {
        inputElement = el;
      }
    }

    if (!(inputElement instanceof HTMLElement)) {
      throw new Error(
        "The 'inputElement' parameter must be of type HTMLElement."
      );
    }

    this.inputElement = inputElement as HTMLInputElement;
  }

  private setInputName() {
    let name: string | undefined = this.inputElement.name;
    if (this.inputElement.dataset.qvName) {
      name = this.inputElement.dataset.qvName;
    }

    if (
      name === undefined ||
      name === null ||
      (typeof name === "string" && name.length < 0)
    ) {
      throw new Error("The input name could not be empty or null");
    }

    this.name = name;
  }

  set errors(value: any) {
    if (value) {
      this._errors = value[this.name] ?? [];
    }
    this.showErrorMessages();
  }

  /**
   * Searches for the closest HTML element with a custom data attribute "data-qv-feedback"
   * that is associated with the current input element, and stores a reference to it.
   *
   */
  private setFeedbackElement() {
    const inputElement = this.inputElement;

    let parentElement = inputElement.parentElement;
    let feedbackElement: HTMLElement | null = null;

    while (parentElement && !feedbackElement) {
      feedbackElement = parentElement.querySelector(
        `[data-qv-feedback='${this.name}']`
      );
      parentElement = parentElement.parentElement;
    }
    this.feedbackElement = feedbackElement;
  }

  /**
   * Shows error messages based on the value of the "qv-show" attribute
   * The "showMessage" property determines how the error messages are displayed.
   *
   */
  private showErrorMessages() {
    this.feedbackElement instanceof HTMLElement;

    //If feedback element existe
    if (this.feedbackElement instanceof HTMLElement) {
      let message = "";
      if (Array.isArray(this._errors)) {
        //Get error
        message = this._errors[0];
        if (this.showMessage == "full") {
          message = this._errors.join("<br>");
        } else if (this.showMessage == "last") {
          if (this._errors.length > 0) {
            message = this._errors[this._errors.length - 1];
          }
        }
      }
      this.feedbackElement.innerHTML = message ?? "";
    }
  }
  /**
   * Get and set the ways error message will be displayed
   */
  private setShowMessage() {
    this.showMessage = this.inputElement.dataset.qvShow ?? "first";
    this.showMessage = this.showMessages.includes(this.showMessage)
      ? this.showMessage
      : "first";
  }

  private setInputValidationClass() {
    //Set class from config
    this.invalidClass = this.config.invalidClass ?? "";
    this.validClass = this.config.validClass ?? "";

    //Overwrite class if they on attribute
    this.invalidClass =
      this.inputElement.dataset.qvInvalidClass ?? this.invalidClass;
    this.validClass = this.inputElement.dataset.qvValidClass ?? this.validClass;
  }

  protected setValidationClass(isValid: boolean) {
    const removeClass = (cls: string) => {
      if (cls.length > 0) {
        this.inputElement.classList.remove(cls);
      }
    };
    const addClass = (cls: string) => {
      if (cls.length > 0) {
        this.inputElement.classList.add(cls);
      }
    };

    if (isValid) {
      this.invalidClass.split(" ").forEach(removeClass);
      this.validClass.split(" ").forEach(addClass);
      this.inputElement.setAttribute("data-qv-valid", "1");
    } else {
      this.validClass.split(" ").forEach(removeClass);
      this.invalidClass.split(" ").forEach(addClass);
      this.inputElement.setAttribute("data-qv-valid", "0");
    }
  }

  private getElementQvMessages() {
    const elMessages = this.inputElement.dataset.qvMessages;
    let oms: RulesMessages = {} as any;
    for (let i = 0; i < this.rules.length; i++) {
      let messages =
        elMessages?.split("|").map((message) => message.trim()) ?? [];
      if (messages) {
        const vem = new ValidationErrorMessage(this.rules, messages);
        messages = vem.getMessages();
      }
      const customMessage = messages !== undefined ? messages[i] : "";
      const rule = new QValidation().getRule(this.rules[i]).ruleName;

      if (typeof customMessage == "string" && customMessage.length > 0) {
        oms[rule] = customMessage;
      } else {
        oms[rule] = QvBag.getMessage(rule);
      }
    }

    this.messages = oms;
  }

  getName() {
    return this.name;
  }
  getValue() {
    if (this.inputElement.type.toLowerCase() == "file") {
      return this.inputElement.files ? this.inputElement.files[0] : null;
    } else {
      return this.inputElement.value;
    }
  }
  protected setConfig(config?: IQvConfig) {
    this.config = QvConfig;
    if (config && typeof config === "object") {
      this.config = { ...this.config, ...config };
    }
  }
}
