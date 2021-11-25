import data from "../Controllers/Tests.controller"
import { RoutesInput } from "../Types/route"
import { ITest } from "../Models"
import { getApi } from "../ApiFactory"
import bcrypt from "bcrypt"
import TestsModel from "../Models/Tests.model"
import UserTokensModel from "../Models/UserTokens.model"

const routes = (app: RoutesInput) => {
	getApi<ITest>(app, data)
		.override("post", "/", {
			data: async (req) => {
				if (req.body.password)
					req.body.password = await bcrypt.hash(req.body.password, 10)
				console.log(req.body)
				return req.body
			},
		})
		.override("put", "/:id", {
			authorize: async (req) => {
				const test = await TestsModel.findById(req.params.id)
				if (req.body.password && test) {
					return await bcrypt.compare(test.password, req.body.password)
				}
				if (req.cookies.token && test) {
					const userToken = await UserTokensModel.findOne({
						token: req.cookies.token,
					})
					return userToken?.user === test.user
				}
				return false
			},
		})
		.finish()
}

export default routes
