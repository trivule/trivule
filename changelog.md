- Type (/src/contracts/types.ts)
  **QvInputParams**:  
  An attribute object that we use to perform validation
  Ex: `rules` matches `data-qv-rules`

- Performance
  Quickv will only validate one if necessary. Indeed, Quickv will check if the passed value has already been validated with the same rule. If so, Quickv will not re-validate. It will just return the past validation status

- Customisation
  It is possible to use the QvInput class to pass attribute values as JavaScript code instead of specifying them directly in HTML attributes as we did before.
  Ex:
  Javascript

```ts
const qvInput = new QvInput(
  "input",
  {},
  {
    rules: ["required", "email"],
  }
);

qvInput.init();
```

or

```ts
const qvInput = new QvInput("input");

qvInput.with({
  rules: ["required", "email"],
});

qvInput.init();
```

Html code

```html
<div>
  <label class="label">Age</label>
  <div class="form-control">
    <input class="input" type="text" name="age" />
  </div>
  <div data-qv-feedback="age"></div>
  <p class="help">Rules applied: required|int|between:18,30</p>
</div>
```

This is fine if you don't want to pollute your HTML files with `data-qv-` attributes.
