
In previous versions, the `qv-name` attribute was used to replace the name on an `input` element in case the person didn't want to use it. Now it is used to customize the name used in the error message.
If your `input` tag is:
```html
<input class="input" type="text" name="age" />
```
The error message would be something like:
*The **age** field is required*
But if you specify the `qv-name` attribute with the value `"age condition"`, the message would become:
*The **age condition** field is required*

Its equivalent if you want to specify via JavaScript code is the `attribute` property of the `QvInputParms`

```javascript
{
attribute: "age condition"
}
```


- Add events qv.form.passes and qv.form.fails 
  These are events that can let you know when the form is valid or not.



### QvForm Class

The `QvForm` class is responsible for applying live validation to an HTML form. It allows developers to create an instance of `QvForm` and interact with it to enable live validation on a form.

#### Usage Example:

```typescript

// Select the HTML form element
const formElement = document.getElementById("myForm") as HTMLFormElement;

// Create an instance of QvForm
const qvForm = new QvForm(formElement);

// Initialize the form
qvForm.init();
```

#### Constructor:

The `QvForm` class constructor creates an instance of `QvForm` and accepts the following parameters:

- `container` **(ValidatableForm) type**: The HTML form element or a selector string of the form element to apply live validation to.

- `config` (Optional, QvFormConfig): Configuration options for `QvForm`.

#### Methods:

- `init()`: Initializes live validation on the form element. This method sets up event listeners, enables auto-validation, and emits the "qv.form.init" event. Example usage:
  ```typescript
  qvForm.init();
  ```

- `validateOnChange(fn?: CallableFunction)`:
   * Registers an event listener for the "change" event on the container element.
   * If a callback function is provided, it will be executed befor validated the form. 
   * @param fn - The callback function to execute before Quickv will handle the form validation.
   *   
  ```typescript
  qvForm.onChange((event) => {
    // Custom logic to handle the "change" event
  });
  ```

- `validateOnQvValidated(fn?: CallableFunction)`:
   * Registers an event listener for the "qv.input.validated" event on the container element.
   * If a callback function is provided, it will be executed before Quickv handle the form validation. 
   * @param fn - The callback function to execute.
   *   
  ```typescript
  qvForm.onInputValidated((event) => {
    // Custom logic to handle the "qv.input.validated" event
  });
  ```

- `isValid(): boolean`: Checks if the form is valid by validating all form inputs. Returns `true` if all inputs are valid, `false` otherwise.

- `validate()`: Triggers the validation process for the form by emitting the "`qv.input.validated`" event.

- `onFails(fn: EventCallback)`: Attaches an event listener to the "qv.form.fails" event. This event is triggered when the form fails validation.

- `onPasses(fn: EventCallback)`: Attaches an event listener to the "qv.form.passes" event. This event is triggered when the form passes validation.

- `observeChanges(fn?: EventCallback)`: Attaches an event listener to the "qv.form.updated" event. This event is triggered when the form is updated, and it reinitializes and runs the QvInputs for the form. The provided function is called with the form instance as a parameter.

- `onInit(fn?: EventCallback)`: Attaches an event listener to the "qv.form.init" event. This event is triggered when the form is initialized.

- `destroy()`: Destroys the `QvForm` instance and performs cleanup. This method removes event handlers, destroys QvInput instances, and clears the internal array of QvInput instances.

- `on(e: string, fn: EventCallback)`: Attaches an event listener to the container element. It listens to the specified event and executes the provided callback function when the event occurs.

- `emit(e: string, data?: any)`: Emits a custom event to the container element with the specified event name