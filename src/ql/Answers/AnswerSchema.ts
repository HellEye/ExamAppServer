import { ObjectType, Field, InputType } from "type-graphql"
import { getModelForClass, prop, Ref } from "@typegoose/typegoose"
import { MaxLength, MinLength } from "class-validator"
import { ObjectId, Schema } from "mongoose"
import { Question } from "../Questions"

@ObjectType()
export class Answer {
	@Field(() => String)
	readonly _id!: string

	@Field(() => String)
	@prop()
	answer: string

	@Field(() => Boolean)
	@prop()
	isRight: Boolean

	@Field(() => String)
	@prop({ ref: () => Question })
	question: Ref<Question>
}

@InputType()
export class CreateAnswerType {
	@Field(() => String)
	answer: string
	@Field(() => Boolean)
	isRight: boolean
	@Field(() => String)
	question: string
}

const Answers = getModelForClass(Answer)
export { Answers }
