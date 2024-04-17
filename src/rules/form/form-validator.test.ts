import { FormValidator } from "./form-validator";

describe("FormValidator", () => {
  describe("same", () => {
    const form = document.createElement("form");
    const validator = new FormValidator(form);

    test("should return true if the input value is same as the specified field value", () => {
      const input = "foo";
      const fieldName = "bar";
      const fieldValue = "foo";

      form.innerHTML = `<input name="${fieldName}" value="${fieldValue}"/>`;
      const result = validator.same(input, fieldName);

      expect(result).toBe(true);
    });

    test("should return false if the input value is not same as the specified field value", () => {
      const input = "foo";
      const fieldName = "bar";
      const fieldValue = "baz";

      form.innerHTML = `<input name="${fieldName}" value="${fieldValue}"/>`;
      const result = validator.same(input, fieldName);

      expect(result).toBe(false);
    });

    test("should return false if no field name is specified", () => {
      const input = "foo";

      const result = validator.same(input);

      expect(result).toBe(false);
    });
  });

  describe("FormValidator - requiredIf", () => {
    let form: HTMLFormElement;
    let validator: FormValidator;

    beforeEach(() => {
      form = document.createElement("form");

      const input1 = document.createElement("input");
      input1.setAttribute("name", "input1");
      form.appendChild(input1);

      const input2 = document.createElement("input");
      input2.setAttribute("value", "");
      input2.setAttribute("name", "input2");
      form.appendChild(input2);

      const input3 = document.createElement("input");
      input3.setAttribute("name", "input3");
      form.appendChild(input3);

      validator = new FormValidator(form);
    });

    test("should return true when input is equal to one of input2 value", () => {
      const result = validator.requiredIf("", "input2,''");
      expect(result).toBe(true);
    });
  });
});
