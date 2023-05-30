import { Rule, RulesMessages } from "../contracts";
import { en_messages } from "./lang/en";
import { fr_messages } from "./lang/fr";

export class QvLocal {
  /**
   *Default local lang
   */
  static DEFAULT_LANG = "en";

  static LANG = QvLocal.DEFAULT_LANG;

  private static _message: Record<string, RulesMessages> = {
    en: en_messages,
    fr: fr_messages,
  };

  static getMessages(local?: string) {
    local = local ?? QvLocal.DEFAULT_LANG;
    let messages = QvLocal._message[local];
    if (!messages) {
      messages = QvLocal._message[QvLocal.DEFAULT_LANG];
    }
    return messages;
  }

  static getRuleMessage(rule: string | Rule, local?: string) {
    const messages: Record<string | Rule, string> = QvLocal.getMessages(local);
    return messages[rule] ?? messages["default"];
  }

  static addMessage(rule: string, message: string, local?: string) {
    const messages = QvLocal.getMessages(local);
    messages[rule] = message;
    QvLocal.putMessages(messages, local);
  }

  static putMessages(messages: RulesMessages, local?: string) {
    local = local || QvLocal.DEFAULT_LANG;
    QvLocal._message[local] = messages;
  }

  static translate(lang: string, messages: RulesMessages) {
    if (typeof lang !== "string" || !lang.length)
      throw new Error(
        "The first argument must be a string with one or more characters"
      );

    if (typeof messages !== "object" || typeof messages === undefined)
      throw new Error(
        "The second argument must be a valid key/value pair object"
      );
    QvLocal._message[lang] = messages;
  }
}
