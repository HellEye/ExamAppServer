import mongoose, { Schema, Document, ObjectId } from "mongoose"

export interface IUser extends Document {
	login: String
	password: String
	displayName: String
}

const UserSchema: Schema = new Schema({
	login: {
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
