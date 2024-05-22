export class ArgumentParser {
  // For |
  private _pipe = '&pip;';
  // For space
  private _space = '&esp;';

  constructor(private argument: string) {}

  /**
   * Replace all occurrences of `_pipe` with `|` in the argument string.
   * @returns The argument string with pipes replaced.
   */
  replacePipes() {
    return this.argument.replace(new RegExp(this._pipe, 'g'), '|');
  }

  /**
   * Replace all occurrences of `_space` with a space character in the argument string.
   * @returns The argument string with spaces replaced.
   */
  replaceSpaces() {
    return this.argument.replace(new RegExp(this._space, 'g'), ' ');
  }
}
