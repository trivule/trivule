import { Rule } from './rule';
export type ITrivuleInputCallback<P> = (param: P) => void;

/**
 * Configuration interface
 */
export interface ITrConfig {
  invalidClass?: string;
  validClass?: string;
  local?: {
    lang: string;
  };
  realTime?: boolean;
}

export type RuleParam = string | number | undefined;

export interface ITrivuleInputObject {
  value: InputValueType;
  name: string;
}
export type RuleType = {
  name: string;
  message?: string;
  params?: RuleParam;
  validate?: RuleCallBack;
};

export type InputType =
  | 'text'
  | 'date'
  | 'boolean'
  | 'number'
  | 'file'
  | 'date-local';
export type ValidationState = {
  passes: boolean;
  value: unknown;
  alias?: Rule;
  type?: InputType;
  message?: string[];
};
export interface ITrivuleInput {
  getMessageAttributeName(): string;
  hasRule(rule: Rule | string): boolean;
  prependRule(ule: {
    rule: string;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack;
    local?: string;
  }): this;
  appendRule(rule: {
    rule: string;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack;
    local?: string;
  }): this;
  insertBeforeRule(rule: {
    oldRule: string | Rule;
    newRule: string | Rule;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack | undefined;
    local?: string;
  }): this;
  insertAfterRule(rule: {
    oldRule: string | Rule;
    newRule: string | Rule;
    message?: string | null;
    param?: RuleParam;
    validate?: RuleCallBack | undefined;
    local?: string;
  }): this;
  getRules(): RuleType[];
}

/**
 * tr.input.validated event details
 */
export type InputEventDetails = {
  rules: Rule[];
  element: HTMLInputElement | HTMLTextAreaElement;
  input: Record<string, string>;
};

/**
 * Input change event
 */
export interface InputChangeEvent {
  details: InputEventDetails;
}

/**
 * Rule callback
 */
export interface RuleCallBack {
  (input: unknown, param?: RuleParam, type?: InputType): ValidationState;
}

export type RulesBag = {
  [ruleName in Rule]: RuleCallBack;
};

export type RulesMessages = {
  [key: string]: string;
};
import { TrivuleForm } from '../validation';

/**
 * Represents a CSS selector that can be either an HTMLElement or a string.
 * @typedef {HTMLElement | string} CssSelector
 */
export type CssSelector = HTMLElement | string;

/**
 * Represents a validatable HTML form input element.
 */
export type ValidatableInput =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLElement
  | HTMLSelectElement
  | 'select'
  | 'textarea'
  | 'input'
  | string;

/**
 * Represents a validatable HTML form element.
 */
export type ValidatableForm = HTMLElement | string | 'form';
/**
 * The possible input types expected to be gotten
 */
export type InputValueType =
  | string
  | Blob
  | File
  | number
  | null
  | boolean
  | undefined
  | FileList
  | File[]
  | Blob[]
  | Record<string, unknown>;

/**
 * An Element or null type
 */
export type ElementOrNull = HTMLElement | null;

/**
 * Indicates whether the message should be displayed
 */
export type WayDisplayError = 'first' | 'last' | 'full';

/**
 * Input parameters that can be passed to TrivuleInput instance
 */
export type TrivuleInputParms = {
  selector?: ValidatableInput | null;
  /**
   * The HTML element that will be used to display error messages for this input element.
   */
  feedbackElement?: CssSelector | null;
  /**
   * An array of rules that will be used to validate the input element.
   */
  rules?: Rule[] | string[] | Rule | string;
  /**
   * An object that maps rule names to error messages.
   */
  messages?: string[] | string | Record<string, string>;
  /**
   * The name of the input element.
   */
  name?: string;
  /**
   * The way that error messages will be displayed.
   */
  showMessage?: WayDisplayError;
  /**
   * An array of events that will trigger validation of the input element.
   */
  events?: string[];
  /**
   * Check if input will be validated when user tape into input
   */
  autoValidate?: boolean;

  /**
   * The attribute that will be used to display the error message instead of using the input name directly
   */
  attribute?: string;

  /**
   *If this field is true, the validation will stop at the first error. And will display the error at the same time
   */
  failsOnfirst?: boolean;
  /**
   * If this field is true, each time the validation has been performed,
   * a tr.input.validated event will be emitted, on which we can connect listeners for example
   */
  emitEvent?: boolean;

  /**
   * The css class that will be added to the input each time the form is valid
   */
  validClass?: string;

  /**
   * The css class that will be added to the input each time the form is invalid
   */
  invalidClass?: string;
  /**
   * Indicates input type
   */
  type?: string;

  realTime?: boolean;
};

/**
 * Callback function for handling events.
 *
 * @param event - The event object.
 */
export type EventCallback = (event: Event) => unknown;

/**
 * Callback function for handling events.
 *
 * @param details - The event object.
 */
export type EventCallbackWithDetails<T> = (details: T) => void;
export type TrivuleFormConfig = {
  /**
   * Specifies whether the form will be validated as the user types in the form fields
   */
  auto?: boolean;

  local?: {
    lang?: string;
  };
  /**
   * The css valid class  that will be added to all the input in  the form
   */
  validClass?: string;

  /**
   * The css invalid class that will be added to all the input in the form
   */
  invalidClass?: string;

  feedbackSelector?: string;
  realTime?: boolean;
};

export type TrivuleHooks = 'before.init' | 'after.init' | 'destroy' | string;

export type TrivuleFormHandler = (tr: TrivuleForm) => unknown;

export * from './rule';
