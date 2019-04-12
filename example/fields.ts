import { useField, useForm } from "../src/react-jeff"
import * as validations from "./validations"

export function useEmailField() {
	return useField({
		defaultValue: "",
		validations: [validations.validateEmail, validations.validateEmailUnused],
	})
}

export function useUsernameField() {
	return useField({
		defaultValue: "",
		validations: [
			validations.validateUsername,
			validations.validateUsernameUnused,
		],
	})
}

export function usePasswordField() {
	return useField({
		defaultValue: "",
		validations: [validations.validatePassword],
	})
}

export function useConfirmPasswordField(password: string) {
	return useField({
		defaultValue: "",
		validations: [
			value => validations.validateConfirmPassword(value, password),
		],
	})
}

export function useAcceptTermsField() {
	return useField({
		defaultValue: false,
		validations: [validations.validateAcceptTerms],
	})
}
