# React Jeff

> A Good Form Library

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

	let form = useField({
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
