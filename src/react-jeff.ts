import * as React from "react"

/**
 * A close enough check to test if a value is a Synthetic Event or not.
 * See: https://github.com/reactjs/rfcs/pull/112
 * @private
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

function isEmptyValue(value: any) {
	if (value === "") return true
	if (value === null) return true
	if (typeof value === "undefined") return true
	return false
}

/**
 * A function that accepts a value and returns an array of errors. If the array
 * is empty, the value is assumed to be valid. The validation can also return
 * asynchronously using a promise.
 *
 * Validation errors default to being strings, but can have any shape.
 */
export interface Validation<Val, Err = string> {
	(value: Val): Err[] | Promise<Err[]>
}

/**
 * Options to pass into `useField(opts)`
 */
export interface FieldOptions<Val, Err = string> {
	/**
	 * The default value of the field.
	 */
	defaultValue: Val
	/**
	 * Validations to run when the field is `validate()`'d.
	 */
	validations?: Array<Validation<Val, Err>>
	/**
	 * Should the field be required?
	 */
	required?: boolean
	/**
	 * Should the field be disabled?
	 */
	disabled?: boolean
	/**
	 * Should the field be readOnly?
	 */
	readOnly?: boolean
}

/**
 * Options to pass into `useForm(opts)`
 */
export interface FormOptions<Err = string> {
	/**
	 * All of the fields created via `useField()` that are part of the form.
	 */
	fields: Array<Field<any, Err>>
	/**
	 * A submit handler for the form that receives the form submit event and can
	 * return additional validation errors. May also return asynchronously using
	 * a promise.
	 */
	onSubmit: () => void | Err[] | Promise<void> | Promise<Err[]>
}

/**
 * The object returned by `useField()`
 */
export interface Field<Val, Err = string> {
	/**
	 * The current value of the field.
	 */
	value: Val
	/**
	 * The `defaultValue` passed into `useField({ defaultValue })`.
	 */
	defaultValue: Val

	/**
	 * Has the field been changed from its defaultValue?
	 */
	dirty: boolean
	/**
	 * Has the element this field is attached to been focused previously?
	 */
	touched: boolean
	/**
	 * Is the element this field is attached to currently focused?
	 */
	focused: boolean
	/**
	 * Has the element this field is attached to been focused and then blurred?
	 */
	blurred: boolean

	/**
	 * Is the field validating itself?
	 */
	validating: boolean
	/**
	 * Is the field currently valid?
	 *
	 * Must have no errors, and if the field is required, must not be empty.
	 */
	valid: boolean
	/**
	 * The collected errors returned by `opts.validations`
	 */
	errors: Err[]

	/**
	 * Is the field required?
	 */
	required: boolean
	/**
	 * Is the field disabled?
	 */
	disabled: boolean
	/**
	 * Is the field readOnly?
	 */
	readOnly: boolean

	/**
	 * Call with a value to manually update the value of the field.
	 */
	setValue: (value: Val) => any
	/**
	 * Call with true/false to manually set the `required` state of the field.
	 */
	setRequired: (required: boolean) => void
	/**
	 * Call with true/false to manually set the `disabled` state of the field.
	 */
	setDisabled: (disabled: boolean) => void
	/**
	 * Call with true/false to manually set the `readOnly` state of the field.
	 */
	setReadOnly: (readonly: boolean) => void

	/**
	 * Reset the field to its default state.
	 */
	reset: () => void
	/**
	 * Manually tell the field to validate itself (updating other fields).
	 */
	validate: () => Promise<void>

	/**
	 * Props to pass into an component to attach the `field` to it
	 */
	props: {
		/**
		 * The current value (matches `field.value`).
		 */
		value: Val

		/**
		 * An `onChange` handler to update the value of the field.
		 */
		onChange: (value: Val) => void
		/**
		 * An `onFocus` handler to update the focused/touched/blurred states of the field.
		 */
		onFocus: () => void
		/**
		 * An `onFocus` handler to update the focused/blurred states of the field.
		 */
		onBlur: () => void

		/**
		 * Should the element be `required`?
		 */
		required: boolean
		/**
		 * Should the element be `disabled`?
		 */
		disabled: boolean
		/**
		 * Should the element be `readOnly`?
		 */
		readOnly: boolean
	}
}

