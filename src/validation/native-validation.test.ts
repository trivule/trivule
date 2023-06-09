import { NativeValidation } from "./native-validation";

describe("NativeValidation", () => {
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    inputElement = document.createElement("input");
  });

  /* afterEach(() => {
    inputElement = null;
  }); */

  it("should throw an error if inputElement parameter is not of type HTMLInputElement", () => {
    expect(() => {
      new NativeValidation("non-existing-element");
    }).toThrowError(
      "The 'inputElement' parameter must be of type HTMLInputElement."
    );
  });

  it("should correctly set the inputElement property when a valid HTMLInputElement is passed", () => {
    const validation = new NativeValidation(inputElement);
    expect(validation["inputElement"]).toBe(inputElement);
  });

  it("should correctly set the inputElement property when a valid selector string is passed", () => {
    document.body.appendChild(inputElement);

    inputElement.setAttribute("id", "inputId");

    const validation = new NativeValidation("#inputId");
    expect(validation["inputElement"]).toBe(inputElement);
  });

  it("should return an empty string if no native rules are applied", () => {
    const validation = new NativeValidation(inputElement);
    const mergedRules = validation["merge"]();
    expect(mergedRules).toBe("");
  });

  it("should merge native rules correctly", () => {
    inputElement.setAttribute("required", "");
    inputElement.setAttribute("maxlength", "10");

    const validation = new NativeValidation(inputElement);
    const mergedRules = validation["merge"]();
    expect(mergedRules).toBe("required|maxlength:10");
  });
});
