import { Test, ITest } from "../Models"
import { getCrud } from "../ApiFactory"

const crud = getCrud<ITest>("/api/tests", Test)
	.get("/:id")
	.get("/", ["author", "user", "added", "modified", "sort"])
	.update("/:id")
	.add("/")
	.delete("/:id")
	.finish()
export default crud