/**
 * The object returned by `useForm()`
 */
export interface Form<Err = string> {
	/**
	 * The collected errors from all of the fields in the form.
	 */
	fieldErrors: Array<Err>
	/**
	 * The errors returned by `opts.onSubmit`.
	 */
	submitErrors: Array<Err>
	/**
	 * Has the form been submitted at any point?
	 */
	submitted: boolean
	/**
	 * Is the form currently submitting?
	 */
	submitting: boolean
	/**
	 * Are *any* of the fields in the form currently `focused`?
	 */
	focused: boolean
	/**
	 * Are *any* of the fields in the form currently `touched`?
	 */
	touched: boolean
	/**
	 * Are *any* of the fields in the form currently `dirty`?
	 */
	dirty: boolean
	/**
	 * Are *all* of the fields in the form currently `valid`?
	 */
	valid: boolean
	/**
	 * Are *any* of the fields in the form currently `validating`?
	 */
	validating: boolean
	/**
	 * Reset all of the fields in the form.
	 */
	reset: () => void
	/**
	 * Validate all of the fields in the form.
	 */
	validate: () => Promise<void>
	/**
	 * Submit the form manually.
	 */
	submit: () => Promise<void>

	/**
	 * Props to pass into a form component to attach the `form` to it:
	 */
	props: {
		/**
		 * An `onSubmit` handler to pass to an element that submits the form.
		 */
		onSubmit: () => Promise<void>
	}
}

/**
 * Call `useField()` to create a single field in a form.
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
	let [required, setRequired] = React.useState(options.required || false)
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
		valueRef.current = defaultValue;
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

	let valid = !errors.length && (required ? !isEmptyValue(value) : true)

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
		required,
		disabled,
		readOnly,
		setRequired,
		setDisabled,
		setReadOnly,
		reset,
		validate,
		props: {
			value,
			required,
			disabled,
			readOnly,
			onFocus,
			onBlur,
			onChange,
		},
	}
}

/**
 * Call `useForm()` with to create a single form.
 */
export function useForm<Err = string>(options: FormOptions<Err>): Form<Err> {
	let fields = options.fields
	let onSubmit = options.onSubmit
	let [submitted, setSubmitted] = React.useState(false)
	let [submitting, setSubmitting] = React.useState(false)
	let [submitErrors, setSubmitErrors] = React.useState<Err[]>([])

	let focused = fields.some(field => field.focused)
	let touched = fields.some(field => field.touched)
	let dirty = fields.some(field => field.dirty)
	let valid = fields.every(field => field.valid)
	let validating = fields.some(field => field.validating)

	let fieldErrors = fields.reduce(
		(errors, field) => errors.concat(field.errors),
		[] as Err[],
	)

	function reset() {
		setSubmitted(false)
		setSubmitting(false)
		setSubmitErrors([])
		fields.forEach(field => field.reset())
	}

	function validate() {
		return Promise.all(fields.map(field => field.validate())).then(() => {})
	}

	function onSubmitHandler() {
		setSubmitted(true)
		setSubmitting(true)

		return Promise.resolve()
			.then(() => onSubmit() as any) // Dunno why TS is mad
			.then((errs: void | Err[]) => {
				setSubmitting(false)
				setSubmitErrors(errs || [])
			})
			.catch((err: Error) => {
				setSubmitting(false)
				throw err
			})
	}

	return {
		fieldErrors,
		submitErrors,
		submitted,
		submitting,
		focused,
		touched,
		dirty,
		valid,
		validating,
		validate,
		reset,
		submit: onSubmitHandler,
		props: {
			onSubmit: onSubmitHandler,
		},
	}
}
