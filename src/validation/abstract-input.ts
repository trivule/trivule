import { TrValidation, TrBag } from ".";
import { Rule, RulesMessages } from "../contracts";
import {
  CssSelector,
  TrivuleInputParms,
  ValidatableInput,
} from "../contracts/types";
import { TrLocal } from "../locale/tr-local";
import { ValidationErrorMessage } from "../messages";
import {
  dataset_get,
  getHTMLElementBySelector,
  getRule,
  tr_attr_get,
} from "../utils";
import { NativeValidation } from "./native-validation";
import { InputRule } from "./utils/input-rule";
import { TrParameter } from "./utils/parameter";

/**
 * @author Claude Fassinou
 */
export abstract class AbstractInputralidator {
  /**
   * This status indicates the current state of the form
   */
  protected _passed = false;
  /**
   * Trivule Validator
   */
  protected validator!: TrValidation;
  /** Input element which must be validate */
  protected inputElement!: HTMLInputElement;
  /** Error feedback element */
  protected feedbackElement: HTMLElement | null = null;

  /**
   * Rules list
   */
  protected rules!: InputRule;

  /**
   * Input messages
   */
  protected messages = {} as RulesMessages;

  /** Current input errors */
  protected _errors: string[] = [];

  /**
   * How to show the message
   */
  protected showMessage = "first";

  protected showMessages = ["first", "full", "last"];

  /** Wich class assign to input if validation pass */
  protected validClass = "";

  /** Wich class assign to input if validation failed */
  protected invalidClass = "is-invalid";

  protected param: TrivuleInputParms = {
    emitEvent: true,
    autoValidate: true,
    failsOnfirst: true,
    events: ["blur", "input", "change"],
    validClass: "",
    invalidClass: "is-invalid",
    type: "text",
  };

  protected parameter: TrParameter;

  constructor(
    selector: ValidatableInput,
    params?: TrivuleInputParms,
    parameter?: TrParameter
  ) {
    this.validator = new TrValidation(this.param);

    this.parameter = parameter ?? new TrParameter();
    this.rules = new InputRule([]);
    this.setInputElement(selector)
      .setParams(params)
      .setRules(params?.rules)
      .setMessageAttributeName()
      .setFeedbackElement();
    this.setShowMessage();
    this._setTrValidationClass();

    this._setErrors();
    this._setEvent(params?.events);
    this.validator.setParams(this.param);
  }
  /**
   *Set input rules from input
   * @returns
   */
  setRules(rules?: Rule[] | string[] | Rule | string) {
    let ruleSrring: any = tr_attr_get(
      this.inputElement,
      "rules",
      this.param.rules
    );

    if (ruleSrring) {
      this.rules.fromString(ruleSrring).merge(rules ?? []);
    }

    this.param.rules = this.rules.get();
    return this;
  }

  abstract validate(): boolean;

  protected _setEvent(events?: string[]) {
    const ev = tr_attr_get(this.inputElement, "events", "");

    if (ev) {
      this.param.events = ev.split("|").length
        ? ev.split("|")
        : this.param.events;
    }

    this.param.events = events ?? this.param.events;
  }

  /**
   * Sets the input element for validation.
   * This method should be called before calling the 'init' method.
   * @param {ValidatableInput} inputElement - The input element or selector string representing the input element.
   * @throws {Error} If the input element is not valid or cannot be found.
   */
  setInputElement(inputElement: ValidatableInput) {
    if (!(inputElement instanceof Element)) {
      const el = document.querySelector<HTMLElement>(inputElement);
      if (el) {
        inputElement = el as ValidatableInput;
      }
    }

    if (!(inputElement instanceof Element)) {
      throw new Error(
        "The 'inputElement' parameter must be valide 'ValidatableInput' type."
      );
    }

    this.inputElement = inputElement as HTMLInputElement;
    this.param.type = this.inputElement.type;
    if (this.inputElement.tagName.toLowerCase() === "textarea") {
      this.param.type = "text";
    }

    return this;
  }

