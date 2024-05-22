import { InputRule } from './input-rule';

describe('InputRule', () => {
  let inputRule: InputRule;

  beforeEach(() => {
    inputRule = new InputRule(['required', 'minlength:8'], {
      required: 'This field is required',
      minlength: 'This field must be at least 8 characters',
    });
  });

  it('should push a new rule', () => {
    inputRule.push('email');
    const received = inputRule.all().map((rule) => {
      return {
        name: rule.name,
        params: rule.params,
      };
    });

    expect(received).toEqual([
      {
        name: 'required',
        params: undefined,
      },
      {
        name: 'minlength',
        params: '8',
      },
      {
        name: 'email',
        params: undefined,
      },
    ]);
  });

  it('should format correctly the message', () => {
    inputRule.push('email').push('max');
    const messages = inputRule.all().map((rule) => {
      return rule.message;
    });

    expect(messages).toEqual([
      'This field is required',
      'This field must be at least 8 characters',
      'Please enter a valid email address',
      "The :field field must be less than or equal to ':arg0'",
    ]);
  });

  it('should remove a rule', () => {
    inputRule.remove('email').remove('minlength');
    const received = inputRule.all().map((rule) => {
      return {
        name: rule.name,
        params: rule.params,
      };
    });

    expect(received).toEqual([
      {
        name: 'required',
        params: undefined,
      },
    ]);
  });
  it('Should return the message', () => {
    inputRule.push('email', 'Email message');
    inputRule.set('max |file', 'Max message | File message');
    inputRule.set(['date', 'number'], ['Date message']);
    const messages = inputRule.getMessages();
    expect(messages).toEqual({
      required: 'This field is required',
      minlength: 'This field must be at least 8 characters',
      email: 'Email message',
      max: 'Max message',
      file: 'File message',
      date: 'Date message',
      number: 'This field must be a number', //original message
    });
  });
  it('should prepend a new rule at the beginning of the list', () => {
    inputRule.prepend('email');
    const received = inputRule.all().map((rule) => {
      return rule.name;
    });

    expect(received).toEqual(['email', 'required', 'minlength']);
  });

  it('should insert a new rule before the specified existing rule', () => {
    inputRule.insertBefore('required', 'email');
    const received = inputRule.all().map((rule) => {
      return rule.name;
    });

    expect(received).toEqual(['email', 'required', 'minlength']);
  });

  // Test pour la méthode insertAfter
  it('should insert a new rule after the specified existing rule', () => {
    inputRule.insertAfter('required', 'email'); //
    const received = inputRule.all().map((rule) => {
      return rule.name;
    });

    expect(received).toEqual(['required', 'email', 'minlength']);
  });

  it('should append a new rule', () => {
    inputRule.append('email');
    inputRule.append('minlength:9');
    const received = inputRule.all().map((rule) => {
      return {
        name: rule.name,
        params: rule.params,
      };
    });

    expect(received).toEqual([
      {
        name: 'required',
        params: undefined,
      },
      {
        name: 'email',
        params: undefined,
      },

      {
        name: 'minlength',
        params: '9',
      },
    ]);
  });
});
describe('replace', () => {
  it('should replace outgoing rule name with incoming rule name in the items array', () => {
    const inputRule = new InputRule(['required', 'minlength:8'], {
      required: 'This field is required',
      minlength: 'This field must be at least 8 characters',
    });

    inputRule.replace('required', 'email');
    const received = inputRule.all().map((rule) => {
      return {
        name: rule.name,
        params: rule.params,
      };
    });

    expect(received).toEqual([
      {
        name: 'email',
        params: undefined,
      },
      {
        name: 'minlength',
        params: '8',
      },
    ]);
  });

  it('should update message if it contains the outgoing rule name', () => {
    const inputRule = new InputRule(['required', 'minlength:8'], {
      required: 'This field is required',
      minlength: 'This field must be at least 8 characters',
    });

    // Call the replace method to replace 'required' with 'email'
    inputRule.replace('required', 'email');

    // Get the messages of all rules in the items array
    const messages = inputRule.all().map((rule) => {
      return rule.message;
    });

    expect(messages).toEqual([
      'Please enter a valid email address',
      'This field must be at least 8 characters',
    ]);
  });

  describe('assignMessage', () => {
    test('Should add a message to an existing rule', () => {
      const inputRule = new InputRule(['required', 'email'], {
        required: 'This field is required',
        email: 'Please enter a valid email address',
      });

      inputRule.assignMessage('required', 'This cannot be empty');

      const messages = inputRule.all().map((rule) => {
        return rule.message;
      });

      expect(messages).toEqual([
        'This cannot be empty',
        'Please enter a valid email address',
      ]);
    });
  });
});

describe('convertAcoladeGroupToArray', () => {
  it('should return an array of numbers contained in the acolade group', () => {
    const inputRule = new InputRule([], []);

    const result = inputRule.convertAcoladeGroupToArray('{0,1,2,3}');

    expect(result).toEqual([0, 1, 2, 3]);
  });

  it('should return an empty array if the acolade group is empty', () => {
    const inputRule = new InputRule([], []);

    const result = inputRule.convertAcoladeGroupToArray('{}');

    expect(result).toEqual([]);
  });

  it('should return an empty array if the acolade group is not well-formed', () => {
    const inputRule = new InputRule([], []);

    const result = inputRule.convertAcoladeGroupToArray('{0, 1, 2');

    expect(result).toEqual([]);
  });
});
