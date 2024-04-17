import { TrivuleInput } from "./tr-input";

describe("TrivuleInput", () => {
  describe("getRules", () => {
    test("should return an array of rules for a given input field", () => {
      // Arrange
      const inputElement = document.createElement("input"); // Create an input element
      inputElement.setAttribute("data-tr-rules", "required|min:30"); // Set rules for the input element
      const rules = ["required", "min:30"];
      const validator = new TrivuleInput(inputElement);

      expect(validator.getRules()).toEqual(rules); // Assert that the result matches the expected rules array
    });

    test("should return an empty array if no rules are set for a given input field", () => {
      // Arrange
      const inputElement = document.createElement("input");
      const validator = new TrivuleInput(inputElement);

      // Act
      const result = validator.getRules(); // Call the getRules method

      // Assert
      expect(result).toEqual([]); // Assert that the result is an empty array
    });
  });

  describe("hasRules", () => {
    test("should return true if input have rules", () => {
      const inputElement = document.createElement("input"); // Create an input element
      inputElement.setAttribute("data-tr-rules", "required|min:30");
      const validator = new TrivuleInput(inputElement);

      expect(validator.hasRules()).toBe(true); // Assert that the result matches the expected rules array
    });

    test("should return false if rules are empty", () => {
      // Arrange
      const inputElement = document.createElement("input");
      const validator = new TrivuleInput(inputElement);

      expect(validator.hasRules()).toBe(false); // Assert that the result is an empty array
    });
  });

  describe("getMessages", () => {
    test("should return array of messages set via tr-messages", () => {
      const inputElement = document.createElement("input");
      inputElement.setAttribute("data-tr-rules", "required|min:30");
      inputElement.setAttribute(
        "data-tr-messages",
        "Required message | Min message"
      );
      const validator = new TrivuleInput(inputElement, {
        failsOnfirst: false,
      });
      validator.validate();

      expect(validator.getMessages()).toEqual([
        "Required message",
        "Min message",
      ]);
    });
    test("should return array of messages set via tr-messages with compensations messages", () => {
      const inputElement = document.createElement("input");
      inputElement.setAttribute(
        "data-tr-rules",
        "required|min:30|max:60|email"
      );
      inputElement.setAttribute(
        "data-tr-messages",
        "Required message | {1,2,3}Invalid email address"
      );
      const validator = new TrivuleInput(inputElement, {
        failsOnfirst: false,
      });

      validator.validate();
      expect(validator.getMessages()).toEqual([
        "Required message",
        "Invalid email address",
        "Invalid email address",
      ]);
    });

    test("should return false if rules are empty", () => {
      // Arrange
      const inputElement = document.createElement("input");
      const validator = new TrivuleInput(inputElement);

      expect(validator.hasRules()).toBe(false); // Assert that the result is an empty array
    });
  });
  describe("valid", () => {
    test("should return true if input is valid", () => {
      // Arrange
      const inputElement = document.createElement("input");
      inputElement.setAttribute(
        "data-tr-rules",
        "required|min:2|regex:^(Js&pip;Ts)$"
      );
      inputElement.value = "Js"; // Set the input value
      const validator = new TrivuleInput(inputElement);

      expect(validator.valid()).toBe(true); // Assert that the input is valid
    });

    test("should return false if input is invalid", () => {
      // Arrange
      const inputElement = document.createElement("input");
      inputElement.setAttribute("data-tr-rules", "required|min:3");
      inputElement.value = ""; // Set the input value to empty
      const validator = new TrivuleInput(inputElement);

      expect(validator.valid()).toBe(false); // Assert that the input is invalid
    });
  });

  describe("validate", () => {
    test("should return true if input is valid", () => {
      // Arrange
      const inputElement = document.createElement("input");
      inputElement.setAttribute("data-tr-rules", "required|min:3");
      inputElement.value = "test"; // Set the input value
      const validator = new TrivuleInput(inputElement);
      jest
        .spyOn(validator as any, "setralidationClass")
        .mockImplementation(() => {}); // Mock setralidationClass to prevent side effects
      jest
        .spyOn(validator as any, "emitChangeEvent")
        .mockImplementation(() => {}); // Mock emitChangeEvent to prevent side effects

      const result = validator.validate();

      expect(result).toBe(true); // Assert that the input is valid
    });

    test("should return false if input is invalid", () => {
      // Arrange
      const inputElement = document.createElement("input");
      inputElement.setAttribute("data-tr-rules", "required|min:3");
      inputElement.value = ""; // Set the input value to empty
      const validator = new TrivuleInput(inputElement);
      jest
        .spyOn(validator as any, "setralidationClass")
        .mockImplementation(() => {}); // Mock setralidationClass to prevent side effects
      jest
        .spyOn(validator as any, "emitChangeEvent")
        .mockImplementation(() => {}); // Mock emitChangeEvent to prevent side effects

      // Act
      const result = validator.validate();

      // Assert
      expect(result).toBe(false); // Assert that the input is invalid
    });
  });

  describe("getErrors", () => {
    test("should return error messages", () => {
      // Arrange
      const inputElement = document.createElement("input");
      inputElement.setAttribute("data-tr-rules", "required|min:3");
      inputElement.name = "input-name";
      inputElement.value = ""; // Set the input value to empty
      const validator = new TrivuleInput(inputElement, {
        failsOnfirst: false,
      });

      jest
        .spyOn(validator as any, "setralidationClass")
        .mockImplementation(() => {}); // Mock setralidationClass to prevent side effects
      jest
        .spyOn(validator as any, "emitChangeEvent")
        .mockImplementation(() => {}); // Mock emitChangeEvent to prevent side effects

      validator.validate();
      const result = validator.getErrors();

      expect(result).toEqual({
        required: "This field is required",
        min: "The minimum number of allowed characters is: 3",
      });
    });

    test("should return empty error messages", () => {
      // Arrange
      const inputElement = document.createElement("input");
      inputElement.setAttribute("data-tr-rules", "required|min:3");
      inputElement.type = "number";
      inputElement.name = "name-empty";
      inputElement.value = "4";
      const validator = new TrivuleInput(inputElement);

      jest
        .spyOn(validator as any, "setralidationClass")
        .mockImplementation(() => {}); // Mock setralidationClass to prevent side effects
      jest
        .spyOn(validator as any, "emitChangeEvent")
        .mockImplementation(() => {}); // Mock emitChangeEvent to prevent side effects

      validator.validate();
      const result = validator.getErrors();

      expect(result).toEqual({});
    });
  });
});