  get name() {
    return this.inputElement.name ?? this.param.name ?? "";
  }

  set errors(value: any) {
    if (value) {
      this._errors = value ?? [];
    }
    this.showErrorMessages();
  }

  /**
   * Searches for the closest HTML element with a custom data attribute "data-tr-feedback"
   * that is associated with the current input element, and stores a reference to it.
   *
   */
  setFeedbackElement(selector?: CssSelector) {
    let feedbackElement: HTMLElement | null = null;
    if (!selector) {
      const inputElement = this.inputElement;

      let parentElement = inputElement.parentElement;
      let s = this.parameter.getFeedbackSelector(this.name);
      while (parentElement && !feedbackElement) {
        feedbackElement = !!s
          ? getHTMLElementBySelector(s, parentElement)
          : feedbackElement;
        if (!feedbackElement) {
          s = this.param.feedbackElement as any;
        }
        parentElement = parentElement.parentElement;
      }
      this.feedbackElement = feedbackElement;
    } else {
      this.feedbackElement = getHTMLElementBySelector(selector);
    }
    this.param.feedbackElement = this.param.feedbackElement ?? feedbackElement;

    return this;
  }

  /**
   * Shows error messages based on the value of the "tr-show" attribute
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
    this.showMessage = tr_attr_get(this.inputElement, "show", "first");
    this.showMessage = this.showMessages.includes(this.showMessage)
      ? this.showMessage
      : "first";
  }

  private _setTrValidationClass() {
    this.invalidClass = this.param.invalidClass ?? this.invalidClass;
    this.validClass = this.param.validClass ?? this.validClass;

    this.invalidClass = tr_attr_get(
      this.inputElement,
      "invalid-class",
      this.invalidClass
    );
    this.validClass = tr_attr_get(
      this.inputElement,
      "valid-class",
      this.validClass
    );
  }

  protected setralidationClass() {
    const isValid = this._passed;
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
      this.inputElement.setAttribute("data-tr-valid", "1");
    } else {
      this.validClass.split(" ").forEach(removeClass);
      this.invalidClass.split(" ").forEach(addClass);
      this.inputElement.setAttribute("data-tr-valid", "0");
    }
  }

  private _setErrors(errors?: RulesMessages) {
    const elMessages = tr_attr_get<string>(this.inputElement, "messages", "");
    let oms: RulesMessages = {} as any;
    for (let i = 0; i < this.rules.length; i++) {
      let messages =
        elMessages?.split("|").map((message) => message.trim()) ?? [];
      if (messages) {
        const vem = new ValidationErrorMessage(this.rules.get(), messages);
        messages = vem.getMessages();
      }
      const customMessage = messages !== undefined ? messages[i] : "";
      const rule = getRule(this.rules.atIndex(i)).ruleName;
      if (typeof customMessage == "string" && customMessage.length > 0) {
        oms[rule] = customMessage;
      } else {
        oms[rule] = TrLocal.getRuleMessage(rule, TrLocal.getLocal());
      }
    }

    if (
      typeof errors !== "undefined" &&
      typeof errors === "object" &&
      Object.values(errors).length > 0
    ) {
      this.param.errors = errors;
    } else {
      this.param.errors = oms;
    }
  }

  getName() {
    return this.name;
  }
  getValue() {
    if (this.inputElement.type.toLowerCase() == "file") {
      return this.inputElement.files ?? null;
    } else {
      return this.inputElement.value;
    }
  }

  setParams(param?: TrivuleInputParms) {
    if (typeof param === "object" && typeof param !== "undefined") {
      this.param = { ...this.param, ...param };
    }
    const json = dataset_get(this.inputElement, "tr", null, true);
    if (json) {
      this.param = Object.assign(this.param, json);
    }
    return this;
  }

  setMessageAttributeName(attrName?: string): this {
    this.param.attribute = attrName ?? this.name;
    return this;
  }
}
