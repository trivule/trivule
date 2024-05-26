import { contains, endWith, startWith, length } from '../../src/rules';
import {
  email,
  excludes,
  maxlength,
  minlength,
  passwordRule,
  startWithString,
  endWithString,
  startWithLower,
  startWithUpper,
  stringBetween,
  url,
} from '../../src/rules/string';
//Email
describe('email rule', () => {
  test('should return true for valid email', () => {
    const validEmails = [
      'test@example.com',
      'test123@example.co.uk',
      'test+123@example.net',
      'test.123@example.io',
      'test-123@example.info',
    ];
    validEmails.forEach((em) => {
      expect(email(em).passes).toBe(true);
    });
  });

  test('should return false for invalid email', () => {
    const invalidEmails = [
      '',
      'test@',
      'test@example',
      'test@example.',
      'test@.com',
      'test@..com',
      'test@example..com',
      'test@ex ample.com',
    ];
    invalidEmails.forEach((em) => {
      expect(email(em).passes).toBe(false);
    });
  });
});
//minlength
describe('minlength rule', () => {
  it('should return false if input is undefined', () => {
    expect(minlength(undefined, '5').passes).toBe(false);
  });

  it('should return false if input is null', () => {
    expect(minlength(null, '5').passes).toBe(false);
  });

  it('should return false if input is an empty string', () => {
    expect(minlength('', '5').passes).toBe(false);
  });

  it('should return false if input is shorter than the minimum length', () => {
    expect(minlength('hello', '10').passes).toBe(false);
  });

  it('should return true if input is longer than the minimum length', () => {
    expect(minlength('hello world', '5').passes).toBe(true);
  });

  it('should return true if input is exactly the minimum length', () => {
    expect(minlength('hello', '5').passes).toBe(true);
  });
});

//maxlength
test('maxlength should return true for a string input shorter than the max length', () => {
  expect(maxlength('hello', '10').passes).toBe(true);
});

test('maxlength should return false for a string input longer than the max length', () => {
  expect(maxlength('Long string', '5').passes).toBe(false);
});

test('maxlength should return true for null or undefined input', () => {
  expect(maxlength(null, '0').passes).toBe(true);
  expect(maxlength(undefined, '0').passes).toBe(true);
});

describe('url validation', () => {
  test('should return true when given a valid url starting with http', () => {
    expect(url('http://www.example.com').passes).toBe(true);
  });

  test('should return true when given a valid url starting with https', () => {
    expect(url('https://www.example.com').passes).toBe(true);
  });

  test('should return true when given a valid url starting with ftp', () => {
    expect(url('ftp://ftp.example.com').passes).toBe(true);
  });

  test('should return false when given an invalid url', () => {
    expect(url('example.com').passes).toBe(false);
  });
});

describe('startWithUpper', () => {
  test('should return true if input starts with uppercase', () => {
    expect(startWithUpper('Hello').passes).toBe(true);
    expect(startWithUpper('A').passes).toBe(true);
    expect(startWithUpper('Test123').passes).toBe(true);
  });

  test('should return false if input does not start with uppercase', () => {
    expect(startWithUpper('hello').passes).toBe(false);
    expect(startWithUpper('1test').passes).toBe(false);
    expect(startWithUpper(' test').passes).toBe(false);
  });

  test('should return false for empty input', () => {
    expect(startWithUpper('').passes).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(startWithUpper(123).passes).toBe(false);
    expect(startWithUpper(null).passes).toBe(false);
    expect(startWithUpper(undefined).passes).toBe(false);
    expect(startWithUpper(true).passes).toBe(false);
  });
});

describe('startWithString', () => {
  test('should return true if input starts with letter', () => {
    expect(startWithString('Hello').passes).toBe(true);
    expect(startWithString('-test').passes).toBe(true);
  });

  test('should return false if input does not start with letter', () => {
    expect(startWithString('1hello').passes).toBe(false);
    expect(startWithString(' test').passes).toBe(false);
  });

  test('should return false for empty input', () => {
    expect(startWithString('').passes).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(startWithString(123).passes).toBe(false);
    expect(startWithString(null).passes).toBe(false);
    expect(startWithString(undefined).passes).toBe(false);
    expect(startWithString(true).passes).toBe(false);
  });
});

describe('endWithString', () => {
  test('should return true if input ends with letter', () => {
    expect(endWithString('Hello').passes).toBe(true);
  });

  test('should return false if input does not end with letter', () => {
    expect(startWithUpper('hello1').passes).toBe(false);
    expect(startWithUpper('test-').passes).toBe(false);
    expect(startWithUpper('test ').passes).toBe(false);
  });

  test('should return false for empty input', () => {
    expect(endWithString('').passes).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(endWithString(123).passes).toBe(false);
    expect(endWithString(null).passes).toBe(false);
    expect(endWithString(undefined).passes).toBe(false);
    expect(endWithString(true).passes).toBe(false);
  });
});

