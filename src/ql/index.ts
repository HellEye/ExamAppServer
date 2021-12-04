import { UserResolver } from "./Users"
import { TestResolver } from "./Tests"
import { CommentResolver } from "./Comments"
import { QuestionResolver } from "./Questions"
const resolvers = [
	UserResolver,
	TestResolver,
	CommentResolver,
	QuestionResolver,
] as const

export { resolvers }
