import { Request, Response } from "express"
import { User } from "../ql/Users"
interface Context {
	req: Request
	res: Response
}

export default Context
