import { TrValidation } from '.';
import {
  CssSelector,
  InputValueType,
  InputType,
  Rule,
  TrivuleInputParms,
  ValidatableInput,
} from '../contracts';
import { dataset_get, getHTMLElementBySelector, tr_attr_get } from '../utils';
import { InputRule } from './utils/input-rule';
import { TrParameter } from './utils/parameter';

export abstract class AbstractInputralidator {
  protected __wasInit = false;
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

  /** Current input errors */
  protected _errors: string[] = [];

  /**
   * How to show the message
   */
  protected showMessage = 'first';

  protected showMessages = ['first', 'full', 'last'];

  /** Wich class assign to input if validation pass */
  protected validClass = '';

  /** Wich class assign to input if validation failed */
  protected invalidClass = 'is-invalid';

  protected param: TrivuleInputParms = {
    emitEvent: true,
    autoValidate: true,
    failsOnfirst: true,
    validClass: '',
    invalidClass: 'is-invalid',
    type: 'text',
    realTime: true,
  };

  protected parameter: TrParameter;

  autoValidate = true;
  protected _value: InputValueType = undefined;
  private _emitOnValidate: boolean = true;

  protected _type: InputType = 'text';
  protected realTime: boolean = false;
  protected _events = ['change', 'blur', 'input'];
  constructor(
    selector?: ValidatableInput | TrivuleInputParms,
    params?: TrivuleInputParms,
    parameter?: TrParameter,
  ) {
    this.validator = new TrValidation();
    this.rules = new InputRule([]);
    this.parameter = parameter ?? new TrParameter();
    this._init(selector, params);
  }
  /**
   * Sets the validation rules for this Trivule input instance.
   * @param rules The validation rules to set.
   * @returns This Trivule input instance.
   */
  setRules(rules: Rule[] | string[] | Rule | string) {
    this.$rules.set(rules);
    return this;
  }

  abstract validate(): boolean;

  /**
   * Sets the event listeners for the input element.
   * This method determines which events will trigger the validation based on
   * the parameters provided or the attributes defined on the input element.
   *
   * @param events - An optional array of event names to be used for validation. If not provided, it will use the default or attribute-defined events.
   *
   * @example
   * // Setting custom events for validation
   * trivuleInput._setEvent(['focus', 'blur']);
   *
   * // Using attribute-defined events
   * const inputElement = document.querySelector('input[name="email"]');
   * inputElement.setAttribute('data-tr-events', 'input|change');
   * trivuleInput._setEvent();
   */

