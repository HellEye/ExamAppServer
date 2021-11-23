import mongoose from "mongoose"
import crypto from "crypto"
import { RoutesInput } from "../Types/route"
import UsersModel from "../Models/Users.model"
import bcrypt from "bcrypt"
import { Request, Response } from "express"
import { PassportStatic } from "passport"
import UserTokensModel from "../Models/UserTokens.model"
import { request } from "http"
const routes = (app: RoutesInput, passport?: PassportStatic): void => {
	if (!passport) return

	app.post("/api/register", async (req, res) => {
		const userWithSameName = await UsersModel.findOne({
			username: req.body.username,
		}).exec()
		if (userWithSameName) {
			res.status(400).send({ message: "register.errors.usernameExists" })
		}
		try {
			const hashedPassword = await bcrypt.hash(req.body.password, 10)
			await UsersModel.create({
				username: req.body.username,
				password: hashedPassword,
				displayName: req.body.displayName || req.body.username,
			})
			res.send({ message: "register.messages.registerSuccess" })
		} catch (e) {
			console.error(e)
			return res
				.status(500)
				.send({ message: "register.errors.unknownError", error: e })
		}
	})

	app.post("/api/user/checkName", async (req, res) => {
		const userWithSameName = await UsersModel.findOne({
			username: req.body.value,
		}).exec()
		if (userWithSameName) {
			return res.send({
				status: "ERROR",
				message: "register.errors.usernameExists",
			})
		}
		return res.send({ status: "OK" })
	})

	const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24
	//Oh my god
	app.post("/api/login", async (req, res, next) => {
		const getTokenExpireDate = (expireIn: number) => {
			if (expireIn === -1) return undefined
			return new Date(Date.now() + expireIn * DAY_IN_MILLISECONDS)
		}

		const authWithPassword = passport.authenticate(
			"local",
			{
				failureRedirect: "/login",
				failureFlash: false,
			},
			async (err, user, info) => {
				try {
					if (err) return res.status(500).send(info)
					if (!user) return res.status(401).send(info)
					const randomBytes = crypto.randomBytes(32).toString("hex")
					const expireIn = req.body.expireIn
					//if expireIn === 0 - don't generate token
					if (expireIn === 0) return res.send({ user, ...info })
					const newToken = await UserTokensModel.create({
						user: user._id,
						token: randomBytes,
						expireAt: getTokenExpireDate(expireIn),
						expireIn,
					})
					return res.send({ user, token: newToken, ...info })
				} catch (e) {
					console.error("ERROR SOMEWHERE", e)
					return res
						.status(500)
						.send({ error: e, message: "login.errors.serverError" })
				}
			}
		)
		if (req.body.token) {
			return await passport.authenticate(
				"authtoken",
				{
					failureFlash: false,
				},
				async (err, user, info) => {
					if (err) return res.status(500).send(info)
					if (!user) {
						if (req.body.username && req.body.password)
							return await authWithPassword(req, res, next)
						else return res.status(401).send("autologin fail")
					}

					const expireIn = req.body.expireIn
					await UserTokensModel.updateOne(
						{ _id: user.token._id },
						{
							$set: {
								expireAt: getTokenExpireDate(expireIn),
								expireIn: expireIn,
							},
						}
					)
					return res.send({ ...user.user, ...info })
				}
			)(req, res, next)
		}
		return authWithPassword(req, res, next)
	})

	app.delete("/api/logout", (req, res) => {
		req.logOut()
		return res.redirect("/logout")
	})

	app.get("/api/session", (req, res) => {
		return res.send(req.body.currentUser)
	})
}

export default routes
