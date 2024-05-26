import { ArgumentParser } from '../../../src/validation/utils/argument-parser';

describe('ArgumentParser', () => {
  let argumentParser: ArgumentParser;

  beforeEach(() => {
    argumentParser = new ArgumentParser(
      'Hello&esp;world&pip;This&pip;is&esp;a&esp;test',
    );
  });

  describe('replacePipes', () => {
    it('should replace pipes in the argument string', () => {
      const result = argumentParser.replacePipes();
      expect(result).toEqual('Hello&esp;world|This|is&esp;a&esp;test');
    });
  });

  describe('replaceSpaces', () => {
    it('should replace spaces in the argument string', () => {
      const result = argumentParser.replaceSpaces();
      expect(result).toEqual('Hello world&pip;This&pip;is a test');
    });
  });
});
