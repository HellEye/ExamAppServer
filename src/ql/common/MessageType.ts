import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class MessageType {
	@Field(() => String, { nullable: true })
	message?: string

	@Field(() => String, { nullable: true })
	error?: string
}
