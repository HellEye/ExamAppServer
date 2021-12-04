import { ObjectType, Field, InputType } from "type-graphql"
import { getModelForClass, pre, prop, Ref } from "@typegoose/typegoose"
import { MaxLength, MinLength } from "class-validator"
import { ObjectId, Schema } from "mongoose"
import bcrypt from "bcrypt"
import { User } from "../Users"
@ObjectType()
@pre<Test>("save", async function (next) {
	this.modified = new Date()
	if (!this.isModified("password")) return next()
	this.password = await bcrypt.hash(this.password, 10)
	next()
})
export class Test {
	@Field(() => String)
	readonly _id!: string

	@Field(() => String)
	@prop({ required: true })
	author: String

	@Field(() => String)
	@prop({ required: true })
	name: string
	@Field(() => String, { nullable: true })
	@prop()
	description?: string

	@prop({ required: true })
	password: string

	@Field(() => String, { nullable: true })
	@prop({ ref: () => User, type: () => String })
	user?: Ref<User>

	@Field(() => Date)
	@prop({ type: Date, required: true, default: () => new Date() })
	created: Date

	@Field(() => Date)
	@prop({ type: Date, required: true, default: () => new Date() })
	modified: Date
}

@InputType()
export class FindTestInput {
	@Field()
	_id: string
}

const Tests = getModelForClass(Test)
export { Tests }
