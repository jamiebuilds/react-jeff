import React from "react"
import { render } from "react-dom"
import { useForm } from "../src/react-jeff"
import * as fields from "./fields"
import { Control } from "./Control"
import format from "pretty-format"

function Form({ onSubmit, ...props }) {
	return (
		<form
			onSubmit={event => {
				event.preventDefault()
				onSubmit()
			}}
			{...props}
		/>
	)
}

function TextInput({ onChange, ...props }) {
	return (
		<input onChange={event => onChange(event.currentTarget.value)} {...props} />
	)
}

function CheckboxInput({ onChange, ...props }) {
	return (
		<input
			type="checkbox"
			onChange={event => onChange(event.currentTarget.checked)}
			{...props}
		/>
	)
}

function SignupForm() {
	let email = fields.useEmailField()
	let username = fields.useUsernameField()
	let password = fields.usePasswordField()
	let confirmPassword = fields.useConfirmPasswordField(password.value)
	let acceptTerms = fields.useAcceptTermsField()

	function handleSubmit() {
		// ...
	}

	let form = useForm({
		fields: [email, username, password, confirmPassword],
		onSubmit: handleSubmit,
	})

	return (
		<Form {...form.props}>
			<Control form={form} field={email}>
				<label htmlFor="email">Email</label>
				<TextInput
					type="text"
					id="email"
					placeholder="Email"
					{...email.props}
				/>
			</Control>
			<Control form={form} field={username}>
				<label htmlFor="username">Username</label>
				<TextInput
					type="text"
					id="username"
					placeholder="Username"
					{...username.props}
				/>
			</Control>
			<Control form={form} field={password}>
				<label htmlFor="password">Password</label>
				<TextInput
					id="password"
					type="password"
					placeholder="•••••••"
					{...password.props}
				/>
			</Control>
			<Control form={form} field={confirmPassword}>
				<label htmlFor="confirmPassword">Confirm Password</label>
				<TextInput
					id="confirmPassword"
					type="password"
					placeholder="•••••••"
					{...confirmPassword.props}
				/>
			</Control>
			<Control form={form} field={acceptTerms}>
				<label htmlFor="acceptTerms">I accept the terms and conditions</label>
				<CheckboxInput id="acceptTerms" {...acceptTerms.props} />
			</Control>
			<button type="reset" onClick={form.reset}>
				Reset
			</button>
			<button type="submit">Sign Up</button>
			<pre>
				{"form = "}
				{format(form, {
					printFunctionName: false,
				})}
			</pre>
		</Form>
	)
}

render(<SignupForm />, document.getElementById("root"))
