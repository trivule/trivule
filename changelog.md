
In previous versions, the `tv-name` attribute was used to replace the name on an `input` element in case the person didn't want to use it. Now it is used to customize the name used in the error message.
If your `input` tag is:
```html
<input class="input" type="text" name="age" />
```
The error message would be something like:
*The **age** field is required*
But if you specify the `tv-name` attribute with the value `"age condition"`, the message would become:
*The **age condition** field is required*

Its equivalent if you want to specify via JavaScript code is the `attribute` property of the `TrivuleInputParms`

```javascript
{
attribute: "age condition"
}
```


- Add events tv.form.passes and tv.form.fails 
  These are events that can let you know when the form is valid or not.



### TrivuleForm Class

The `TrivuleForm` class is responsible for applying live validation to an HTML form. It allows developers to create an instance of `TrivuleForm` and interact with it to enable live validation on a form.

#### Usage Example:

```typescript

// Select the HTML form element
const formElement = document.getElementById("myForm") as HTMLFormElement;

// Create an instance of TrivuleForm
const trivuleForm = new TrivuleForm(formElement);

// Initialize the form
trivuleForm.init();
```

#### Constructor:

The `TrivuleForm` class constructor creates an instance of `TrivuleForm` and accepts the following parameters:

- `container` **(ValidatableForm) type**: The HTML form element or a selector string of the form element to apply live validation to.

- `config` (Optional, TrivuleFormConfig): Configuration options for `TrivuleForm`.

#### Methods:

- `init()`: Initializes live validation on the form element. This method sets up event listeners, enables auto-validation, and emits the "tv.form.init" event. Example usage:
  ```typescript
  trivuleForm.init();
  ```

- `validateOnChange(fn?: CallableFunction)`:
   * Registers an event listener for the "change" event on the container element.
   * If a callback function is provided, it will be executed befor validated the form. 
   * @param fn - The callback function to execute before Trivule will handle the form validation.
   *   
  ```typescript
  trivuleForm.onChange((event) => {
    // Custom logic to handle the "change" event
  });
  ```

- `validateOnTvValidated(fn?: CallableFunction)`:
   * Registers an event listener for the "tv.input.validated" event on the container element.
   * If a callback function is provided, it will be executed before Trivule handle the form validation. 
   * @param fn - The callback function to execute.
   *   
  ```typescript
  trivuleForm.onInputValidated((event) => {
    // Custom logic to handle the "tv.input.validated" event
  });
  ```

- `isValid(): boolean`: Checks if the form is valid by validating all form inputs. Returns `true` if all inputs are valid, `false` otherwise.

- `validate()`: Triggers the validation process for the form by emitting the "`tv.input.validated`" event.

- `onFails(fn: EventCallback)`: Attaches an event listener to the "tv.form.fails" event. This event is triggered when the form fails validation.

- `onPasses(fn: EventCallback)`: Attaches an event listener to the "tv.form.passes" event. This event is triggered when the form passes validation.

- `observeChanges(fn?: EventCallback)`: Attaches an event listener to the "tv.form.updated" event. This event is triggered when the form is updated, and it reinitializes and runs the TrivuleInputs for the form. The provided function is called with the form instance as a parameter.

- `onInit(fn?: EventCallback)`: Attaches an event listener to the "tv.form.init" event. This event is triggered when the form is initialized.

- `destroy()`: Destroys the `TrivuleForm` instance and performs cleanup. This method removes event handlers, destroys TrivuleInput instances, and clears the internal array of TrivuleInput instances.

- `on(e: string, fn: EventCallback)`: Attaches an event listener to the container element. It listens to the specified event and executes the provided callback function when the event occurs.

- `emit(e: string, data?: any)`: Emits a custom event to the container element with the specified event name

### Rules
time, phone, before, after and between
contains (should contains all)