describe('startWithLower', () => {
  test('should return true for valid input', () => {
    expect(startWithLower('hello').passes).toBe(true);
    expect(startWithLower('world').passes).toBe(true);
    expect(startWithLower('*').passes).toBe(true);
    expect(startWithLower('1').passes).toBe(true);
  });

  test('should return false for invalid input', () => {
    expect(startWithLower('Hello').passes).toBe(false);
    expect(startWithLower('World').passes).toBe(false);
    expect(startWithLower(' ').passes).toBe(false);
    expect(startWithLower('').passes).toBe(false);
    expect(startWithLower(null).passes).toBe(false);
    expect(startWithLower(undefined).passes).toBe(false);
    expect(startWithLower(123).passes).toBe(false);
  });
});

describe('Password Rule', () => {
  it('should return true for valid password', () => {
    const password = 'Abc12345@';
    const result = passwordRule(password).passes;
    expect(result).toBe(true);
  });

  it('should return false for password with less than 8 characters', () => {
    const password = 'Abc123@';
    const result = passwordRule(password).passes;
    expect(result).toBe(false);
  });

  it('should return false for password without uppercase letter', () => {
    const password = 'abc12345@';
    const result = passwordRule(password).passes;
    expect(result).toBe(false);
  });

  it('should return false for password without lowercase letter', () => {
    const password = 'ABC12345@';
    const result = passwordRule(password).passes;
    expect(result).toBe(false);
  });

  it('should return false for password without digit', () => {
    const password = 'Abcdefgh@';
    const result = passwordRule(password).passes;
    expect(result).toBe(false);
  });

  it('should return false for password without special character', () => {
    const password = 'Abc12345';
    const result = passwordRule(password).passes;
    expect(result).toBe(false);
  });
});

describe('startWith function', () => {
  it('should return true if the input starts with the prefix', () => {
    const input = 'hello world';
    const prefix = 'hello';
    const result = startWith(input, prefix).passes;
    expect(result).toBe(true);
  });

  it('should return false if the input does not start with the prefix', () => {
    const input = 'hello world';
    const prefix = 'world';
    const result = startWith(input, prefix).passes;
    expect(result).toBe(false);
  });

  it('should return false if the input is not a string or an array', () => {
    const input = { foo: 'bar' };
    const prefix = 'foo';
    const result = startWith(input, prefix).passes;
    expect(result).toBe(false);
  });
});

describe('endWith', () => {
  it('should return true if input string ends with suffix', () => {
    expect(endWith('hello world', 'world').passes).toBe(true);
    expect(endWith('hello world!', '!').passes).toBe(true);
    expect(endWith('hello world', 'ld').passes).toBe(true);
  });

  it('should return false if input string/array does not end with suffix', () => {
    expect(endWith('hello world', 'hello').passes).toBe(false);
    expect(endWith('hello world', 'wolrd').passes).toBe(false);
  });

  it('should return false if input is not a string or an array', () => {
    expect(endWith(123, 'world').passes).toBe(false);
    expect(endWith(null, 'world').passes).toBe(false);
    expect(endWith(undefined, 'world').passes).toBe(false);
    expect(endWith({}, 'world').passes).toBe(false);
  });
});
describe('contains', () => {
  it('should return true when input contains substring', () => {
    expect(contains('Hello, world!', 'world').passes).toBe(true);
    expect(contains('Hello, world!', 'world,!').passes).toBe(true);
    expect(contains('Hello, world!', 'world,Others').passes).toBe(false);
  });

  it('should return false when input does not contain substring', () => {
    expect(contains('Hello, world!', 'foo').passes).toBe(false);
  });

  it('should return false when input is not a string or an array', () => {
    expect(contains(42, 'foo').passes).toBe(false);
    expect(contains('', 'foo').passes).toBe(false);
    expect(contains(undefined, 'foo').passes).toBe(false);
  });
});
describe('excludes', () => {
  it('should return true when input excludes substring', () => {
    expect(excludes('Hello, world!', 'sworld').passes).toBe(true);
  });

  it('should return false when input does not excludes substring', () => {
    expect(excludes('Hello, world! foo', 'foo').passes).toBe(false);
    expect(excludes('Hello, world! foo', '&esp;').passes).toBe(false);
  });

  it('should return true when input is not a string or an array', () => {
    expect(excludes(42, 'foo').passes).toBe(true);
    expect(excludes('', '&esp;').passes).toBe(true);
    expect(excludes(undefined, 'foo').passes).toBe(true);
  });
});
describe('length', () => {
  it('should return true if specified length matches', () => {
    expect(length(null, '0').passes).toBe(false);
    expect(length(undefined, '0').passes).toBe(false);
    expect(length(12345, '5').passes).toBe(true);
  });

  it('should throw an error if size argument is not a number', () => {
    expect(() => length('hello', 'invalid')).toThrow(
      'The length rule argument must be an integer',
    );
  });

  it('should return false for invalid input', () => {
    expect(length(true, '0').passes).toBe(false);
  });
});
describe('stringBetween', () => {
  it('should return true for string with length between min and max', () => {
    const result1 = stringBetween('hello', '2, 5').passes;
    expect(result1).toBe(true);
  });

  it('should return false for string with length not between min and max', () => {
    const result2 = stringBetween('hello', '6, 10').passes;
    expect(result2).toBe(false);
  });
});
