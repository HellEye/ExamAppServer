import { Arg, Mutation, Query, Resolver } from "type-graphql"
import { CommentInput } from "."
import { Message } from "../common"
import { Comment, Comments } from "./CommentSchema"

@Resolver()
class CommentResolver {
	@Query(() => [Comment])
	async getCommentsForQuestion(@Arg("test") test: string) {
		return await Comments.find({ test })
	}

	@Mutation(() => Comment)
	async createComment(@Arg("input") input: CommentInput) {
		return await Comments.create(input)
	}

	@Mutation(() => Comment)
	async updateComment(
		@Arg("id") _id: string,
		@Arg("input") input: CommentInput
	) {
		return await Comments.findOneAndUpdate({ _id }, input)
	}

	@Mutation(() => Message)
	async deleteComment(@Arg("id") _id: string) {
		await Comments.deleteOne({ _id })
		return { message: "comments.delete.success" }
	}
}

export { CommentResolver }
