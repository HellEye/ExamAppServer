import { Arg, Mutation, Query, Resolver } from "type-graphql"

import { InputId, Message } from "../common"
import { CreateQuestionType, Question, Questions } from "./QuestionSchema"

@Resolver()
class QuestionResolver {
	@Query(() => [Question])
	async getQuestionsForTest(@Arg("test") _id: string) {
		return await Questions.find({ test: _id })
	}
	@Query(() => Question)
	async getQuestion(@Arg("id") _id: string) {
		return await Questions.find({ _id })
	}
	@Mutation(() => Question)
	async createQuestion(@Arg("input") input: CreateQuestionType) {
		return await Questions.create(input)
	}

	@Mutation(() => Question)
	async updateQuestion(@Arg("id") _id: string, input: CreateQuestionType) {
		return await Questions.findOneAndUpdate({ _id }, { $set: { ...input } })
	}

	@Mutation(() => Message)
	async deleteQuestion(@Arg("id") _id: string) {
		await Questions.deleteOne({ _id })
		return { message: "questions.delete.success" }
	}
}

export { QuestionResolver }
