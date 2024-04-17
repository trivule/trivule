export class ValidationErrorMessage {
  constructor(private rules: string[], private messages: string[]) {
    this._compensateMessages();
    this._sanitizeMessage();
  }

  private _compensateMessages(): void {
    const x = this.rules.length;
    if (this.messages.length !== x) {
      for (let i = 0; i < this.rules.length; i++) {
        const indexes = this.convertAcoladeGroupToArray(this.messages[i] ?? "");
        for (const ii of indexes) {
          this.messages[ii] = this.messages[i];
        }
      }
    }
  }

  private _sanitizeMessage() {
    const regex = /{(\d+(?:,\s*\d+)*)}/g;
    // Iterate through each message and replace the regex pattern with an empty string
    this.messages = this.messages.map((message) => message.replace(regex, ""));
  }

  /**
   *
   * Go catuper {1,2...} and transform them into an array
   * @param str
   * @returns
   */
  convertAcoladeGroupToArray(str: string) {
    const regex = /{(\d+(?:,\s*\d+)*)}/g;
    const matches = [...str.matchAll(regex)].map((match) =>
      match[1].split(",").map((num) => parseInt(num.trim()))
    );
    return matches[0] ?? [];
  }
  getMessages() {
    return this.messages;
  }
}
