import express from "express"
import reflectMetadata from "reflect-metadata/"
import cookieParser from "cookie-parser"
import { buildSchema } from "type-graphql"
import connect from "./connect"

import { resolvers } from "./ql"
import { ApolloServer } from "apollo-server/node_modules/apollo-server-express"
import {
	ApolloServerPluginLandingPageGraphQLPlayground,
	ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server/node_modules/apollo-server-core"
const bootstrap = async () => {
	//Build schema
	const schema = await buildSchema({
		resolvers,
		// authChecker
	})
	//init express
	const app = express()
	//apply express middleware
	app.use(cookieParser())
	//create apollo server
	const server = new ApolloServer({
		schema,
		context: (ctx) => {
			return ctx
		},

		plugins: [
			process.env.NODE_ENV === "production"
				? ApolloServerPluginLandingPageProductionDefault()
				: ApolloServerPluginLandingPageGraphQLPlayground(),
		],
	})
	//start server
	await server.start()
	//apply server middleware
	server.applyMiddleware({ app })
	//connect to db
	connect(process.env.MONGO_URL || "")
	//listen
	const PORT = process.env.PORT
	app.listen(PORT, () => {
		console.log(`App listening on port ${PORT}`)
	})
}

bootstrap()
