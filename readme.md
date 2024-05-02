# Trivule

Trivule is a user-friendly JavaScript real-time library for HTML form validation. It allows you to quickly add validation rules to your form fields using custom HTML attributes, without the need to write additional JavaScript code. Trivule's custom HTML attributes are easy to understand and use, enabling you to set up a robust validation system without spending a lot of time creating custom validation functions or writing complex JavaScript code.
 
To get started with Trivule, please refer to the comprehensive documentation available [here](http://www.trivule.com/). You can also follow a quick tutorial of less than 5 minutes [here](http://www.trivule.com/docs/tutorial) to familiarize yourself with Trivule.

## Usage
No jQuery, no complexe code, javascript, easy to integrate to Angular, React, Vue and others javascript frameworks
How to validate an input. Trivule make you to save valuable time.
```html
<input type="text" data-tr-rules="required|integer|between:16,50"  name="age" />
```
If need to display the error message, just use the `data-tr-feedback` any where you want, wihout your custum design
```html
<div data-tr-feedback="age"></div>
```

Sometimes you want to trigger the validation when some events  triggered, you don't need to write `addEventListener` code use `data-tr-events` attribute.
```html
<input type="text" data-tr-events="blur|changes"  name="age" />
```

To  style your input when validation passes or fails, Trivule provides you the `data-tr-invalid-class` or `data-tr-valid-class` attributes for you. Which accept css class
```html
<input type="text" `data-tr-invalid-class="error"` `data-tr-invalid-class="success"` name="age" />
```
It's no need to do this for all your form, it  is possible to indicate thees class when initilizing Trivule

By default, Trivule comes with error messages, you can customize them, rewrite them, or translate them into your language. But it's possible to quickly is just use the `data-tr-messages`. The customize the error messages.

```html
<input type="text" data-tr-messages="This field is required | Another message"  name="age" />
```
> Notes: Only the `data-tr-rules` is required, all those attributes are optionals and internally handled by Trivule

[Start use Trivule](https://www.trivule.com/docs)

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

The Trivule library is available on [GitHub](https://github.com/trivule/trivule) under an open-source license. We welcome contributions from the community. Please refer to our [contribution guidelines](http://www.trivule.com/docs/contribution) for more information and review our [code of conduct](http://www.trivule.com/docs/contribution#code-de-conduite) before contributing. Thank you to all the contributors who are involved in the development of Trivule.

## Community

Join the Trivule community:
- Discord: [https://discord.gg/6xKyDWA8TQ](https://discord.gg/6xKyDWA8TQ)
- X: [https://twitter.com/trivule](https://twitter.com/trivule)


## License

Trivule is released under our [license](http://www.trivule.com/docs/license) and developed by [Claude Fassinou](https://github.com/Claudye) and contributors.

Best regards

## Security

If you discover any security-related issues, please contact me directly at [dev.claudy@gmail.com ](mailto:dev.claudy@gmail.com)  instead of using the issue tracker.
