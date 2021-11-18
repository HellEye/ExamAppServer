import mongoose, { Schema, Document, ObjectId } from "mongoose"

export interface IComment extends Document {
	question: ObjectId
	author: String
	user?: ObjectId
	text: String
	posted: Schema.Types.Date
}

const CommentSchema: Schema = new Schema({
	question: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Question",
	},
	author: {
		type: String,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		required: false,
		ref: "User",
	},
	text: {
		type: String,
		required: true,
	},
	posted: {
		type: Schema.Types.Date,
		required: true,
	},
})

export default mongoose.model<IComment>("Comments", CommentSchema)
