import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql"
import { LoginInput, LoginToken } from "."
import Context from "../../Types/Context"
import { Message } from "../common"
import UserTokenService from "../UserTokens/UserTokenService"
import { CreateUserInput, User, Users } from "./UserSchema"
import UserService from "./UserService"

@Resolver()
class UserResolver {
	constructor(private userService: UserService) {
		this.userService = new UserService(new UserTokenService())
	}
	@Query(() => [User])
	async getAllUsers() {
		const u = await Users.find({})
		console.log(u)
		return await this.userService.getAllUsers()
	}

	@Mutation(() => Message)
	async createUser(@Arg("input") input: CreateUserInput) {
		return await this.userService.createUser(input)
	}

	@Mutation(() => LoginToken)
	async login(
		@Arg("input", { nullable: true }) input: LoginInput,
		@Ctx() context: Context
	) {
		if (context.req.cookies.token)
			return await this.userService.loginWithToken(
				context.req.cookies.token,
				context
			)
		return await this.userService.loginWithUsername(input, context)
	}
}

export { UserResolver }
