import { ObjectType, Field, InputType } from "type-graphql"
import { getModelForClass, pre, prop, Ref } from "@typegoose/typegoose"
import { MaxLength, MinLength } from "class-validator"
import { ObjectId, Schema } from "mongoose"
import { User } from "../Users"
import { Question } from "../Questions"

@ObjectType()
@pre<Comment>("save", function () {
	if (!this.posted) this.posted = new Date()
})
export class Comment {
	@Field(() => String)
	readonly _id!: string

	@Field(() => String)
	@prop({ required: true })
	author: string

	@Field(() => String, { nullable: true })
	@prop({ ref: () => User })
	user?: Ref<User>

	@Field(() => String)
	@prop({ required: true })
	text: string

	@Field(() => Date)
	@prop({ required: true })
	posted: Date

	@Field(() => String)
	@prop({ required: true, ref: () => Question })
	question: Ref<Question>
}

@InputType()
export class CommentInput {
	@Field(() => String)
	author: string

	@Field(() => String, { nullable: true })
	user?: string

	@Field(() => String)
	text: string
}

const Comments = getModelForClass(Comment)
export { Comments }
