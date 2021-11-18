import data from "../Controllers/Questions.controller"
import { RoutesInput } from "../Types/route"
import { IQuestion } from "../Models"
import { getApi } from "../ApiFactory"

const routes = (app: RoutesInput) => {
	getApi<IQuestion>(app, data).finish()
}

export default routes
