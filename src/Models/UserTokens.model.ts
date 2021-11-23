import mongoose, { Schema, Document, ObjectId, Date } from "mongoose"

export interface IUserToken extends Document {
	user: ObjectId
	token: string
	expireAt: Date
	expireIn: Number
}

const UserTokenSchema: Schema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Users",
	},
	token: {
		type: String,
		required: true,
	},
	expireAt: {
		type: Schema.Types.Date,
	},
	expireIn: {
		type: Number,
		default: 0,
		required: true,
	},
})

export default mongoose.model<IUserToken>("UserTokens", UserTokenSchema)
