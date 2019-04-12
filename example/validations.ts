import emailRegex from "email-regex"

let EMAIL_REGEX = emailRegex({ exact: true })

export function validateEmail(value: string) {
	let errors = []

	if (!EMAIL_REGEX.test(value)) {
		errors.push("Must be valid email")
	}

	return errors
}

export function validateEmailUnused(value: string) {
	return fakeAsyncApiRequest().then(() => {
		let errors = []
		if (value === "me@thejameskyle.com") {
			errors.push(`There's already an account signed up with that email`)
		}
		return errors
	})
}

export function validateUsername(value: string) {
	let errors = []

	if (value.length < 3) {
		errors.push("Must be at least 3 characters long")
	}

	if (!/^[a-z0-9_-]*$/i.test(value)) {
		errors.push(
			"Must only contain alphanumeric characters or dashes/underscores",
		)
	}

	if (!/^[a-z0-9]/i.test(value)) {
		errors.push("Must start with alphanumeric character")
	}

	if (!/[a-z0-9]$/i.test(value)) {
		errors.push("Must end with alphanumeric character")
	}

	return errors
}

export function validateUsernameUnused(value: string) {
	return fakeAsyncApiRequest().then(() => {
		let errors = []
		if (value === "jamiebuilds") {
			errors.push(`That username is already taken`)
		}
		return errors
	})
}

export function validatePassword(value: string) {
	let errors = []

	if (value.length < 6) {
		errors.push("Must be at least 6 characters long")
	}

	if (!/[a-z]/.test(value)) {
		errors.push("Must contain at least one lowercase letter")
	}

	if (!/[A-Z]/.test(value)) {
		errors.push("Must contain at least one uppercase letter")
	}

	if (!/[0-9]/.test(value)) {
		errors.push("Must contain at least one number")
	}

	return errors
}

export function validateConfirmPassword(value: string, password: string) {
	let errors = []

	if (value !== password) {
		errors.push("Must match password")
	}

	return errors
}

export function validateAcceptTerms(value: boolean) {
	let errors = []

	if (value !== true) {
		errors.push("Must agree to terms and conditions")
	}

	return errors
}

function fakeAsyncApiRequest() {
	return new Promise(res => setTimeout(res, 1000))
}
