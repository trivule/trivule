### Change Log

#### v1.0.1

- Fix #19 (mimes rule)
- Fix file input rule and make them accept multiple files

#### v1.1.0 (2024-05-17)

##### Enhancements

- **Performance Improvement:** Enhanced the overall performance of the validation system.
- **Optional Initialization:** Made the `init` method optional for both `TrivuleInput` and `TrivuleForm`.

##### Features

- **Real-Time Validation:** Added the `realTime` key to the configuration, allowing developers to enable or disable real-time validation.
- **Imperative Validation:** Introduced imperative validation for more dynamic interaction with forms, including the ability to add, remove, and modify validation rules during program execution.
- **Global Feedback Elements:** Added the capability to define global feedback elements on the form for its fields.
- **Enhanced Event Handling:** Updated methods `onFails`, `onPasses`, and `onUpdate` for `TrivuleInput` and `TrivuleForm` to improve event handling and customization.

This release provides significant improvements and new features aimed at enhancing the flexibility and performance of form validation. The introduction of real-time validation control, optional initialization, and imperative validation rules allows for a more customizable and efficient development experience. The addition of global feedback elements simplifies the process of providing user feedback on form validation.
