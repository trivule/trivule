import { between } from ".";
import { integer, isNumber, maxRule, minRule } from "./number";

test("minRule should return true when input is greater than or equal to min", () => {
  // Test with a string input
  expect(minRule("test", "3")).toBe(true);
  expect(minRule("test", "5")).toBe(false);
  // Test with a number input
  expect(minRule(5, "4")).toBe(true);
  expect(minRule(5, "6")).toBe(false);

  //undefinded and null

  expect(minRule(undefined, "4")).toBe(false);
  expect(minRule(null, "6")).toBe(false);
});

describe("maxRule", () => {
  test("should return true when input is a number and less than max", () => {
    expect(maxRule(5, "10")).toBe(true);
  });

  test("should return false when input is a number and greater than max", () => {
    expect(maxRule(10, "5")).toBe(false);
  });

  test("should return true when input is a string and length is less than or equal to max", () => {
    expect(maxRule("hello", "10")).toBe(true);
  });

  test("should return false when input is a string and length is greater than max", () => {
    expect(maxRule("hello world", "5")).toBe(false);
  });

  test("should return false when input is undefined", () => {
    expect(maxRule(undefined, "10")).toBe(true);
  });

  test("should return false when input is null", () => {
    expect(maxRule(null, "10")).toBe(true);
  });
});

describe("integer", () => {
  it("should return true for integer input", () => {
    expect(integer(42)).toBe(true);
    expect(integer(-100)).toBe(true);
    expect(integer(0)).toBe(true);
  });

  it("should return false for non-integer input", () => {
    expect(integer("42")).toBe(true);
    expect(integer("3.14")).toBe(false);
    expect(integer(true)).toBe(false);
    expect(integer(null)).toBe(false);
    expect(integer(undefined)).toBe(false);
  });
});

describe("number", () => {
  it("should return true for number input", () => {
    expect(isNumber(42)).toBe(true);
    expect(isNumber(-100)).toBe(true);
    expect(isNumber(0)).toBe(true);

    expect(isNumber("42")).toBe(true);
    expect(isNumber("-100")).toBe(true);
    expect(isNumber("0")).toBe(true);
  });

  it("should return false for number input", () => {
    expect(isNumber("")).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(null)).toBe(false);
  });
});
