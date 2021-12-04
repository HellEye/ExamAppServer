import { CreateUserInput, Users } from "./UserSchema"
import bcrypt from "bcrypt"
import { Types } from "mongoose"
import { LoginInput, LoginToken, TokenLoginInput } from "."
import { randomBytes } from "crypto"
import { DAY_IN_MILLISECONDS, UserTokens } from "../UserTokens"
import UserTokenService from "../UserTokens/UserTokenService"
import { Response } from "express"
import Context from "../../Types/Context"
const tokenCookieOptions = (expireIn: number) => ({
	maxAge: DAY_IN_MILLISECONDS * expireIn,
	path: "/",
})
class UserService {
	constructor(private userTokenService: UserTokenService) {
		this.userTokenService = new UserTokenService()
	}

	async getAllUsers() {
		return await Users.find({})
	}
	async createUser(input: CreateUserInput) {
		const userWithSameName = await Users.findOne(
			{
				username: input.username.replace(" ", "").toLowerCase(),
			},
			{},
			{ lean: true }
		)
		if (userWithSameName) {
			return { message: "register.errors.usernameExists" }
		}
		try {
			await Users.create(input)
			return { message: "register.messages.registerSuccess" }
		} catch (e) {
			console.error(e)
			return { message: "register.errors.unknownError", error: e }
		}
	}
	async loginWithUsername(
		{ username, password }: NonNullable<LoginInput>,
		context: Context
	): Promise<LoginToken> {
		if (!username || !password) return { message: "login.errors.unknownError" }
		try {
			const expireIn = context.req.cookies.expireIn
			const user = await Users.findOne({ username }, {}, { lean: true })
			if (!user) return { message: "login.errors.userNotFound" }
			if (!(await bcrypt.compare(password, user.password)))
				return { message: "login.errors.incorrectPassword" }
			const token = await this.userTokenService.createToken({
				userId: user._id,
				expireIn,
			})
			context.res.cookie("token", token, tokenCookieOptions(expireIn))
			return { user, token, message: "login.message.loginSuccessful" }
		} catch (e) {
			return { message: "login.errors.unknownError" }
		}
	}

	async loginWithToken(token: string, context: Context): Promise<LoginToken> {
		try {
			const foundToken = await this.userTokenService.findToken(token)
			if (!foundToken) return { message: "login.errors.tokenNotFound" }
			// if (!user) {
			// console.error("User not found but has token?")
			// return {message: "login.errors.userNotFound"}
			// }
			console.log(foundToken)
			foundToken.refreshExpireDate(context.req.cookies.expireIn)
			await foundToken.save()
			context.res.cookie(
				"token",
				token,
				tokenCookieOptions(foundToken.expireIn)
			)

			return {
				user: foundToken.user,
				message: "login.messages.loginSuccessful",
			}
		} catch (e) {
			return { message: "login.errors.unknownError" }
		}
	}
}
export default UserService
