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
}
