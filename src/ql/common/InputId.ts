import { Field, InputType } from "type-graphql"

@InputType()
export class InputId {
	@Field(() => String)
	_id: string
}
