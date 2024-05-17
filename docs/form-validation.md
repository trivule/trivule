# Form Validation

## TrivuleForm

TrivuleForm provides two validation approaches: declarative and imperative.

### Declarative Validation

Specify validation rules in the attributes of HTML fields for basic form validation.

**Example:**

```html
<form>
  <div>
    <label>Email</label>
    <input type="text" data-tr-rules="required|email|maxlength:32" name="email" />
    <div data-tr-feedback="email"></div>
  </div>
  <div>
    <label>Message</label>
    <textarea data-tr-rules="required|between:2,250|endWith:." name="message"></textarea>
    <div data-tr-feedback="message"></div>
  </div>
  <p>
    <button type="submit" value="Submit" data-tr-submit>Submit</button>
  </p>
</form>
```

**Initialization:**

```js
const trForm = new TrivuleForm("form");
```

### Imperative Validation

Define and apply validation rules dynamically using JavaScript.

**Example:**

```js
const trivuleForm = new TrivuleForm("form", {
  realTime: false,
  feedbackSelector: ".invalid-feedback"
});

// Define validation rules
trivuleForm.make([
  {
    selector: "email",
    rules: ["required", "email", "maxlength:32"],
  },
  {
    selector: "message",
    rules: ["required", "between:2,250", "endWith:."],
  },
]);
```

### Make Validation

Define and apply validation rules using the `make` method.

#### Example 1: Array of Input Parameters

```typescript
trivuleForm.make([
  { selector: "age", rules: "required|between:18,40" },
  { selector: "#birthDayInput", rules: "required|date" },
]);
```

#### Example 2: Object with Input Names and Parameters

```typescript
const inputs = {
  age: { rules: "required|between:18,40" },
  birthDay: { rules: "required|date", selector: "#birthDayInput" },
  message: { rules: "required|only:string" },
};

trivuleForm.make(inputs);
```

#### Example 3: Chaining `make` Method Calls

```typescript
trivuleForm
  .make([{ selector: "age", rules: "required|between:18,40" }])
  .make({ message: { rules: "required|only:string" } });
```

### Handling Validation

#### Failed Validation

Use the `onFails` method or listen directly for the `"tr.form.fails"` event.

**Using `onFails`:**

```typescript
trivuleForm.onFails((trivuleForm) => {
  console.log("Form validation failed!", trivuleForm);
});
```

**Direct Event Listener:**

```typescript
formElement.addEventListener("tr.form.fails", (event) => {
  console.log("Form validation failed!", event.target);
});
```

#### Successful Validation

Use the `onPasses` method or listen directly for the `"tr.form.passes"` event.

**Using `onPasses`:**

```typescript
trivuleForm.onPasses((trivuleForm) => {
  console.log("Form validation passed!", trivuleForm);
});
```

**Direct Event Listener:**

```typescript
formElement.addEventListener("tr.form.passes", (event) => {
  console.log("Form validation passed!", event.target);
});
```

### Additional Methods

#### Attaching Event Listeners

**`on` Method:**

Attach event listeners to the form container.

```typescript
trivuleForm.on("tr.form.init", (event) => {
  console.log("Form initialized", event.detail);
});
```

#### Emitting Custom Events

**`emit` Method:**

Emit custom events from the form container.

```typescript
trivuleForm.emit("tr.form.validate", {
  valid: true,
  message: "Form validation completed successfully",
});
```

#### Handling Form Updates and Validation Events

**`onUpdate` Method:**

Execute a callback when any input value is updated.

```typescript
trivuleForm.onUpdate((form) => {
  console.log("Form updated", form);
});
```

**`onValidate` Method:**

Execute a callback when the form is validated.

```typescript
trivuleForm.onValidate((form) => {
  console.log("Form validated", form);
});
```

#### Iterating Through Form Inputs

**`each` Method:**

Perform actions on each input.

```typescript
trivuleForm.each((input) => {
  console.log("Input name:", input.getName());
  console.log("Input value:", input.getValue());
  console.log("Input validation status:", input.passes());
});
```

#### Managing Inputs

**`inputs` Method:**

Retrieve all inputs.

```typescript
const strictInputs = trivuleForm.inputs(); // strict mode
const nonStrictInputs = trivuleForm.inputs(false); // non-strict mode
```

**`validated` Method:**

Retrieve validated inputs.

```typescript
const validatedInputs = trivuleForm.validated();
const nonStrictValidatedInputs = trivuleForm.validated(false);
```

**`failed` Method:**

Retrieve failed inputs.

```typescript
const failedInputs = trivuleForm.failed();
const nonStrictFailedInputs = trivuleForm.failed(false);
```

### Validation Status

**`isValid` Method:**

Check if the entire form is valid.

```typescript
const isFormValid = trivuleForm.isValid();
if (isFormValid) {
  console.log("The form is valid.");
} else {
  console.log("The form contains invalid inputs.");
}
```
