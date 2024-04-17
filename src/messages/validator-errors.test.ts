import { ValidationErrorMessage } from "./validator-errors";

describe("ValidationErrorMessage", () => {
  describe("convertAcoladeGroupToArray", () => {
    it("should return an array of numbers contained in the acolade group", () => {
      const validationErrorMessage = new ValidationErrorMessage([], []);

      const result =
        validationErrorMessage.convertAcoladeGroupToArray("{0,1,2,3}");

      expect(result).toEqual([0, 1, 2, 3]);
    });

    it("should return an empty array if the acolade group is empty", () => {
      const validationErrorMessage = new ValidationErrorMessage([], []);

      const result = validationErrorMessage.convertAcoladeGroupToArray("{}");

      expect(result).toEqual([]);
    });

    it("should return an empty array if the acolade group is not well-formed", () => {
      const validationErrorMessage = new ValidationErrorMessage([], []);

      const result =
        validationErrorMessage.convertAcoladeGroupToArray("{0, 1, 2");

      expect(result).toEqual([]);
    });
  });

  describe("getMessages", () => {
    it("should return an array rules messages without any change", () => {
      const validationErrorMessage = new ValidationErrorMessage(
        ["required", "min"],
        ["Required message", "Min message"]
      );

      const result = validationErrorMessage.getMessages();

      expect(result).toEqual(["Required message", "Min message"]);
    });

    it("should return an empty array if the acolade group is empty", () => {
      const validationErrorMessage = new ValidationErrorMessage(
        ["required", "min", "max"],
        ["Required message", "{1,2}Invalid input"]
      );

      const result = validationErrorMessage.getMessages();

      expect(result).toEqual([
        "Required message",
        "Invalid input",
        "Invalid input",
      ]);
    });
  });
});
