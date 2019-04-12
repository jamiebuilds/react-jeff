import React from "react"
import { Form, Field } from "../src/react-jeff"
import format from "pretty-format"

export interface ControlProps<Val> {
	children: React.ReactNode
	form: Form<Val>
	field: Field<Val>
}

export function Control<Val>(props: ControlProps<Val>) {
	return (
		<div className="control">
			{props.children}
			{(props.field.dirty || props.form.submitted) && (
				<>
					{props.field.validating && (
						<p className="control-status">Validating...</p>
					)}
					{props.field.errors && (
						<ul className="control-error">
							{props.field.errors.map(err => {
								return <li key={err}>{err}</li>
							})}
						</ul>
					)}
				</>
			)}
			<pre>
				{"field = "}
				{format(props.field, {
					printFunctionName: false,
				})}
			</pre>
		</div>
	)
}
