import { RuleParam, ValidationState } from '../../contracts';
import { spliteParam } from '../../utils';
import { required } from '../global';
import { AbstractFormValidator } from './abstract-form-validator';

export class FormValidator extends AbstractFormValidator {
  constructor(form: HTMLElement) {
    super(form);
    this.register();
  }

  private register() {
    //Register  form rules
    this.formRules = [
      {
        ruleName: 'same',
        call: this.same,
      },
      {
        ruleName: 'requiredIf',
        call: this.requiredIf,
      },
      {
        ruleName: 'requiredWhen',
        call: this.requiredWhen,
      },
    ];
  }
  /**
   * Same rule
   * @param input
   * @param inputName
   * @returns
   */
  same(input: unknown, inputName?: RuleParam): ValidationState {
    if (inputName) {
      return {
        passes: input === this.getInpuTrValueByName(inputName.toString()),
        value: input,
      };
    }
    return {
      passes: false,
      value: input,
    };
  }

  /**
   * Required if rule
   * @param input
   * @param inputName
   * @param parameter
   * @returns
   */
  requiredIf(input: unknown, parameter?: string): ValidationState {
    const [inputName, ...params] = spliteParam(parameter ?? '');

    if (inputName && params.length > 0) {
      const otherInputralue = this.getInpuTrValueByName(inputName.toString());
      if (params.includes(otherInputralue)) {
        return required(input);
      }
      return {
        passes: true,
        value: input,
      };
    }

    return {
      passes: false,
      value: input,
    };
  }

  requiredWhen(input: unknown, parameter?: string) {
    const [inputName, ...params] = spliteParam(parameter ?? '');
    if (inputName && params.length > 0) {
      const isNotEmpty = params.some((name) => {
        return required(this.getInpuTrValueByName(name as string)).passes;
      });
      if (isNotEmpty) {
        return required(input);
      }
      return {
        passes: true,
        value: input,
      };
    }

    return {
      passes: false,
      value: input,
    };
  }
}
