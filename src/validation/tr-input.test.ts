import { TrivuleInput } from "./tr-input";

describe("TrivuleInput", () => {
  describe("getRules", () => {
    test("should return an array of rules for a given input field", () => {
      // Arrange
      const inputElement = document.createElement("input"); // Create an input element
      inputElement.setAttribute("data-tr-rules", "required|min:30"); // Set rules for the input element
      const rules = [
        { name: "required", message: "This field is required" },
        {
          message: "The :field field must be greater than or equal to ':arg0'",
          name: "min",
          params: "30",
        },
      ];
      const validator = new TrivuleInput(inputElement);

      expect(
        validator.getRules().map((r) => {
          return { name: r.name, message: r.message, params: r.params };
        })
      ).toEqual(rules); // Assert that the result matches the expected rules array
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
      expect(validator.hasRules()).toBe(true);
    });

    test("should return false if rules are empty", () => {
      const inputElement = document.createElement("input");
      const validator = new TrivuleInput(inputElement);
      expect(validator.hasRules()).toBe(false); // Assert that the result is an empty array
    });
  });

  describe("getMessages", () => {
    test("should return  messages set via tr-messages", () => {
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
      const received = validator.getMessages();
      expect(received).toEqual({
        required: "Required message",
        min: "Min message",
      });
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
      expect(validator.getMessages()).toEqual({
        required: "Required message",
        min: "Invalid email address",
        max: "Invalid email address",
        email: "Invalid email address",
      });
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
      inputElement.type = "text";
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

  describe("setFeedbackElement", () => {
    const body = document.createElement("div");
    const inputElement = document.createElement("input");
    const feedbackElement = document.createElement("div");
    body.appendChild(inputElement);
    body.appendChild(feedbackElement);
    const validator = new TrivuleInput(inputElement);
    test("should return the feedback element supplied througth the set method", () => {
      validator.setFeedbackElement(feedbackElement);
      expect(validator.getFeedbackElement() === feedbackElement).toBe(true);
    });

    test("should return true if no feedback element found", () => {
      inputElement.name = "my-input";
      feedbackElement.setAttribute("data-tr-feedback", "my-input");
      validator.setFeedbackElement("no-select");

      expect(validator.getFeedbackElement() === null).toBe(true);
    });

    test("should return the feedback element supplied througth the attribute", () => {
      inputElement.name = "my-input";
      feedbackElement.setAttribute("data-tr-feedback", "my-input");
      validator.setFeedbackElement();

      expect(validator.getFeedbackElement() === feedbackElement).toBe(true);
    });
  });

  describe("Test messages assignment by imperative mode", () => {
    const body = document.createElement("div");
    const inputElement = document.createElement("input");
    body.appendChild(inputElement);
    const validator = new TrivuleInput(inputElement, {
      messages: "Please enter a valid data",
    });
  });
});
