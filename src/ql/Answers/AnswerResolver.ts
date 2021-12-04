import { Arg, Mutation, Query, Resolver } from "type-graphql"
import { CreateAnswerType } from "."
import { Message } from "../common"
import { Answer, Answers } from "./AnswerSchema"

@Resolver()
class AnswerResolver {
	@Query(() => [Answer])
	async getAnswersForQuestion(@Arg("question") _id: string) {
		return await Answers.find({ question: _id })
	}

	@Mutation(() => Answer)
	async addAnswer(@Arg("input") input: CreateAnswerType) {
		return await Answers.create(input)
	}

	@Mutation(() => Answer)
	async updateAnswer(
		@Arg("id") _id: string,
		@Arg("input") input: CreateAnswerType
	) {
		return await Answers.updateOne({ _id }, { $set: { ...input } })
	}

	@Mutation(() => Message)
	async removeAnswer(@Arg("id") _id: string) {
		await Answers.deleteOne({ _id })
		return { message: "answers.delete.success" }
	}
}

export { AnswerResolver }
