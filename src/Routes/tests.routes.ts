import data from "../Controllers/Tests.controller"
import { RoutesInput } from "../Types/route"
import { ITest } from "../Models"
import { getApi } from "../ApiFactory"

const routes = (app: RoutesInput) => {
	getApi<ITest>(app, data).finish()
}

export default routes
