declare module "email-regex" {
	export interface EmailRegexOpts {
		exact?: boolean
	}

	export default function emailRegex(opts?: EmailRegexOpts): RegExp
}
