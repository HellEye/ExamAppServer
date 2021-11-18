import mongoose, { Schema, Document, ObjectId } from "mongoose"

export interface IQuestion extends Document {
	text: String
	answers: [
		{
			answer: String
			isRight: boolean
		}
	]
	test: ObjectId
	type: String
}

const QuestionSchema: Schema = new Schema({
	text: {
		type: String,
		required: true,
	},
	answers: [
		{
			answer: {
				type: String,
				required: true,
			},
			isRight: {
				type: Schema.Types.Boolean,
				required: true,
			},
		},
	],
	test: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Test",
	},
	type: {
		type: String,
		required: true,
	},
})

export default mongoose.model<IQuestion>("Questions", QuestionSchema)
