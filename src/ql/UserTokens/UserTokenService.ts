import { randomBytes } from "crypto"
import { UserToken, UserTokens } from "."
import { User } from "../Users"

interface CreateTokenInput {
	userId: string
	expireIn: number
}

class UserTokenService {
	async findToken(token: string) {
		return await UserTokens.findOne({ token }).populate<{ user: User }>("user")
	}

	async createToken({ userId, expireIn }: CreateTokenInput): Promise<string> {
		const token = randomBytes(32).toString("hex")
		await UserTokens.create({
			user: userId,
			token: randomBytes,
			expireIn,
		})
		return token
	}

	async refreshToken(token: string) {
		const foundToken = await UserTokens.findOne({ token })
		foundToken?.refreshExpireDate()
	}
}

export default UserTokenService
