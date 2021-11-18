import data from "../Controllers/Comments.controller"
import { RoutesInput } from "../Types/route"
import { IComment } from "../Models"
import { getApi } from "../ApiFactory"

const routes = (app: RoutesInput) => {
	getApi<IComment>(app, data).finish()
}

export default routes
