import * as React from "react"

/**
 * A close enough check to test if a value is a Synthetic Event or not.
 * See: https://github.com/reactjs/rfcs/pull/112
 */
function isReactSyntheticEvent(value: any) {
	if (typeof value !== "object" || value === null) return false
	if (typeof value.bubbles !== "boolean") return false
	if (typeof value.cancellable !== "boolean") return false
	if (typeof value.defaultPrevented !== "boolean") return false
	if (typeof value.eventPhase !== "number") return false
	if (typeof value.isTrusted !== "boolean") return false
	if (typeof value.timestamp !== "number") return false
	if (typeof value.type !== "string") return false
	return true
}

/**
 * TODO: Document
 */
interface Validation<Val, Err = string> {
	(value: Val): Err[] | Promise<Err[]>
}

/**
 * An `onSubmit` handler, can return a promise, and can return additional form validation errors
 */
interface SubmitHandler<Err = string> {
	(event: React.FormEvent): void | Err[] | Promise<void> | Promise<Err[]>
}

/**
 * TODO: Document
 */
export interface FieldOptions<Val, Err = string> {
	defaultValue: Val
	validations: Array<Validation<Val, Err>>
	disabled?: boolean
	readOnly?: boolean
}

/**
 * TODO: Document
 */
export interface FormOptions<Err = string> {
	fields: Array<Field<any, Err>>
	onSubmit: SubmitHandler<Err>
}

/**
 * TODO: Document
 */
export interface Field<Val, Err = string> {
	value: Val
	defaultValue: Val
	setValue: (value: Val) => any
	errors: Err[]
	focused: boolean
	blurred: boolean
	touched: boolean
	dirty: boolean
	valid: boolean
	validating: boolean
	disabled: boolean
	readOnly: boolean
	setDisabled: (disabled: boolean) => void
	setReadOnly: (readonly: boolean) => void
	reset: () => void
	validate: () => Promise<void>
	props: {
		value: Val
		disabled: boolean
		readOnly: boolean
		onFocus: React.FocusEventHandler<Element>
		onBlur: React.FocusEventHandler<Element>
		onChange: (value: Val) => void
	}
}

/**
 * TODO: Document
 */
export interface Form<Err = string> {
	fieldErrors: Array<Err>
	submitErrors: Array<Err>
	submitted: boolean
	focused: boolean
	touched: boolean
	dirty: boolean
	valid: boolean
	validating: boolean
	reset: () => void
	validateFields: () => Promise<void>
	props: {
		onSubmit: SubmitHandler<Err>
	}
}

/**
 * TODO: Document
 */
export function useField<Val, Err = string>(
	options: FieldOptions<Val, Err>,
): Field<Val, Err> {
	let defaultValue = options.defaultValue
	let validations = options.validations || []

	let [value, setValue] = React.useState(defaultValue)
	let [errors, setErrors] = React.useState<Err[]>([])
	let [validating, setValidating] = React.useState(false)
	let [focused, setFocused] = React.useState(false)
	let [blurred, setBlurred] = React.useState(false)
	let [touched, setTouched] = React.useState(false)
	let [dirty, setDirty] = React.useState(false)
	let [disabled, setDisabled] = React.useState(options.disabled || false)
	let [readOnly, setReadOnly] = React.useState(options.readOnly || false)

	let onFocus = React.useCallback(() => {
		setFocused(true)
		setTouched(true)
	}, [])

	let onBlur = React.useCallback(() => {
		setFocused(false)
		setBlurred(true)
	}, [])

	let valueRef = React.useRef<Val>(value)

	function reset() {
		setValue(defaultValue)
		setErrors([])
		setValidating(false)
		setBlurred(false)
		if (!focused) setTouched(false)
		setDirty(false)
	}

	function validate() {
		let initValue = valueRef.current
		let errorsMap: Err[][] = []

		setValidating(true)

		let promises = validations.map((validation, index) => {
			return Promise.resolve()
				.then(() => validation(initValue))
				.then(errors => {
					errorsMap[index] = errors
					if (Object.is(initValue, valueRef.current)) {
						setErrors(errorsMap.flat(1))
					}
				})
		})

		return Promise.all(promises)
			.then(() => {
				if (Object.is(initValue, valueRef.current)) {
					setValidating(false)
				}
			})
			.catch(err => {
				if (Object.is(initValue, valueRef.current)) {
					setValidating(false)
				}
				throw err
			})
	}

	let setValueHandler = (value: Val) => {
		valueRef.current = value
		setDirty(true)
		setValue(value)
		setErrors([])
		validate()
	}

	let onChange = (value: Val) => {
		if (isReactSyntheticEvent(value)) {
			throw new TypeError(
				"Expected `field.onChange` to be called with a value, not an event",
			)
		}
		setValueHandler(value)
	}

	let valid = !errors.length

	return {
		value,
		errors,
		defaultValue,
		setValue: setValueHandler,
		focused,
		blurred,
		touched,
		dirty,
		valid,
		validating,
		disabled,
		readOnly,
		setDisabled,
		setReadOnly,
		reset,
		validate,
		props: {
			value,
			disabled,
			readOnly,
			onFocus,
			onBlur,
			onChange,
		},
	}
}

/**
 * TODO: Document
 */
export function useForm<Err = string>(options: FormOptions<Err>): Form<Err> {
	let fields = options.fields
	let onSubmit = options.onSubmit
	let [submitted, setSubmitted] = React.useState(false)
	let [submitErrors, setSubmitErrors] = React.useState<Err[]>([])

	let focused = fields.some(field => field.focused)
	let touched = fields.some(field => field.touched)
	let dirty = fields.some(field => field.dirty)
	let valid = fields.every(field => field.valid)
	let validating = fields.some(field => field.validating)

	let fieldErrors = fields.reduce(
		(errors: Err[], field: Field<any, Err>) => {
			return errors.concat(field.errors)
		},
		[] as Err[],
	)

	function reset() {
		setSubmitted(false)
		setSubmitErrors([])
		fields.forEach(field => field.reset())
	}

	function validateFields() {
		return Promise.all(fields.map(field => field.validate())).then(() => {})
	}

	function onSubmitHandler(event: React.FormEvent) {
		setSubmitted(true)

		return Promise.resolve()
			.then(() => onSubmit(event) as any)
			.then((errs: void | Err[]) => {
				setSubmitErrors(errs || [])
			})
	}

	return {
		fieldErrors,
		submitErrors,
		submitted,
		focused,
		touched,
		dirty,
		valid,
		validating,
		validateFields,
		reset,
		props: {
			onSubmit: onSubmitHandler,
		},
	}
}
