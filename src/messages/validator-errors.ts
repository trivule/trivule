export class ValidationErrorMessage {
  constructor(private rules: string[], private messages: string[]) {
    this.compensateMessages();
    this.sanitizeMessage();
  }

  private compensateMessages(): void {
    const x = this.rules.length;
    // Vérifier si la longueur des messages et des règles est la même
    if (this.messages.length !== x) {
      // Pour chaque règle on cherche à correspondre son message
      for (let i = 0; i < this.rules.length; i++) {
        const indexes = this.convertAcoladeGroupToArray(this.messages[i] ?? "");
        for (const ii of indexes) {
          this.messages[ii] = this.messages[i];
        }
      }
    }
  }

  private sanitizeMessage() {
    const regex = /{(\d+(?:,\s*\d+)*)}/g;
    // Iterate through each message and replace the regex pattern with an empty string
    this.messages = this.messages.map((message) => message.replace(regex, ""));
  }

  /**
   * Va catuper {1,2...} et les transformer sous forme de tableau
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
