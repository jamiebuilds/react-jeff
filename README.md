# React Jeff

> A Good Form Library

- ~800 bytes minified+gzip
- Easy to learn API
- Write your form code in a way that is reusable and testable
- Seamless sync and async form validations (including on form submit)
- Tons of utilty features out of the box
- Written with React Hooks
- Typed with TypeScript

## Install

```
npm install react-jeff
```

## Usage

<!-- prettier-ignore -->
```js
import React from "react"
import { useField, useForm } from "react-jeff"

function validateUsername(value) {
	let errs = []
	if (value.length < 3) errs.push("Must be at least 3 characters long")
	if (!/^[a-z0-9_-]*$/i.test(value)) errs.push("Must only contain alphanumeric characters or dashes/underscores")
	if (!/^[a-z0-9]/i.test(value)) errs.push("Must start with alphanumeric character")
	if (!/[a-z0-9]$/i.test(value)) errs.push("Must end with alphanumeric character")
	return errs
}

function validatePassword(value) {
	let errs = []
	if (value.length < 6) errs.push("Must be at least 6 characters long")
	if (!/[a-z]/.test(value)) errs.push("Must contain at least one lowercase letter")
	if (!/[A-Z]/.test(value)) errs.push("Must contain at least one uppercase letter")
	if (!/[0-9]/.test(value)) errs.push("Must contain at least one number")
	return errs
}

function Form({ onSubmit, ...props }) {
	return (
		<form {...props} onSubmit={event => {
			event.preventDefault()
			onSubmit()
		}}/>
	)
}

function Input({ onChange, ...props }) {
	return (
		<input {...props} onChange={event => {
			onChange(event.currentTarget.value)
		}} />
	)
}

function SignupForm() {
	let username = useField({
		defaultValue: "",
		required: true,
		validations: [validateUsername],
	})

	let password = useField({
		defaultValue: "",
		required: true,
		validations: [validatePassword],
	})

	function onSubmit() {
		// submit form...
	}

	let form = useForm({
		fields: [username, password],
		onSubmit: onSubmit,
	})

	return (
		<Form {...form.props}>
			<Input type="text" {...username.props} />
			<Input type="password" {...password.props} />
			<button type="submit">Sign Up</button>
		</Form>
	)
}
```

## API

### `useField()`

Call `useField()` to create a single field in a form.

```js
let field = useField({
	defaultValue: (value), // ....... (Required) The default value of the field.
	validations: [(...errors)], // .. (Optional) Validations to run when the field is `validate()`'d.
	required: boolean, // ........... (Optional) Should the field be required?
	disabled: boolean, // ........... (Optional) Should the field be disabled?
	readOnly: boolean, // ........... (Optional) Should the field be readOnly?
})
```

```js
field == {
	value: (value), // ......... The current value of the field.
	defaultValue: (value), // .. The `defaultValue` passed into `useField({ defaultValue })`.

	dirty: boolean, // ......... Has the field been changed from its defaultValue?
	touched: boolean, // ....... Has the element this field is attached to been focused previously?
	focused: boolean, // ....... Is the element this field is attached to currently focused?
	blurred: boolean, // ....... Has the element this field is attached to been focused and then blurred?

	validating: boolean, // .... Is the field validating itself?
	valid: boolean, // ......... Is the field currently valid? (must have no errors, and if the field is required, must not be empty)
	errors: [(...errors)], // .. The collected errors returned by `opts.validations`

	required: boolean, // ...... Is the field required?
	disabled: boolean, // ...... Is the field disabled?
	readOnly: boolean, // ...... Is the field readOnly?

	setValue: Function, // ..... Call with a value to manually update the value of the field.
	setRequired: Function, // .. Call with true/false to manually set the `required` state of the field.
	setDisabled: Function, // .. Call with true/false to manually set the `disabled` state of the field.
	setReadOnly: Function, // .. Call with true/false to manually set the `readOnly` state of the field.

	reset: Function, // ........ Reset the field to its default state.
	validate: Function, // ..... Manually tell the field to validate itself (updating other fields).

	// Props to pass into an component to attach the `field` to it:
	props: {
		value: (value), // ....... The current value (matches `field.value`).

		onChange: Function, // ... An `onChange` handler to update the value of the field.
		onFocus: Function, // .... An `onFocus` handler to update the focused/touched/blurred states of the field.
		onBlur: Function, // ..... An `onFocus` handler to update the focused/blurred states of the field.

		required: boolean, // .... Should the element be `required`?
		disabled: boolean, // .... Should the element be `disabled`?
		readOnly: boolean, // .... Should the element be `readOnly`?
	},
}
```

### `useForm()`

Call `useForm()` with to create a single form.

```js
let form = useForm({
	fields: [(...fields)], // .. All of the fields created via `useField()` that are part of the form.
	onSubmit: Function, // ..... A submit handler for the form that receives the form submit event.
})
```

```js
form == {
	fieldErrors: [(...errors)], // ... The collected errors from all of the fields in the form.
	submitErrors: [(...errors)], // .. The errors returned by `opts.onSubmit`.

	submitted: boolean, // ........... Has the form been submitted at any point?
	submitting: boolean, // .......... Is the form currently submitting?

	focused: boolean, // ............. Are *any* of the fields in the form currently `focused`?
	touched: boolean, // ............. Are *any* of the fields in the form currently `touched`?
	dirty: boolean, // ............... Are *any* of the fields in the form currently `dirty`?
	valid: boolean, // ............... Are *all* of the fields in the form currently `valid`?
	validating: boolean, // .......... Are *any* of the fields in the form currently `validating`?

	reset: Function, // .............. Reset all of the fields in the form.
	validate: Function, // ........... Validate all of the fields in the form.
	submit: Function, // ............. Submit the form manually.

	// Props to pass into a form component to attach the `form` to it:
	props: {
		onSubmit: Function, // ......... An onSubmit handler to pass to an element that submits the form.
	},
}
```

<!--
## Guide

There are a few concepts that you'll need to be familiar with

- A "Form"
- A "Field"
- A "Validation"

```js
function MyComponent() {
	// Create the field:
	let field = useField({ defaultValue: "" })

	// Pass the field into a form

	// Pass `{...field.props}` into an input element.
	return (
		<form {...form.props}>
			<TextInput {...field.props} />
		</form>
	)
}
```
-->
