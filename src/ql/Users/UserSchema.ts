import { ObjectType, Field, InputType } from "type-graphql"
import { getModelForClass, prop, pre, index } from "@typegoose/typegoose"
import { MaxLength, MinLength } from "class-validator"
import bcrypt from "bcrypt"
@ObjectType()
@pre<User>("save", async function (next) {
	this.username = this.username.replace(" ", "").toLowerCase()
	if (!this.isModified("password")) return next()
	this.password = await bcrypt.hash(this.password, 10)
	next()
})
export class User {
	@Field(() => String)
	readonly _id!: string

	@prop({ required: true, unique: true, index: true })
	@Field(() => String)
	username!: string

	@prop({ required: true })
	password!: string

	@prop()
	@Field(() => String, { nullable: true })
	displayName?: string
}

@InputType()
export class CreateUserInput {
	@Field(() => String)
	@MinLength(4, {
		message: "register.error.usernameTooShort",
	})
	@MaxLength(50, {
		message: "register.error.usernameTooLong",
	})
	username: string

	@MinLength(6, {
		message: "register.error.passwordTooShort",
	})
	@MaxLength(50, {
		message: "register.error.passwordTooLong",
	})
	@Field(() => String)
	password: string

	@MinLength(3, {
		message: "register.error.displayNameTooShort",
	})
	@MaxLength(50, {
		message: "register.error.displayNameTooLong",
	})
	@Field(() => String)
	displayName?: string
}

@InputType()
export class LoginInput {
	@Field(() => String, { nullable: true })
	username?: string

	@Field(() => String, { nullable: true })
	password?: string

	@Field(() => Number, { nullable: true })
	expireIn?: number
}

@InputType()
export class TokenLoginInput {
	@Field(() => String)
	token: string
}

@ObjectType()
export class LoginToken {
	@Field(() => User, { nullable: true })
	user?: User

	@Field(() => String, { nullable: true })
	token?: string

	@Field(() => String, { nullable: true })
	message?: string
}

const Users = getModelForClass(User)
export { Users }
