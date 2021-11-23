import { User, IUser } from "../Models"
import { getCrud } from "../ApiFactory"

const crud = getCrud<IUser>("/api/users", User)
	.get("/:id")
	.get("/")
	.update("/:id")
	.add("/")
	.delete("/:id")
	.finish()
export default crud
