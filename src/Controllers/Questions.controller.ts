import { Question, IQuestion } from "../Models"
import { getCrud } from "../ApiFactory"

const crud = getCrud<IQuestion>("/api/questions", Question)
	.get("/:id")
	.get("/", ["test"])
	.update("/:id")
	.add("/")
	.delete("/:id")
	.finish()
export default crud
