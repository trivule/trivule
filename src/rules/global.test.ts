import {
  size,
  between,
  required,
  regex,
  inInput,
  only,
  minDigitRule,
  maxDigitRule,
  digitRule,
} from '.';

describe('required', () => {
  it('should return false for undefined input', () => {
    expect(required(undefined).passes).toBe(false);
  });

  it('should return false for null input', () => {
    expect(required(null).passes).toBe(false);
  });

  it('should return false for empty string input', () => {
    expect(required('').passes).toBe(false);
  });

  it('should return true for non-empty string input', () => {
    expect(required('hello').passes).toBe(true);
  });
});

describe('between rule', () => {
  it('should return true if the input is between min and max', () => {
    expect(
      between('2010-11-05 23:00', '2010-11-05 22:58,2010-11-06', 'date').passes,
    ).toBe(true); // date comparison
    expect(between('5', ' 5, 5', 'number').passes).toBe(true); // compare number
    expect(between('-5m', '0,4').passes).toBe(true); // compare string length
  });

  it('should return false if the input is not between min and max', () => {
    expect(between(5, '0,4', 'number').passes).toBe(false);
    expect(between(-5, '0,4', 'number').passes).toBe(false);
    expect(between('-5', '0,4', 'number').passes).toBe(false);
  });
});

describe('size', () => {
  it('should return true for a file with size less than or equal to the specified maxSize', () => {
    const file1 = new File(['test'], 'file1.txt', { type: 'text/plain' });

    // Test with maxSize in KB
    expect(size(file1, '1KB').passes).toBe(true);
  });

  it('should return true for a non-file input with length equal to the specified maxSize', () => {
    // Test with string input
    expect(size('test', '5').passes).toBe(false);
    expect(size('test', '4').passes).toBe(true);
  });

  it('should throw an error for an invalid maxSize format', () => {
    const file1 = new File(['test'], 'file1.txt', { type: 'text/plain' });

    // Test with invalid format
    expect(() => size(file1, '1XYZ').passes).toThrowError();
    expect(() => size(file1, '5').passes).toThrowError();
  });
});

describe('regex', () => {
  test('returns true if the input matches the regex pattern', () => {
    const pattern = '^[A-Z]+$';
    const input = 'ACB';
    expect(regex(input, pattern).passes).toBe(true);
  });

  test('returns true if the input matches the regex pattern with &pip;', () => {
    const pattern = '^(Js&pip;Ts)$'; // &pip; will be replaced with |
    const input = 'Js';
    expect(regex(input, pattern).passes).toBe(true);
  });

  test('returns false if the input does not match the regex pattern', () => {
    const pattern = '^[A-Za-z]$';
    const input = 'abc123';
    expect(regex(input, pattern).passes).toBe(false);
  });

  test('throws an error if an invalid regex string is provided', () => {
    const pattern = 'abc[';
    const input = 'abcdef';
    expect(() => {
      regex(input, pattern);
    }).toThrow();
  });
});

describe('inInput rule callback', () => {
  it('should return true if the input is in the list', () => {
    const input = 'active';
    const params = 'active, inactive, suspended';
    const result = inInput(input, params).passes;
    expect(result).toBe(true);
  });

  it('should return false if the input is not in the list', () => {
    const input = 'pending';
    const params = 'active, inactive, suspended';
    const result = inInput(input, params).passes;
    expect(result).toBe(false);
  });

  it('should throw an error if params argument is empty', () => {
    const input = 'active';
    const params = '';
    expect(() => inInput(input, params)).toThrow();
  });
});

describe('only', () => {
  test('should return true if input is a string without any number', () => {
    expect(only('Hello', 'string').passes).toBe(true);
    expect(only('*Tr-ivule#', 'string').passes).toBe(true);
  });

  test('should return false if input is a string with numbers', () => {
    expect(only('Hello123', 'string').passes).toBe(false);
    expect(only('Trivule123', 'string').passes).toBe(false);
  });

  test('should return false if input is not a string', () => {
    expect(only(123, 'string').passes).toBe(false);
    expect(only(null, 'string').passes).toBe(false);
    expect(only(undefined, 'string').passes).toBe(false);
    expect(only(true, 'string').passes).toBe(false);
  });

  test('should return true if input is a number', () => {
    expect(only(123, 'digit').passes).toBe(true);
    expect(only(0, 'digit').passes).toBe(true);
    expect(only('0098', 'digit').passes).toBe(true);
  });

  test('should return false if input is not a number', () => {
    expect(only('Hello', 'number').passes).toBe(false);
    expect(only(null, 'number').passes).toBe(false);
    expect(only(undefined, 'number').passes).toBe(false);
    expect(only(true, 'number').passes).toBe(false);
  });

  test('should return false for invalid parameter', () => {
    expect(only('Hello', 'invalid').passes).toBe(false);
    expect(only(123, 'invalid').passes).toBe(false);
  });
});

describe('min_digitRule', () => {
  it('should return true when input is a number with digits greater than or equal to minDigitCount', () => {
    expect(minDigitRule(12345, 5).passes).toBe(true);
    expect(minDigitRule(123, 3).passes).toBe(true);
    expect(minDigitRule(0, 1).passes).toBe(true);
  });

  it('should return false when input is not a number', () => {
    expect(minDigitRule('abc', 2).passes).toBe(false);
    expect(minDigitRule(true, 1).passes).toBe(false);
  });

  it('should return false when input is a number with digits less than minDigitCount', () => {
    expect(minDigitRule(123, 4).passes).toBe(false);
    expect(minDigitRule(5, 2).passes).toBe(false);
  });

  it('should throw an error if minDigitCount is not a number', () => {
    expect(() => minDigitRule(123, 'abc')).toThrowError(
      'Min_digit rule parameter must be a number',
    );
  });
});

describe('maxDigitRule', () => {
  it('should return true when input is a number with digits less than or equal to maxDigitCount', () => {
    expect(maxDigitRule(12345, 5).passes).toBe(true);
    expect(maxDigitRule(123, 3).passes).toBe(true);
    expect(maxDigitRule(0, 1).passes).toBe(true);
  });

  it('should return false when input is not a number', () => {
    expect(maxDigitRule('abc', 2).passes).toBe(false);
    expect(maxDigitRule(true, 1).passes).toBe(false);
  });

  it('should return false when input is a number with digits greater than maxDigitCount', () => {
    expect(maxDigitRule(123, 2).passes).toBe(false);
    expect(maxDigitRule(12345, 4).passes).toBe(false);
  });

  it('should throw an error if maxDigitCount is not a number', () => {
    expect(() => maxDigitRule(123, 'abc')).toThrowError(
      'Max_digit rule parameter must be a number',
    );
  });
});

describe('digitRule', () => {
  it('should return true when input is a number with digits equal to digitCount', () => {
    expect(digitRule(12345678, 8).passes).toBe(true);
    expect(digitRule(98765432, 8).passes).toBe(true);
    expect(digitRule(0, 1).passes).toBe(true);
  });

  it('should return false when input is not a number', () => {
    expect(digitRule('abc', 3).passes).toBe(false);
    expect(digitRule(true, 1).passes).toBe(false);
  });

  it('should return false when input is a number with digits not equal to digitCount', () => {
    expect(digitRule(123, 4).passes).toBe(false);
    expect(digitRule(12345, 6).passes).toBe(false);
  });

  it('should throw an error if digitCount is not a number', () => {
    expect(() => digitRule(123, 'abc')).toThrowError(
      'Digit rule parameter must be a number',
    );
  });
});
