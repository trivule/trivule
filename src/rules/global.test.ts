import { size, between, required, regex, inInput } from ".";

describe("required", () => {
  it("should return false for undefined input", () => {
    expect(required(undefined)).toBe(false);
  });

  it("should return false for null input", () => {
    expect(required(null)).toBe(false);
  });

  it("should return false for empty string input", () => {
    expect(required("")).toBe(false);
  });

  it("should return true for non-empty string input", () => {
    expect(required("hello")).toBe(true);
  });
});

describe("between rule", () => {
  it("should return true if the input is between min and max", () => {
    expect(between(5, "0, 10")).toBe(true);
    expect(between(0, "-5, 5")).toBe(true);
    expect(between(5, " 5, 5")).toBe(true);
    expect(between("5", " 5, 5")).toBe(true);
  });

  it("should return false if the input is not between min and max", () => {
    expect(between(5, "0,4")).toBe(false);
    expect(between(-5, "0,4")).toBe(false);
    expect(between("-5", "0,4")).toBe(false);
    expect(between("-5m", "0,4")).toBe(false);
  });
});

describe("size", () => {
  it("should return true for a file with size less than or equal to the specified maxSize", () => {
    const file1 = new File(["test"], "file1.txt", { type: "text/plain" });

    // Test with maxSize in KB
    expect(size(file1, "1KB")).toBe(true);
  });

  it("should return true for a non-file input with length equal to the specified maxSize", () => {
    // Test with string input
    expect(size("test", "5")).toBe(false);
    expect(size("test", "4")).toBe(true);
  });

  it("should throw an error for an invalid maxSize format", () => {
    const file1 = new File(["test"], "file1.txt", { type: "text/plain" });

    // Test with invalid format
    expect(() => size(file1, "1XYZ")).toThrowError();
    expect(() => size(file1, "5")).toThrowError();
  });
});

describe("regex", () => {
  test("returns true if the input matches the regex pattern", () => {
    const pattern = "^[A-Z]+$";
    const input = "ACB";
    expect(regex(input, pattern)).toBe(true);
  });

  test("returns false if the input does not match the regex pattern", () => {
    const pattern = "^[A-Za-z]$";
    const input = "abc123";
    expect(regex(input, pattern)).toBe(false);
  });

  test("throws an error if an invalid regex string is provided", () => {
    const pattern = "abc[";
    const input = "abcdef";
    expect(() => {
      regex(input, pattern);
    }).toThrow();
  });
});

describe("inInput rule callback", () => {
  it("should return true if the input is in the list", () => {
    const input = "active";
    const params = "active, inactive, suspended";
    const result = inInput(input, params);
    expect(result).toBe(true);
  });

  it("should return false if the input is not in the list", () => {
    const input = "pending";
    const params = "active, inactive, suspended";
    const result = inInput(input, params);
    expect(result).toBe(false);
  });

  it("should throw an error if params argument is empty", () => {
    const input = "active";
    const params = "";
    expect(() => inInput(input, params)).toThrow();
  });
});
