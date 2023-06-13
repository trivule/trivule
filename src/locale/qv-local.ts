import { Rule, RulesMessages } from "../contracts";
import { is_string } from "../rules";
import { en_messages } from "./lang/en";
import { fr_messages } from "./lang/fr";

export class QvLocal {
  private static _useLang: string | null = null;

  /**
   * Default local language
   */
  static DEFAULT_LANG = "en";

  static LANG = QvLocal.DEFAULT_LANG;

  private static _message: Record<string, RulesMessages> = {
    en: en_messages,
    fr: fr_messages,
  };

  /**
   * Get the messages for a specific language.
   * If the language is not provided, the default language is used.
   *
   * @param local The language code (optional)
   * @returns The messages object for the specified language
   */
  static getMessages(local?: string) {
    local = local ?? QvLocal.DEFAULT_LANG;
    let messages = QvLocal._message[local];
    if (!messages) {
      messages = QvLocal._message[QvLocal.DEFAULT_LANG];
    }
    return messages;
  }

  /**
   * Get the message for a specific rule and language.
   * If the language is not provided, the default language is used.
   *
   * @param rule The rule name or object
   * @param local The language code (optional)
   * @returns The message for the specified rule and language, or the default message if not found
   */
  static getRuleMessage(rule: string | Rule, local?: string) {
    const messages: Record<string | Rule, string> = QvLocal.getMessages(local);
    return messages[rule] ?? messages["default"];
  }

  /**
   * Add or update a message for a specific rule and language.
   * If the language is not provided, the default language is used.
   *
   * @param rule The rule name
   * @param message The new message
   * @param local The language code (optional)
   */
  static addMessage(rule: string, message?: string, local?: string) {
    if (message) {
      const messages = QvLocal.getMessages(local);
      messages[rule] = message;
      QvLocal.putMessages(messages, local);
    }
  }

  /**
   * Update the messages object for a specific language.
   * If the language is not provided, the default language is used.
   *
   * @param messages The updated messages object
   * @param local The language code (optional)
   */
  static putMessages(messages: RulesMessages, local?: string) {
    if (!messages || Object.keys(messages).length === 0) {
      throw new Error("The 'messages' argument must be a non-empty object");
    }

    local = local || QvLocal.DEFAULT_LANG;

    const existingMessages = QvLocal._message[local] || {};

    const mergedMessages = { ...existingMessages, ...messages };

    QvLocal._message[local] = mergedMessages;
  }

  /**
   * Translate the messages into a specific language.
   *
   * @param lang The target language code
   * @param messages The translated messages object
   */
  static translate(lang: string, messages: RulesMessages) {
    if (typeof lang !== "string" || !lang.length)
      throw new Error(
        "The first argument must be a string with one or more characters"
      );

    if (typeof messages !== "object" || typeof messages === undefined)
      throw new Error(
        "The second argument must be a valid key/value pair object"
      );

    QvLocal._message[lang] = { ...QvLocal.getMessages(lang), ...messages };
  }

  /**
   * Rewrite the message for a specific rule and language.
   * This is a shorthand method that calls `addMessage`.
   *
   * @param lang The language code
   * @param rule The rule name
   * @param message The new message
   */
  static rewrite(lang: string, rule: string | Rule, message: string) {
    QvLocal.addMessage(rule, message, lang);
  }

  /**
   * Rewrite multiple messages for a specific language.
   *
   * @param lang The language code
   * @param rules An array of rule names or objects
   * @param messages An array of new messages
   */
  static rewriteMany(
    lang: string,
    rules: string[] | Rule[],
    messages: string[]
  ) {
    if (typeof lang !== "string" || !lang.length)
      throw new Error(
        "The 'lang' argument must be a string with one or more characters"
      );

    if (!Array.isArray(rules) || !Array.isArray(messages))
      throw new Error("The 'rules' and 'messages' arguments must be arrays");

    if (rules.length !== messages.length)
      throw new Error(
        "The 'rules' and 'messages' arrays must have the same length"
      );

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const message = messages[i];
      QvLocal.rewrite(lang, rule, message);
    }
  }

  /**
   * Set the current translation language to be used for displaying error messages.
   * This method overrides all other methods of assigning the language for displaying error messages.
   *
   * @param lang The language code
   */
  static local(lang: string) {
    if (!is_string(lang) || !lang.length) {
      throw new Error("The language must be a valid string");
    }
    QvLocal._useLang = lang;
  }

  /**
   * Get the currently set translation language.
   * If no language is set, the default language is used.
   *
   * @returns The currently set language code
   */
  static getLocal() {
    return QvLocal._useLang ?? QvLocal.LANG;
  }
}