  protected _setEvent(events?: string[]) {
    const ev = tr_attr_get<string | undefined>(
      this.inputElement,
      'events',
      undefined,
    );

    if (ev) {
      events = ev.split('|').length ? ev.split('|') : this.param.events;
    }

    this.events = this.eventToArray(events ?? this.param.events);
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
        "The 'inputElement' parameter must be a valide 'ValidatableInput' type. " +
          `"${inputElement} provided"`,
      );
    }

    this.inputElement = inputElement as HTMLInputElement;
    this.param.type = this.inputElement.type;
    if (this.inputElement.tagName.toLowerCase() === 'textarea') {
      this.param.type = 'text';
    }

    return this;
  }

  get name() {
    return this.inputElement.name ?? this.param.name ?? '';
  }
  get value() {
    return this.getValue();
  }
  set value(value) {
    this._value = value;
    if (this.autoValidate) {
      this.validate();
    }
  }

  set errors(value: string[] | Record<string, string>) {
    if (value) {
      if (!Array.isArray(value)) {
        value = Object.keys(value).map(
          (k) => (value as Record<string, string>)[k],
        );
      }
      this._errors = value ?? [];
    }
    this.showErrorMessages();
  }

  /**
   * Sets the element used to display feedback messages for this input.
   * @param selector The CSS selector or element representing the feedback element.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setFeedbackElement(".feedback"); // Sets the feedback element using CSS selector ".feedback"
   */
  setFeedbackElement(selector?: CssSelector | null) {
    let feedbackElement: HTMLElement | null = null;
    if (selector instanceof HTMLElement) {
      feedbackElement = selector;
    } else {
      let parentElement = this.inputElement.parentElement;
      selector = selector ?? this.param.feedbackElement;
      selector = selector ?? this.parameter.getFeedbackSelector(this.name);

      do {
        feedbackElement = selector
          ? getHTMLElementBySelector(selector, parentElement)
          : feedbackElement;
        if (feedbackElement) {
          break;
        }
        parentElement = parentElement?.parentElement || null;
      } while (!!parentElement && !feedbackElement);
    }

    this.feedbackElement = feedbackElement;

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
      let message = '';
      if (Array.isArray(this._errors)) {
        message = this._errors[0];
        if (this.showMessage == 'full') {
          message = this._errors.join('<br>');
        } else if (this.showMessage == 'last') {
          if (this._errors.length > 0) {
            message = this._errors[this._errors.length - 1];
          }
        }
      }
      this.feedbackElement.innerHTML = message ?? '';
    }
  }
  /**
   * Get and set the ways error message will be displayed
   */
  private setShowMessage() {
    this.showMessage = tr_attr_get(this.inputElement, 'show', 'first');
    this.showMessage = this.showMessages.includes(this.showMessage)
      ? this.showMessage
      : 'first';
  }

  private _setTrValidationClass() {
    this.invalidClass = this.param.invalidClass ?? this.invalidClass;
    this.validClass = this.param.validClass ?? this.validClass;

    this.invalidClass = tr_attr_get(
      this.inputElement,
      'invalid-class',
      this.invalidClass,
    );
    this.validClass = tr_attr_get(
      this.inputElement,
      'valid-class',
      this.validClass,
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
      this.invalidClass.split(' ').forEach(removeClass);
      this.validClass.split(' ').forEach(addClass);
      this.inputElement.setAttribute('data-tr-valid', '1');
    } else {
      this.validClass.split(' ').forEach(removeClass);
      this.invalidClass.split(' ').forEach(addClass);
      this.inputElement.setAttribute('data-tr-valid', '0');
    }
  }

  /**
   * Retrieves the current name of the input element.
   * @returns
   */
  getName() {
    return this.name;
  }
  /**
   * Retrieves the current value of the input element.
   * This method handles different input types, such as 'file', and returns the appropriate value.
   *
   * @returns The value of the input element. For file inputs, it returns the selected files; for other inputs, it returns the element's value.
   *
   * @example
   * // Getting the value of a text input
   * const value = trivuleInput.getInputElemenyValue();
   *
   * // Getting the files of a file input
   * const files = fileInput.getInputElemenyValue();
   */
  getInputElemenyValue() {
    if (this.inputElement.type.toLowerCase() == 'file') {
      return this.inputElement.files ?? null;
    } else {
      return this.inputElement.value;
    }
  }

  /**
   * Retrieves the current value of the input element.
   * @returns
   */
  getValue() {
    return this.getInputElemenyValue();
  }
  /**
   * Sets the parameters for this Trivule input instance.
   * @param params The parameters to set.
   * @returns This Trivule input instance.
   */
  setParams(param?: TrivuleInputParms) {
    if (typeof param === 'object' && typeof param !== 'undefined') {
      this.param = { ...this.param, ...param };
    }
    const json = dataset_get(this.inputElement, 'tr', null, true);
    if (json) {
      this.param = Object.assign(this.param, json);
    }

    return this;
  }
  /**
   * Sets the attribute name used to identify feedback messages for this input.
   * @param attrName The name of the attribute used for feedback messages.
   * @returns This Trivule input instance.
   * @example
   * const trivuleInput = new TrivuleInput();
   * trivuleInput.setMessageAttributeName("data-feedback"); // Sets the feedback message attribute to "data-feedback"
   */
  setMessageAttributeName(attrName?: string): this {
    this.validator.attribute = attrName ?? this.name;
    return this;
  }

  /**
   * Initializes the Trivule input instance.
   * This method sets up the input element, parameters, feedback element,
   * validation rules, and event listeners for the input validation.
   *
   * @param selectorOrParams - Either a validatable input (e.g., a CSS selector or HTMLInputElement) or Trivule input parameters.
   * @param params - Additional Trivule input parameters.
   *
   * @example
   * // Initializing with a CSS selector and parameters
   * const trivuleInput = new TrivuleInput();
   * trivuleInput._init('#myInput', {
   *   realTime: false,
   *   feedbackSelector: '.invalid-feedback'
   * });
   *
   * // Initializing with an HTMLInputElement
   * const inputElement = document.querySelector('input[name="email"]');
   * trivuleInput._init(inputElement, {
   *   rules: ['required', 'email'],
   *   messages: { required: 'Email is required', email: 'Invalid email address' }
   * });
   *
   * @throws {Error} If the input element is not valid or cannot be found.
   */
  private _init(
    selectorOrParams?: ValidatableInput | TrivuleInputParms,
    params?: TrivuleInputParms,
  ) {
    let selector: unknown = selectorOrParams;
    if (
      typeof selectorOrParams === 'object' &&
      selectorOrParams !== null &&
      selectorOrParams !== undefined
    ) {
      if (!(selectorOrParams instanceof HTMLElement)) {
        params = selectorOrParams;
        params = selectorOrParams;
        selector = params.selector;
      }
    }

    if (!selector) {
      selector = params?.selector;
    }
    this.setInputElement(selector as ValidatableInput)
      .setParams(params)
      .setMessageAttributeName()
      .setFeedbackElement();
    this.setShowMessage();
    this._setTrValidationClass();

    this._setEvent(params?.events ?? this._events);

    //Set the validation rules
    const rules: string | string[] | Rule[] | undefined = tr_attr_get(
      this.inputElement,
      'rules',
      params?.rules,
    );
    if (rules) {
      const elMessages = tr_attr_get<string>(
        this.inputElement,
        'messages',
        this.param.messages,
      );
      this.rules.set(rules, elMessages);
    }

    this.validator.rules = this.rules;
    this.validator.failsOnFirst = params?.failsOnfirst ?? true;
    this._type = (params?.type ?? 'text') as InputType;
    this.realTime = params?.realTime ?? this.realTime;
  }
  /**
   * Get the name of the attribute that
   * will be displayed in the message instead of :field
   * @returns
   */
  getMessageAttributeName() {
    return this.validator.attribute;
  }
  /**
   * Retrieves the current rules messages.
   * @returns
   */
  get messages() {
    return this.rules.getMessages();
  }

  get emitOnValidate() {
    return this._emitOnValidate;
  }

  set emitOnValidate(value: boolean) {
    this._emitOnValidate = value;
  }
  set events(value: string[]) {
    this._events = value;
  }

  get events() {
    return this._events;
  }

  commit() {
    if (this._type !== 'file') {
      this.inputElement.value = this._value as string;
    }
  }

  protected eventToArray(value?: string | string[]) {
    let values: string[] = [];
    if (typeof value !== 'string') {
      if (!Array.isArray(value)) {
        return [];
      }
      values = value;
    }
    if (typeof value === 'string') {
      values = value.split('|');
    }
    return values.map((t: string) => t.trim());
  }

  get $rules() {
    return this.rules;
  }
}
