import data from "../Controllers/Users.controller"
import { RoutesInput } from "../Types/route"
import { IUser } from "../Models"
import { getApi } from "../ApiFactory"

const routes = (app: RoutesInput) => {
	getApi<IUser>(app, data).finish()
}

export default routes
