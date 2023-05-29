import { contains, endWith, startWith, length } from ".";
import {
  email,
  maxlength,
  minlength,
  passwordRule,
  startWithLower,
  startWithUpper,
  url,
} from "./string";
//Email
describe("email rule", () => {
  test("should return true for valid email", () => {
    const validEmails = [
      "test@example.com",
      "test123@example.co.uk",
      "test+123@example.net",
      "test.123@example.io",
      "test-123@example.info",
    ];
    validEmails.forEach((em) => {
      expect(email(em)).toBe(true);
    });
  });

  test("should return false for invalid email", () => {
    const invalidEmails = [
      "",
      "test@",
      "test@example",
      "test@example.",
      "test@.com",
      "test@..com",
      "test@example..com",
      "test@ex ample.com",
    ];
    invalidEmails.forEach((em) => {
      expect(email(em)).toBe(false);
    });
  });
});
//minlength
describe("minlength rule", () => {
  it("should return false if input is undefined", () => {
    expect(minlength(undefined, "5")).toBe(false);
  });

  it("should return false if input is null", () => {
    expect(minlength(null, "5")).toBe(false);
  });

  it("should return false if input is an empty string", () => {
    expect(minlength("", "5")).toBe(false);
  });

  it("should return false if input is shorter than the minimum length", () => {
    expect(minlength("hello", "10")).toBe(false);
  });

  it("should return true if input is longer than the minimum length", () => {
    expect(minlength("hello world", "5")).toBe(true);
  });

  it("should return true if input is exactly the minimum length", () => {
    expect(minlength("hello", "5")).toBe(true);
  });
});

//maxlength
test("maxlength should return true for a string input shorter than the max length", () => {
  expect(maxlength("hello", "10")).toBe(true);
});

test("maxlength should return false for a string input longer than the max length", () => {
  expect(maxlength("Long string", "5")).toBe(false);
});

test("maxlength should return true for null or undefined input", () => {
  expect(maxlength(null, "0")).toBe(true);
  expect(maxlength(undefined, "0")).toBe(true);
});

describe("url validation", () => {
  test("should return true when given a valid url starting with http", () => {
    expect(url("http://www.example.com")).toBe(true);
  });

  test("should return true when given a valid url starting with https", () => {
    expect(url("https://www.example.com")).toBe(true);
  });

  test("should return true when given a valid url starting with ftp", () => {
    expect(url("ftp://ftp.example.com")).toBe(true);
  });

  test("should return false when given an invalid url", () => {
    expect(url("example.com")).toBe(false);
  });
});

describe("startWithUpper", () => {
  test("should return true if input starts with uppercase", () => {
    expect(startWithUpper("Hello")).toBe(true);
    expect(startWithUpper("A")).toBe(true);
    expect(startWithUpper("Test123")).toBe(true);
  });

  test("should return false if input does not start with uppercase", () => {
    expect(startWithUpper("hello")).toBe(false);
    expect(startWithUpper("1test")).toBe(false);
    expect(startWithUpper(" test")).toBe(false);
  });

  test("should return false for empty input", () => {
    expect(startWithUpper("")).toBe(false);
  });

  test("should return false for non-string input", () => {
    expect(startWithUpper(123)).toBe(false);
    expect(startWithUpper(null)).toBe(false);
    expect(startWithUpper(undefined)).toBe(false);
    expect(startWithUpper(true)).toBe(false);
  });
});

describe("startWithLower", () => {
  test("should return true for valid input", () => {
    expect(startWithLower("hello")).toBe(true);
    expect(startWithLower("world")).toBe(true);
    expect(startWithLower("a")).toBe(true);
  });

  test("should return false for invalid input", () => {
    expect(startWithLower("Hello")).toBe(false);
    expect(startWithLower("World")).toBe(false);
    expect(startWithLower("1")).toBe(false);
    expect(startWithLower(" ")).toBe(false);
    expect(startWithLower("")).toBe(false);
    expect(startWithLower(null)).toBe(false);
    expect(startWithLower(undefined)).toBe(false);
    expect(startWithLower(123)).toBe(false);
  });
});

describe("Password Rule", () => {
  it("should return true for valid password", () => {
    const password = "Abc12345@";
    const result = passwordRule(password);
    expect(result).toBe(true);
  });

  it("should return false for password with less than 8 characters", () => {
    const password = "Abc123@";
    const result = passwordRule(password);
    expect(result).toBe(false);
  });

  it("should return false for password without uppercase letter", () => {
    const password = "abc12345@";
    const result = passwordRule(password);
    expect(result).toBe(false);
  });

  it("should return false for password without lowercase letter", () => {
    const password = "ABC12345@";
    const result = passwordRule(password);
    expect(result).toBe(false);
  });

  it("should return false for password without digit", () => {
    const password = "Abcdefgh@";
    const result = passwordRule(password);
    expect(result).toBe(false);
  });

  it("should return false for password without special character", () => {
    const password = "Abc12345";
    const result = passwordRule(password);
    expect(result).toBe(false);
  });
});

describe("startWith function", () => {
  it("should return true if the input starts with the prefix", () => {
    const input = "hello world";
    const prefix = "hello";
    const result = startWith(input, prefix);
    expect(result).toBe(true);
  });

  it("should return false if the input does not start with the prefix", () => {
    const input = "hello world";
    const prefix = "world";
    const result = startWith(input, prefix);
    expect(result).toBe(false);
  });

  it("should return false if the input is not a string or an array", () => {
    const input = { foo: "bar" };
    const prefix = "foo";
    const result = startWith(input, prefix);
    expect(result).toBe(false);
  });
});

describe("endWith", () => {
  it("should return true if input string ends with suffix", () => {
    expect(endWith("hello world", "world")).toBe(true);
    expect(endWith("hello world!", "!")).toBe(true);
    expect(endWith("hello world", "ld")).toBe(true);
  });

  it("should return false if input string/array does not end with suffix", () => {
    expect(endWith("hello world", "hello")).toBe(false);
    expect(endWith("hello world", "wolrd")).toBe(false);
  });

  it("should return false if input is not a string or an array", () => {
    expect(endWith(123, "world")).toBe(false);
    expect(endWith(null, "world")).toBe(false);
    expect(endWith(undefined, "world")).toBe(false);
    expect(endWith({}, "world")).toBe(false);
  });
});
describe("contains", () => {
  it("should return true when input contains substring", () => {
    expect(contains("Hello, world!", "world")).toBe(true);
    expect(contains("Hello, world!", "world,!")).toBe(true);
    expect(contains("Hello, world!", "world,Others")).toBe(false);
  });

  it("should return false when input does not contain substring", () => {
    expect(contains("Hello, world!", "foo")).toBe(false);
  });

  it("should return false when input is not a string or an array", () => {
    expect(contains(42, "foo")).toBe(false);
    expect(contains("", "foo")).toBe(false);
    expect(contains(undefined, "foo")).toBe(false);
  });
});

describe("length", () => {
  it("should return true if specified length matches", () => {
    expect(length(12345, "5")).toBe(true);
  });

  it("should throw an error if size argument is not a number", () => {
    expect(() => length("hello", "invalid")).toThrow(
      "The length rule argument must be an integer"
    );
  });

  it("should return false for non-array input", () => {
    expect(length(null, "0")).toBe(false);
    expect(length(undefined, "0")).toBe(false);
    expect(length(true, "0")).toBe(false);
  });
});
