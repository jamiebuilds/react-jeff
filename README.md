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

```js
import React from "react"
import { useField, useForm } from "react-jeff"

function required(value) {
	let errs = []
	if (value === "") errs.push("This field is required!")
	return errs
}

function Input({ onChange, ...props }) {
	return (
		<input {...props} onChange={event => onChange(event.currentTarget.value)} />
	)
}

function LoginForm() {
	let username = useField({
		defaultValue: "",
		validations: [required],
	})

	let password = useField({
		defaultValue: "",
		validations: [required],
	})

	function onSubmit(event) {
		event.preventDefault()
		// submit form...
	}

	let form = useForm({
		fields: [username, password],
		onSubmit: onSubmit,
	})

	return (
		<form>
			<Input type="text" {...username.props} />
			<Input type="password" {...password.props} />
		</form>
	)
}
```
