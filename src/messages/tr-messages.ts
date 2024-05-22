import { Rule, RuleParam, RulesMessages } from "../contracts";
import { TrLocal } from "../locale/tr-local";
import { spliteParam } from "../utils";

export class TrMessages {
  protected messages!: RulesMessages;

  constructor(local?: string) {
    this.messages = TrLocal.getMessages(local ?? TrLocal.getLocal());
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

  static parseMessage(
    attribute: string,
    rule: Rule,
    message: string,
    oParams: RuleParam
  ): string {
    const args = TrMessages._createParamObject(
      spliteParam(oParams?.toString() ?? "")
    );

    args["field"] = attribute;
    message = TrMessages._replace(message, args);

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

  static _replace(message: string, replacements: Record<string, RuleParam>) {
    for (const positionalAgrName in replacements) {
      if (
        Object.prototype.hasOwnProperty.call(replacements, positionalAgrName)
      ) {
        const argValue = replacements[positionalAgrName];
        if (argValue) {
          message = message.replace(
            `:${positionalAgrName}`,
            argValue.toString()
          );
        }
      }
    }
    // Remove the field from the replacements before inject them
    delete replacements["field"];
    return message.replace(/\.\.\.arg/, Object.values(replacements).join(", "));
  }

  static _createParamObject(params: RuleParam[]) {
    const args: Record<string, RuleParam> = {};
    for (let i = 0; i < params.length; i++) {
      const value = params[i];
      const argName = `arg${i}`;
      args[argName] = value;
    }
    return args;
  }
}
