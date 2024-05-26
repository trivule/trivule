import {
  greaterthan,
  integer,
  isNumber,
  lessthan,
  maxRule,
  minRule,
  modulo,
  numberBetween,
} from '../../src/rules/number';

test('minRule should return true when input is greater than or equal to min', () => {
  // Test with a string input
  expect(minRule('test', '3').passes).toBe(true);
  expect(minRule('test', '5').passes).toBe(false);
  // Test with a number input
  expect(minRule(5, '4').passes).toBe(true);
  expect(minRule(5, '6').passes).toBe(false);

  //undefinded and null

  expect(minRule(undefined, '4').passes).toBe(false);
  expect(minRule(null, '6').passes).toBe(false);
});

describe('maxRule', () => {
  test('should return true when input is a number and less than max', () => {
    expect(maxRule(5, '10').passes).toBe(true);
  });

  test('should return false when input is a number and greater than max', () => {
    expect(maxRule(10, '5').passes).toBe(false);
  });

  test('should return true when input is a string and length is less than or equal to max', () => {
    expect(maxRule('hello', '10').passes).toBe(true);
  });

  test('should return false when input is a string and length is greater than max', () => {
    expect(maxRule('hello world', '5').passes).toBe(false);
  });

  test('should return false when input is undefined', () => {
    expect(maxRule(undefined, '10').passes).toBe(true);
  });

  test('should return false when input is null', () => {
    expect(maxRule(null, '10').passes).toBe(true);
  });
});

describe('integer', () => {
  it('should return true for integer input', () => {
    expect(integer(42).passes).toBe(true);
    expect(integer(-100).passes).toBe(true);
    expect(integer(0).passes).toBe(true);
  });

  it('should return false for non-integer input', () => {
    expect(integer('42').passes).toBe(true);
    expect(integer('3.14').passes).toBe(false);
    expect(integer(true).passes).toBe(false);
    expect(integer(null).passes).toBe(false);
    expect(integer(undefined).passes).toBe(false);
  });
});

describe('number', () => {
  it('should return true for number input', () => {
    expect(isNumber(42).passes).toBe(true);
    expect(isNumber(-100).passes).toBe(true);
    expect(isNumber(0).passes).toBe(true);

    expect(isNumber('42').passes).toBe(true);
    expect(isNumber('-100').passes).toBe(true);
    expect(isNumber('0').passes).toBe(true);
  });

  it('should return false for number input', () => {
    expect(isNumber('').passes).toBe(false);
    expect(isNumber(undefined).passes).toBe(false);
    expect(isNumber(null).passes).toBe(false);
  });
});

describe('modulo', () => {
  test('should throw an error if the input is not integer', () => {
    expect(() => modulo(12, 'hello world')).toThrowError(
      'Modulo rule parameter must be an integer',
    );
  });

  test('should return true if the number input is a multiple of modulo', () => {
    expect(modulo(12, '4').passes).toBe(true);
  });

  test('should return false if the number input is not a multiple of modulo', () => {
    expect(modulo(13, '4').passes).toBe(false);
  });

  test('should return false if the number input is not a number', () => {
    expect(modulo('hello world', '4').passes).toBe(false);
  });
});

describe('lessthan Rule', () => {
  it('should return true when input is a number less than the threshold', () => {
    expect(lessthan(5, 10).passes).toBe(true);
    expect(lessthan(-5, 0).passes).toBe(true);
  });

  it('should return false when input is not a number', () => {
    expect(lessthan('abc', 10).passes).toBe(false);
    expect(lessthan(true, 5).passes).toBe(false);
  });

  it('should return false when input is a number greater than or equal to the threshold', () => {
    expect(lessthan(10, 10).passes).toBe(false);
    expect(lessthan(15, 10).passes).toBe(false);
  });

  it('should throw an error if threshold is not a number', () => {
    expect(() => lessthan(5, 'abc')).toThrowError(
      'Lessthan rule parameter must be a number',
    );
  });
});

describe('greaterthan Rule', () => {
  it('should return true when input is a number greater than the threshold', () => {
    expect(greaterthan(10, 5).passes).toBe(true);
    expect(greaterthan(0, -5).passes).toBe(true);
  });

  it('should return false when input is not a number', () => {
    expect(greaterthan('abc', 10).passes).toBe(false);
    expect(greaterthan(true, 5).passes).toBe(false);
  });

  it('should return false when input is a number less than or equal to the threshold', () => {
    expect(greaterthan(5, 5).passes).toBe(false);
    expect(greaterthan(-2, 0).passes).toBe(false);
  });

  it('should throw an error if threshold is not a number', () => {
    expect(() => greaterthan(5, 'abc')).toThrowError(
      'Greaterthan rule parameter must be a number',
    );
  });
});

describe('numberBetween', () => {
  it('Must passes if the input number is between the specified minimum and maximum values', () => {
    let input = '5';
    const params = '1,10';
    let result = numberBetween(input, params);
    expect(result.passes).toBe(true);

    input = '1';
    result = numberBetween(input, params);
    expect(result.passes).toBe(true);
    expect(result.value).toBe(1);
  });

  it('returns false if the input number is below the specified minimum value', () => {
    const input = '0';
    const params = '1,10';

    const result = numberBetween(input, params);
    expect(result.passes).toBe(false);
    expect(result.value).toBe(0);
  });

  it('returns false if the input number is above the specified maximum value', () => {
    const input = '15';
    const params = '1,10';

    const result = numberBetween(input, params);
    expect(result.passes).toBe(false);
  });

  it('returns false if the input is not a number', () => {
    // Define test inputs
    const input = 'not a number';
    const params = '1,10';

    const result = numberBetween(input, params);

    expect(result.passes).toBe(false);
    expect(result.value).toBe('not a number');
  });
});
