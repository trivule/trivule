import { NativeValidation } from "./native-validation";

describe("NativeValidation", () => {
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    inputElement = document.createElement("input");
  });

  it("should correctly set the inputElement property when a valid HTMLInputElement is passed", () => {
    const validation = new NativeValidation(inputElement);
    expect(validation["inputElement"]).toBe(inputElement);
  });

  it("should get correctly all native rules applied on inputElement", () => {
    inputElement.setAttribute("required", "");
    inputElement.setAttribute("minlength", "8");

    const validation = new NativeValidation(inputElement);

    expect(validation["_appliedRules"]).toEqual(["required", "minlength:8"]);
  });

  it("should return an provided additional rules if no native rules are applied", () => {
    const validation = new NativeValidation(inputElement);
    const mergedRules = validation["merge"](["required", "int"]);
    expect(mergedRules).toEqual(["required", "int"]);
  });

  it("should correctly return native rules if no additional rules are provided", () => {
    inputElement.setAttribute("required", "");
    inputElement.setAttribute("minlength", "8");

    const validation = new NativeValidation(inputElement);
    const mergedRules = validation["merge"]([]);
    expect(mergedRules).toEqual(["required", "minlength:8"]);
  });

  it("should return merged rules correctly", () => {
    inputElement.setAttribute("required", "");
    inputElement.setAttribute("minlength", "8");

    const validation = new NativeValidation(inputElement);
    const mergedRules = validation["merge"](["email", "startWith:meshach"]);
    expect(mergedRules).toEqual([
      "required",
      "minlength:8",
      "email",
      "startWith:meshach",
    ]);
  });

  it("should effectively remove duplicates when merging", () => {
    inputElement.setAttribute("required", "");
    inputElement.setAttribute("minlength", "8");

    const validation = new NativeValidation(inputElement);
    const mergedRules = validation["merge"]([
      "email",
      "startWith:meshach",
      "minlength:5",
    ]);
    expect(mergedRules).toEqual([
      "required",
      "minlength:5",
      "email",
      "startWith:meshach",
    ]);
  });
});
