import data from "../Controllers/Users.controller"
import { RoutesInput } from "../Types/route"
import { IUser } from "../Models"
import { getApi } from "../ApiFactory"
const routes = (app: RoutesInput) => {
	getApi<IUser>(app, data)
		.override("get", "/:id", {
			projection: {
				__v: 0,
				password: 0,
			},
		})
		.override("get", "/", {
			projection: {
				__v: 0,
				password: 0,
			},
		})
		.finish()
}

export default routes
