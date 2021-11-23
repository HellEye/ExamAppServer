import mongoose, { Schema, Document, ObjectId } from "mongoose"

export interface IUser extends Document {
	username: string
	password: string
	displayName: string
}

const UserSchema: Schema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	displayName: {
		type: String,
		required: true,
	},
})

export default mongoose.model<IUser>("Users", UserSchema)
