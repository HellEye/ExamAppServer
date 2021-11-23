import { RoutesInput } from "../Types/route"
import tests from "./tests.routes"
import questions from "./questions.routes"
import users from "./users.routes"
import comments from "./comments.routes"
import login from "./login.routes"
import { PassportStatic } from "passport"

type RouteInitFunc = (app: RoutesInput, passport?: PassportStatic) => void
const routes: RouteInitFunc[] = [tests, questions, users, comments, login]

const init = (app: RoutesInput, passport: PassportStatic) => {
	routes.forEach((r) => r(app, passport))
}
export default init
