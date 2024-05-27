### Change Log

#### 1.3.0 (2024-05-27)
- Fix: #36 Allow Form Initialization without Immediate HTML Element Binding
- Fix: #38 Introduction of Lifecycle Hooks for Validation
- Improved compatibility with frameworks
- Enhanced performance

#### 1.2.1 (2024-05-26)

- fix import of declaration files
  
#### v1.2.0 (2024-05-26)

##### Enhancements

- **Advanced Rule Management:** Added a `$rules` property to the `TrivuleInput` instance, allowing for advanced operations such as adding, removing, or modifying validation rules on-the-fly. This provides greater flexibility in managing form validation dynamically.
- **Dynamic Rule Definition:** Introduced support for dynamic rules via callback functions in the `InputRule`, enabling more complex and context-aware validation logic.
- **Conditional Validation Improvements:** Enhanced conditional validation mechanisms, making it easier to implement and manage complex validation scenarios based on various conditions.
- **Performance Optimization:** Continued improvements to the performance of the validation system, ensuring faster validation checks and reduced overhead.

##### Features

- **Dynamic Rule Callbacks:** Implemented dynamic rule callbacks that allow validation logic to be defined and executed based on runtime conditions, providing more powerful and flexible validation capabilities.


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


#### v1.0.1

- Fix #19 (mimes rule)
- Fix file input rule and make them accept multiple files