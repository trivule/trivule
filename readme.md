# Trivule

Trivule is a powerful, user-friendly JavaScript library designed to simplify form validation for developers. It is a ready-to-integrate solution for modern framworks.

To get started with Trivule, please refer to the comprehensive documentation available [here](https://www.trivule.com). You can also follow a quick tutorial of less than 5 minutes [here](https://trivule.com/docs/tuto) to familiarize yourself with Trivule.

## Key Features

**Imperative Validation Approach**

```js
const trivuleForm = new TrivuleForm('form', {
  feedbackSelector: '.invalid-feedback',
  realTime: true,
});

trivuleForm.make({
  email: {
    rules: ['required', 'email', 'maxlength:60'],
    feedbackElement: '.invalid-feedback',
  },
});

trivuleForm
  .get('email')
  .appendRule({
    rule: 'endWith:@gmail.com',
  })
  .removeRule('maxlength');
```

- **Streamlined Validation**: Implement complex validation rules without the hassle. Trivule simplifies your workflow, allowing you to focus on building better user experiences.
- **Time-Saving**: With Trivule, save valuable time that you can invest in other critical aspects of your project.
- **Dynamic Conditional Validation**: Adapt to user inputs in real-time, providing dynamic responses and validations as conditions change.
- **Framework Compatibility**: Seamlessly integrate with modern frameworks using a consistent interface

**Declarative Validation Approach**

```html
<input name="email" type="text" data-tr-rules="required|email|maxlength:60" />
<div data-tr-feedback="email" class="invalid-feedback"></div>
```

- **HTML/CSS-Based Validation**: Perfect for quickly setting up validations using just HTML and CSS. Ideal for projects where simplicity and speed are key.
- **Time Efficiency**: Minimize the time spent on scripting validations. Set up once, and let Trivule handle the rest.
- **Intuitive Syntax**: User-friendly attributes make implementing validation rules straightforward, even for those with minimal coding experience.
- **Conditional Validation Ready**: Easily set up conditions for your validations to handle complex scenarios with ease.

**Error Messaging & Localization**

```js
trivuleForm.make({
  email: {
    rules: ['required', 'email', 'maxlength:60'],
    messages: [
      'The field is required',
      'The email is invalid',
      'The email is too long',
    ],
  },
});

//Global Translation
TrLocal.translate('es', {
  required: 'El campo es obligatorio',
});

//Global modification of an existing message
TrLocal.rewrite('en', 'required', 'The :field cannot be empty');
```

```html
<input
  name="email"
  type="text"
  data-tr-rules="required|email|maxlength:60"
  data-tr-messages="The field is required|The email is invalid|The email is too long"
/>
```

- **Customizable Error Messages**: Tailor error messages to fit the context of your application, enhancing user guidance and experience.
- **Localization Support**: Extend your application’s reach with built-in support for multiple languages, making your forms globally accessible.
- **Smart Feedback Management**: Intelligent error feedback ensures users are clearly informed about validation issues, improving form completion rates.

**Robust Validation Rules**

```js
const rules = ['email', 'size:1GB', 'before:now'];
```

- **Intuitive and Understandable Rules**: Each rule is designed to be self-explanatory, providing clear guidance and reducing the learning curve.
- **Extensive Rule Set**: Cover a wide array of scenarios with Trivule’s comprehensive library of predefined validation rules.
- **Easily Extendable**: Add or customize rules as your application requirements grow or change.
- **Rewrite Existing Rules**: Adapt the library to meet specific needs by rewriting existing rules, offering unparalleled flexibility.

**Trivule** is your go-to solution for making form validation not just possible but also a pleasant part of user interactions. Whether you are a developer looking to streamline your workflow or a business aiming to improve user experience, Trivule provides the tools you need to succeed. Start simplifying your forms with Trivule today!

### Validation Made Simple

Effortlessly validate inputs using Trivule, saving valuable development time. Utilize the `data-tr-rules` attribute to define validation rules directly in your HTML:

```html
<input type="text" data-tr-rules="required|integer|between:16,50" name="age" />
```

or in javascript

```js
trivuleForm.make({
  age: {
    rules: 'required|integer|between:16,50',
  },
});
```

Display error messages with ease using the `data-tr-feedback` attribute:

```html
<div data-tr-feedback="age"></div>
```

or in javascript

```js
trivuleForm.make({
  age: {
    rules: 'required|integer|between:16,50',
    feedbackElement: '[data-tr-feedback="age"]', //or [data-tr-feedback]
  },
});
```

## Event-Based Validation

Trigger validation on specific events using the `data-tr-events` attribute, eliminating the need for additional JavaScript code:

```html
<input type="text" data-tr-events="blur|change" name="age" />
```

or in javascript

```js
trivuleForm.make({
  age: {
    rules: 'required|integer|between:16,50',
    events: ['blur', 'change'],
  },
});
```

### Custom Styling

Style your inputs dynamically based on validation results using `data-tr-invalid-class` or `data-tr-valid-class` attributes:

```html
<input
  type="text"
  data-tr-invalid-class="error"
  data-tr-valid-class="success"
  name="age"
/>
```

or in javascript

```js
trivuleForm.make({
  age: {
    rules: 'required|integer|between:16,50',
    invalidClass: 'error',
    validClass: 'success',
  },
});
```

### Custom Error Messages

By default we provide a message for each rul e but you can customize error messages to align with your project's requirements using the `data-tr-messages` attribute:

```html
<input
  type="text"
  data-tr-messages="This field is required | Another message"
  name="age"
/>
```

or in javascript

```js
trivuleForm.make({
  age: {
    rules: 'required|integer|between:16,50',
    messages: 'This field is required |This field must be an integer',
  },
});
```

### Add or Edit Rule

For adding or editing a rule in Trivule, you can play with `TrRule` class

```javascript
TrRule.add('notSudo', (input) => {
  return {
    value: input,
    passes: input != 'sudo',
  };
});
```

[Get Started with Trivule](https://www.trivule.com/docs)


## Usage Guide in a Framework

Welcome to the Trivule installation and usage guide.

### Install Trivule with npm

Install Trivule in your project. This guide uses Trivule version v1.3.0. If you are using an older version, you should migrate to version v1.3.0.

```sh
npm install trivule
```
### Imperative Approach

The imperative approach requires explicit control over your project's lifecycle and component initialization.

#### Your Framework lifecyle

- **Unique Initialization**: Avoid initializing `TrivuleForm` in a frequently called hook. Prefer initializing it outside of a hook if possible to avoid repeated reinitializations.
- **Form Element Lookup**: Use the `bind` method to locate the form element to be validated. This lookup is performed only once for optimal performance. Ensure the DOM is ready before calling this method. You can call it in a hook that indicates the form is ready.

#### Using the afterBinding Hook

Use the `afterBinding` hook to register your callbacks, which will be executed as soon as the form element is available.

Example:

```javascript
import TrivuleForm from 'trivule';

const form = new TrivuleForm();

// Define your validation rules here
form.afterBinding((form) => {
  form.make({
    fieldName: {
      rules: "required|min:2"
    }
  });
});

// React
useEffect(() => {
  form.bind(/*selector*/);
}, []);

// Angular
ngAfterViewInit() {
  form.bind(/*selector*/);
}

// Vue
mounted() {
  form.bind(/*selector*/);
}

//etc
```

### Important Points

- `bind` only executes code after finding the target element.
- Trivule does not monitor the DOM to check if your element is available. Call the `bind` method when you are certain the `form` is in the DOM.

### Declarative Approach

1. **Define the Form**: Ensure your form is correctly defined with declarative attributes.
2. **Call the bind Method**: Do this when the form is available in the DOM.

Example:

```html
<form id="yourFormId">
  <input type="text" name="fieldName" data-tr-rules="required|min:2">
</form>
```

## Quick start
- [Single Input Validation](/docs/input-validation.md)
- [Form Validation](/docs/form-validation.md)

## Development

If you would like to contribute to the development of Trivule or customize the library, here's what you need:

### Prerequisites

- Node.js >= 16
- npm installed
- Knowledge of TypeScript

### Installation

To clone and install the Trivule project, follow these steps:

1. Clone the project using the following command:
   ```bash
   git clone https://github.com/trivule/trivule.git
   ```
2. Navigate to the project's root directory.
3. Install the dependencies by running the following command:
   ```bash
   npm install
   ```
4. If the installation is successful, start the development server with the following command:
   ```bash
   npm run dev
   ```
   This will start a local development server, and a link to the Trivule homepage (e.g., `http://localhost:5173`) will be displayed in your terminal. You can start testing by editing the `/src/example.ts`, which relates to the `index.html` file.

To create the bundles, run the following command:

```bash
npm run build
```

This command will generate the `index.mjs` and `index.umd.js` files in the `./dist` folder. The first file is intended for use as an ES6 module, while the second file is suitable for UMD systems. You can also use the `npm run build:watch` command to automatically compile files while you work.

### Directory Structure

The directory structure of the Trivule project is organized as follows:

- `src`: contains the main code of Trivule.
- `src/contracts`: contains interfaces and types used in Trivule.
- `src/locale`: contains internationalization files for different supported languages.
- `src/messages`: contains message generation files based on validation rules.
- `src/rules`: contains various validation rules available in Trivule.
- `src/utils`: contains utility files for Trivule.
- `src/validation`: contains the validation logic of Trivule.
- `dist`: contains the bundle files.
- `types`: contains TypeScript declarations.

## Contribution

The Trivule library is available on [GitHub](https://github.com/trivule/trivule) under an open-source license. We welcome contributions from the community. Please refer to our [contribution guidelines](https://trivule.com/docs/contribution) for more information and review our [code of conduct](https://trivule.com/docs/contribution#code-de-conduite) before contributing. Thank you to all the contributors who are involved in the development of Trivule.

## Community

Join the Trivule community:

- Discord: [https://discord.gg/6xKyDWA8TQ](https://discord.gg/6xKyDWA8TQ)
- X: [https://twitter.com/trivule](https://twitter.com/trivule)

## License

Trivule is released under our [license](http://www.trivule.com/docs/license) and developed by [Claude Fassinou](https://github.com/Claudye) and contributors.

Best regards

## Security

If you discover any security-related issues, please contact me directly at [dev.claudy@gmail.com ](mailto:dev.claudy@gmail.com) instead of using the issue tracker.
