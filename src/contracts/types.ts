import { RulesMessages } from ".";
import { Rule } from "./rule";

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
  | HTMLSelectElement
  | "select"
  | "textarea"
  | "input";

export type InputValueType =
  | string
  | Blob
  | File
  | number
  | null
  | boolean
  | undefined;

/**
 * An Element or null type
 */
export type ElementOrNull = HTMLElement | null;

/**
 * Indicates whether the message should be displayed
 */
export type WayDisplayError = "first" | "last" | "full";

/**
 * Input parameters that can be passed to QvInput instance instead of qv-attributes
 */
export type QvInputParms = {
  /**
   * The HTML element that will be used to display error messages for this input element.
   */
  feedbackElement?: ElementOrNull;
  /**
   * An array of rules that will be used to validate the input element.
   */
  rules?: Rule[] | string[];
  /**
   * An object that maps rule names to error messages.
   */
  messages?: string[];
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

  attribute?: string;

  failsOnfirst?: boolean;

  emitEvent?: boolean;
  errors?: RulesMessages;
};
