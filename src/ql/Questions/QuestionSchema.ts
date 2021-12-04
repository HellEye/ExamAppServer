import { ObjectType, Field, InputType } from "type-graphql"
import { getModelForClass, prop, Ref } from "@typegoose/typegoose"
import { MaxLength, MinLength } from "class-validator"
import { ObjectId, Schema } from "mongoose"
import { Test } from "../Tests"

@ObjectType()
export class Question {
	@Field(() => String)
	readonly _id!: string
	@Field(() => String)
	@prop({ required: true })
	text: string
	@Field(() => String)
	@prop({ ref: () => Test, required: true })
	test: Ref<Test>
	@Field(() => String)
	@prop()
	type: string
}

@InputType()
export class CreateQuestionType {
	@Field(() => String)
	text: string
	@Field(() => String)
	test: string
	@Field(() => String)
	type: string
}

const Questions = getModelForClass(Question)
export { Questions }
