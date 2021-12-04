import { Arg, Mutation, Query, Resolver } from "type-graphql"
import { FindTestInput } from "."
import { Test } from "./TestSchema"
import TestService from "./TestService"

@Resolver()
class TestResolver {
	constructor(private testService: TestService) {
		this.testService = new TestService()
	}
	@Query(() => [Test])
	async getAllTests() {
		return await this.testService.getAllTests()
	}
	@Query(() => Test)
	async getTest(@Arg("input") input: FindTestInput) {
		return await this.testService.getTest(input)
	}
}

export { TestResolver }
