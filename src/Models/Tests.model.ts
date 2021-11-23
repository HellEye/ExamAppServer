import mongoose, { Schema, ObjectId, Document, Number } from "mongoose"

export interface ITest extends Document {
	_id: ObjectId
	author: ObjectId
	name: String
	description?: String
	password: String
	user?: ObjectId
	created: Schema.Types.Date
	modified: Schema.Types.Date
}

const testSchema: Schema = new Schema({
	author: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		required: false,
		ref: "User",
	},
	created: {
		type: Schema.Types.Date,
		required: true,
		default: Date.now,
		immutable: true,
	},
	modified: {
		type: Schema.Types.Date,
		required: true,
		default: Date.now,
	},
})

export default mongoose.model<ITest>("Test", testSchema)
