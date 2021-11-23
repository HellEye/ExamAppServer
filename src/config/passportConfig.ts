import { Passport, PassportStatic } from "passport"
import {
	IStrategyOptions,
	Strategy as LocalStrategy,
	VerifyFunction,
} from "passport-local"
import AuthTokenStrategy from "passport-auth-token"
import UsersModel from "../Models/Users.model"
import bcrypt from "bcrypt"
import UserTokensModel from "../Models/UserTokens.model"

const getLocalStrategy = () => {
	const authenticateUser: VerifyFunction = async (username, password, done) => {
		try {
			const user = await UsersModel.findOne(
				{ username: username },
				{ __v: 0 },
				{ lean: true }
			).exec()
			if (!user) {
				return done(null, false, { message: "login.errors.userNotFound" })
			}

			try {
				if (await bcrypt.compare(password, user.password)) {
					const userToReturn = { ...user, password: undefined }

					return done(null, userToReturn, {
						message: "login.message.successfulLogin",
					})
				}
				return done(null, false, { message: "login.errors.incorrectPassword" })
			} catch (e) {
				return done(e, false, { message: "login.errors.serverError" })
			}
		} catch (e) {
			return done(e, false, { message: "login.errors.databaseError" })
		}
	}
	const strategyOptions: IStrategyOptions = { usernameField: "username" }
	const localStrategy = new LocalStrategy(strategyOptions, authenticateUser)
	return localStrategy
}

const getTokenStrategy = () => {
	const authenticateUser = async (token: any, done: any) => {
		try {
			console.log("Token: ", token)
			const foundToken = await UserTokensModel.findOne(
				{ token: token },
				{ token: 1, user: 1 },
				{ lean: true }
			).exec()

			if (!foundToken) {
				return done(null, false, { message: "login.errors.tokenExpired" })
			}

			const foundUser = await UsersModel.findOne(
				{
					_id: foundToken.user,
				},
				{ __v: 0, password: 0 },
				{ lean: true }
			).exec()

			if (!foundUser) {
				return done(null, false, { message: "login.errors.userNotFound" })
			}

			return done(
				null,
				{ user: foundUser, token: foundToken },
				{ message: "login.message.successfulLogin" }
			)
		} catch (e) {
			return done(e, false, { message: "login.errors.databaseError" })
		}
	}
	const tokenStrategy = new AuthTokenStrategy(authenticateUser)
	return tokenStrategy
}

export default (passport: PassportStatic) => {
	passport.use("local", getLocalStrategy())
	passport.use("authtoken", getTokenStrategy())
	const serializeUser = (user: any, done: any) => done(null, user._id)
	passport.serializeUser(serializeUser)

	const deserializeUser = async (id: any, done: any) => {
		try {
			const user = await UsersModel.findOne(
				{ _id: id },
				{},
				{ lean: true }
			).exec()
			return done(null, user)
		} catch (e) {
			return done(e, false, { message: "login.errors.databaseError" })
		}
	}
	passport.deserializeUser(deserializeUser)
}
