import Jwt from "jsonwebtoken"

const privateKey = Buffer.from(
	process.env.PRIVATE_KEY as string,
	"base64"
).toString("ascii")
const publicKey = Buffer.from(
	process.env.PUBLIC_KEY as string,
	"base64"
).toString("ascii")

const signJwt = (object: Object, options?: Jwt.SignOptions) => {
	return Jwt.sign(object, privateKey, {
		...options,
		algorithm: "RS256",
	})
}

const verifyJwt = <T>(token: string): T | null => {
	try {
		return Jwt.verify(token, publicKey) as T
	} catch (e) {
		return null
	}
}
export { signJwt, verifyJwt }
