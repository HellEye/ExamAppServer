import { RoutesInput } from "../Types/route"
import tests from "./tests.routes"
import questions from "./questions.routes"
import users from "./users.routes"
import comments from "./comments.routes"

type RouteInitFunc = (app: RoutesInput) => void
const routes: RouteInitFunc[] = [tests, questions, users, comments]

const init = (app: RoutesInput) => {
	routes.forEach((r) => r(app))
}
export default init
