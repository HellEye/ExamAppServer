import data from "../Controllers/Questions.controller"
import { RoutesInput } from "../Types/route"
import { IQuestion } from "../Models"
import { getApi } from "../ApiFactory"

const routes = (app: RoutesInput) => {
	getApi<IQuestion>(app, data)
		.override("get", "/", {
			projection: {
				_id: 1,
			},
			then: (res) => (data) => {
				res.send(data.map((e: IQuestion) => e._id))
			},
		})
		.finish()
}

export default routes
