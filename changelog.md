
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