import { TrivuleInputParms } from "../contracts";
import { TrivuleForm } from "./tr-form";
import { TrivuleInput } from "./tr-input";

// Création d'une classe pour le formulaire
class MyForm {
  form: HTMLFormElement;
  nameInput: HTMLInputElement;
  ageInput: HTMLInputElement;
  birthDayInput: HTMLInputElement;
  languageSelect: HTMLSelectElement;
  messageTextarea: HTMLTextAreaElement;

  constructor() {
    this.form = document.createElement("form");

    this.nameInput = this.createInput("text", "name");
    this.nameInput.setAttribute("data-tr-rules", "required");
    this.ageInput = this.createInput("number", "age");
    this.birthDayInput = this.createInput("date", "birthDay");
    this.languageSelect = this.createSelect("language", [
      "English",
      "French",
      "Spanish",
    ]);
    this.messageTextarea = this.createTextarea("message");

    this.form.append(
      this.nameInput,
      this.ageInput,
      this.birthDayInput,
      this.languageSelect,
      this.messageTextarea
    );

    document.body.appendChild(this.form);
  }

  private createInput(type: string, name: string): HTMLInputElement {
    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    return input;
  }

  private createSelect(name: string, options: string[]): HTMLSelectElement {
    const select = document.createElement("select");
    select.name = name;
    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option.toLowerCase();
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });
    return select;
  }

  private createTextarea(name: string): HTMLTextAreaElement {
    const textarea = document.createElement("textarea");
    textarea.name = name;
    return textarea;
  }
}

// Instanciation du formulaire
const formInstance = new MyForm();

describe("TrivuleForm", () => {
  const trivuleForm = new TrivuleForm(formInstance.form);
  test("Test get method", () => {
    expect(trivuleForm.get("name")).toBeInstanceOf(TrivuleInput);
  });

  test("Test addTrivuleInput method", () => {
    const trInput = new TrivuleInput(formInstance.ageInput);
    trivuleForm.addTrivuleInput(trInput);
    expect(trivuleForm.get("age")).toBe(trInput);
  });

  test("Test the make method", () => {
    const trInput = new TrivuleInput(formInstance.ageInput);
    trivuleForm.addTrivuleInput(trInput);
    trivuleForm.make([
      {
        rules: "required|between:18,40",
        selector: formInstance.ageInput,
      },
      {
        rules: "required|date",
        selector: formInstance.birthDayInput,
      },
    ]);

    const birthDayInput = trivuleForm.get("birthDay");
    expect(birthDayInput?.is(formInstance.birthDayInput)).toBe(true);
    const ageInput = trivuleForm.get("age");
    expect(ageInput?.hasRule("between")).toBe(true);
  });
});
