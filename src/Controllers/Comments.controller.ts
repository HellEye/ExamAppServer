import { Comment, IComment } from "../Models"
import { getCrud } from "../ApiFactory"

const crud = getCrud<IComment>("/api/comments", Comment)
	.get("/:id")
	.get("/", ["author", "user", "posted", "sort", "question"])
	.update("/:id")
	.add("/")
	.delete("/:id")
	.finish()
export default crud
