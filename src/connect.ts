import mongoose from "mongoose"

type DBInput = {
	db: string
}

export default async (db: string) => {
	const connect = async () => {
		try {
			await mongoose.connect(db)
			console.info(`Connected to ${db}`)
		} catch (err) {
			console.error(`error connecting to ${db}: `, err)
			process.exit(1)
		}
	}

	await connect()

	mongoose.connection.on("disconnected", connect)
}
