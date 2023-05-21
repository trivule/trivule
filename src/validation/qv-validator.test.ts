import { Rule } from "../contracts/rule";
import { Qvalidator } from "./qv-validator";

describe("Validator", () => {
  let validator: Qvalidator;

  beforeEach(() => {
    validator = new Qvalidator();
  });

  describe("validate", () => {
    test("Qvalidator.make() should validate inputs correctly", () => {
      const rules = {
        age: ["required", "min:30"] as Rule[],
        email: ["required", "email", "startWith:email"] as Rule[],
      };
      const inputs = {
        age: 45,
        email: "email@gmail.com",
      };
      const validator = Qvalidator.make(rules, inputs);
      expect(validator.isValid()).toBe(true);
    });

    test("Qvalidator.make() should handle messages", () => {
      const rules = {
        age: ["required", "min:40", "contains:bed", "endWith:ol"] as Rule[],
      };
      const inputs = {
        age: "Must bed cool",
      };
      const validator = Qvalidator.make(rules, inputs);
      expect(validator.fails()).toBe(true);
      expect(validator.getMessages()).toEqual({
        age: ["The age field must be greater than or equal to '40'"],
      });
    });

    test("Qvalidator.make() should handle messages", () => {
      const rules = {
        status: ["required", "in:active,canceled,inactive"] as Rule[],
      };
      const inputs = {
        status: "failed",
      };
      const validator = Qvalidator.make(rules, inputs);
      expect(validator.fails()).toBe(true);
      expect(validator.getMessages()).toEqual({
        status: ["Please choose a correct value for the status field"],
      });
    });

    test("Qvalidator.valid() should validate input correctly", () => {
      const isValid = Qvalidator.valid("devp", [
        "required",
        "minlength:4",
      ] as Rule[]);
      expect(isValid).toBe(true);
    });
  });
});
