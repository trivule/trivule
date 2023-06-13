import { Rule, RulesMessages } from "../contracts";
import { QvLocal } from "../locale/qv-local";
import { spliteParam } from "../utils";
/**
 * @author Claude Fassinou
 */
export class QvMessages {
  protected messages!: RulesMessages;

  constructor(local?: string) {
    this.messages = QvLocal.getMessages(local ?? QvLocal.getLocal());
  }
  /**

* Generates an array of messages for the given rules.
* Uses the predefined messages for each rule if available,
* otherwise, uses a default message of "The input value is not valid".
* @param rules - An array of rules for which to generate messages.
* @returns An array of messages corresponding to the provided rules.
*/
  getRulesMessages(rules: Rule[]): string[] {
    const messages: string[] = [];

    for (const rule of rules) {
      if (this.messages[rule]) {
        messages.push(this.messages[rule]);
      } else {
        messages.push("The input value is not valid");
      }
    }

    return messages;
  }

  parseMessage(
    attribute: string,
    rule: Rule,
    message: string,
    oParams: string
  ): string {
    const args = this._createParamObject(spliteParam(oParams ?? ""));

    args["field"] = attribute;
    message = this._replace(message, args);

    return message;
  }
  /**
   *
   * @param messages
   * @returns
   */
  setMessages(messages: RulesMessages) {
    this.messages = { ...this.messages, ...messages };
    return this;
  }

  private _replace(message: string, replacements: Record<string, any>) {
    for (const positionalAgrName in replacements) {
      if (
        Object.prototype.hasOwnProperty.call(replacements, positionalAgrName)
      ) {
        const argValue = replacements[positionalAgrName];
        message = message.replace(`:${positionalAgrName}`, argValue);
      }
    }
    // Remove the field from the replacements before inject them
    delete replacements["field"];
    return message.replace(/\.\.\.arg/, Object.values(replacements).join(", "));
  }

  private _createParamObject(params: any[]) {
    const args: Record<string, any> = {};
    for (let i = 0; i < params.length; i++) {
      const value = params[i];
      const argName = `arg${i}`;
      args[argName] = value;
    }
    return args;
  }
}
