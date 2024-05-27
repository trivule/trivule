import { TrivuleForm } from '../src/validation/tr-form';
import { TrivuleInput } from '../src/validation/tr-input';

class MyForm {
  form: HTMLFormElement;
  nameInput: HTMLInputElement;
  ageInput: HTMLInputElement;
  birthDayInput: HTMLInputElement;
  languageSelect: HTMLSelectElement;
  messageTextarea: HTMLTextAreaElement;

  constructor() {
    this.form = document.createElement('form');

    this.nameInput = this.createInput('text', 'name');
    this.nameInput.setAttribute('data-tr-rules', 'required');
    this.ageInput = this.createInput('number', 'age');
    this.birthDayInput = this.createInput('date', 'birthDay');
    this.languageSelect = this.createSelect('language', [
      'English',
      'French',
      'Spanish',
    ]);
    this.messageTextarea = this.createTextarea('message');

    this.form.append(
      this.nameInput,
      this.ageInput,
      this.birthDayInput,
      this.languageSelect,
      this.messageTextarea,
    );

    document.body.appendChild(this.form);
  }

  private createInput(type: string, name: string): HTMLInputElement {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    return input;
  }

  private createSelect(name: string, options: string[]): HTMLSelectElement {
    const select = document.createElement('select');
    select.name = name;
    options.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.toLowerCase();
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });
    return select;
  }

  private createTextarea(name: string): HTMLTextAreaElement {
    const textarea = document.createElement('textarea');
    textarea.name = name;
    return textarea;
  }
}

const formInstance = new MyForm();

describe('TrivuleForm', () => {
  const trivuleForm = new TrivuleForm(formInstance.form, {
    realTime: false,
  });
  test('Test get method', () => {
    expect(trivuleForm.get('name')).toBeInstanceOf(TrivuleInput);
  });

  test('Test addTrivuleInput method', () => {
    const trInput = new TrivuleInput(formInstance.ageInput);
    trivuleForm.addTrivuleInput(trInput);
    expect(trivuleForm.get('age')).toBe(trInput);
  });

  test('Test the make method', () => {
    const trInput = new TrivuleInput(formInstance.ageInput);
    trivuleForm.addTrivuleInput(trInput);
    trivuleForm
      .make([
        {
          rules: 'required|between:18,40',
          selector: 'age', //The input name
        },
        {
          rules: 'required|date',
          selector: formInstance.birthDayInput,
        },
      ])
      .make({
        message: {
          rules: 'required|only:string',
        },
      });

    const birthDayInput = trivuleForm.get('birthDay');
    expect(birthDayInput?.is(formInstance.birthDayInput)).toBe(true);
    const ageInput = trivuleForm.get('age');
    expect(ageInput?.hasRule('between')).toBe(true);
    const messageInput = trivuleForm.get('message');
    expect(messageInput?.hasRule('only')).toBe(true);
  });

  test('Test realTime feature', () => {
    trivuleForm.add({
      rules: 'required|between:18,40',
      selector: 'age', //The input name
    });
    expect(trivuleForm.isRealTimeEnabled()).toBe(false);
    const ageInput = trivuleForm.get('age');
    expect(ageInput?.isRealTimeEnabled()).toBe(false);
    trivuleForm.enableRealTime();
    expect(ageInput?.isRealTimeEnabled()).toBe(true);
  });
  describe('bind', () => {
    let trForm = new TrivuleForm();
    test('Should return null for the native element', () => {
      expect(trForm.getNativeElement()).toBeNull();
    });

    test('Should return the native element with ', () => {
      trForm = new TrivuleForm();
      trForm.bind(formInstance.form);
      expect(trForm.getNativeElement()).toBe(formInstance.form);
    });
    test('Should return the native element with config', () => {
      trForm = new TrivuleForm({
        element: formInstance.form,
        realTime: false,
      });
      expect(trForm.getNativeElement()).toBe(formInstance.form);
      expect(trForm.isRealTimeEnabled()).toBe(false);
    });
    test('Should resole inputs validations', () => {
      trForm = new TrivuleForm({
        realTime: false,
      });
      trForm.make([
        {
          rules: 'required|between:18,40',
          selector: 'age', //The input name
        },
        {
          rules: 'required|date',
          selector: formInstance.birthDayInput,
        },
      ]);
      trForm.bind(formInstance.form);
      expect(trForm.getNativeElement()).toBe(formInstance.form);
      expect(trForm.isRealTimeEnabled()).toBe(false);
    });
    test('Should return the native element', () => {
      trForm = new TrivuleForm(formInstance.form);
      expect(trForm.getNativeElement()).toBe(formInstance.form);
    });
  });

  describe('afterBinding && beforeBinding', () => {
    let form: TrivuleForm;

    beforeEach(() => {
      form = new TrivuleForm();
    });

    describe('afterBinding', () => {
      it('should register a callback for after binding', () => {
        const callback = jest.fn();
        form.afterBinding(callback);
        form.bind(formInstance.form);
        expect(callback).toHaveBeenCalled();
      });

      it('should allow method chaining', () => {
        const callback = jest.fn();
        const returnValue = form.afterBinding(callback);
        expect(returnValue).toBe(form);
      });
    });

    describe('beforeBinding', () => {
      it('should register a callback for before binding', () => {
        const callback = jest.fn();
        form.beforeBinding(callback);
        form.bind(formInstance.form);
        expect(callback).toHaveBeenCalled();
      });

      it('should allow method chaining', () => {
        const callback = jest.fn();
        const returnValue = form.beforeBinding(callback);
        expect(returnValue).toBe(form);
      });
    });
  });
});
