import { FindTestInput, Tests } from "./TestSchema"

class TestService {
	async getAllTests() {
		return await Tests.find({}).lean()
	}
	async getTest(input: FindTestInput) {
		return await Tests.findOne(input).lean()
	}
}

export default TestService
