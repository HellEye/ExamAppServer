import { ObjectType, Field, InputType } from "type-graphql"
import {
	getModelForClass,
	index,
	pre,
	prop,
	Ref,
	queryMethod,
	ReturnModelType,
} from "@typegoose/typegoose"
import { MaxLength, MinLength } from "class-validator"
import { ObjectId, Schema } from "mongoose"
import { User } from "../Users"
export const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24

const getTokenExpireDate = (expireIn: number) => {
	if (expireIn === -1) return undefined
	return new Date(Date.now() + expireIn * DAY_IN_MILLISECONDS)
}

@ObjectType()
@pre<UserToken>("save", function (next) {
	this.refreshExpireDate()
	next()
})
class UserToken {
	@Field(() => String)
	readonly _id!: string

	@Field(() => String)
	@prop({ ref: () => User, required: true, index: true })
	user: Ref<User>

	@Field(() => String)
	@prop({ required: true, index: true })
	token: string
	@prop()
	expireAt?: Date
	@prop({ required: true, default: 0 })
	expireIn: number

	refreshExpireDate() {
		this.expireAt = getTokenExpireDate(this.expireIn)
	}
}

const UserTokens = getModelForClass(UserToken)
export { UserToken, UserTokens }
