import { QValidation } from ".";
import { Rule } from "../contracts";

describe("Validation", () => {
  let validator: QValidation;

  beforeEach(() => {
    validator = new QValidation();
  });

  describe("validate", () => {
    it("should throw an error if rules parameter is not an array or a string", () => {
      expect(() => validator.validate({}, {} as any)).toThrow(
        "The rule provided must be an array of Rule"
      );
    });

    it("should throw an error if a rule is not defined in the rules bag", () => {
      expect(() => validator.validate({}, ["nonexistent"] as any)).toThrow(
        "The rule nonexistent is not defined"
      );
    });

    it("should add the rule name to errors array if validation fails", () => {
      validator.validate("", ["required"]);
      expect(validator.getErrors()).toContain("required");
    });

    it("should not add the rule name to errors array if validation succeeds", () => {
      validator.validate("abc", ["required", "string"]);
      expect(validator.getErrors()).toEqual([]);
    });
  });

  describe("hasError", () => {
    it("should return true if there are errors", () => {
      validator.validate("", ["required"]);
      expect(validator.hasErrors()).toBe(true);
    });

    it("should return false if there are no errors", () => {
      validator.validate("abc", ["required", "string"]);
      expect(validator.hasErrors()).toBe(false);
    });
  });

  describe("getRule", () => {
    it("should parse a rule with no parameters correctly", () => {
      const qv = new QValidation();
      const rule = "required";
      const expected = {
        ruleName: "required",
        params: undefined,
      };

      const result = qv.getRule(rule);

      expect(result).toEqual(expected);
    });

    it("should parse a rule with parameters correctly", () => {
      const qv = new QValidation();
      const rule = "min:8";
      const expected = {
        ruleName: "min",
        params: "8",
      };

      const result = qv.getRule(rule);

      expect(result).toEqual(expected);
    });

    it("should parse a rule with parameters correctly", () => {
      const qv = new QValidation();
      const rule = "between:8,10";
      const expected = {
        ruleName: "between",
        params: "8,10",
      };

      const result = qv.getRule(rule);

      expect(result).toEqual(expected);
    });

    it("should parse a 'in' rule with parameters correctly", () => {
      const qv = new QValidation();
      const rule = "in:active,pending,status" as Rule;
      const expected = {
        ruleName: "in",
        params: "active,pending,status",
      };

      const result = qv.getRule(rule);

      expect(result).toEqual(expected);
      expect(qv.validate("active", [rule])).toBe(true);
    });
  });
});
