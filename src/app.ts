import express, { Application, Request, Response } from "express"
import initPassport from "./config/passportConfig"
import session from "express-session"
import flash from "express-flash"
import connect from "./connect"
import passport from "passport"
import Routes from "./Routes"
import https from "https"
import http from "http"
import fs from "fs"

initPassport(passport)

const httpsOptions = {
	key: fs.readFileSync(`${__dirname}/../cert/certificate.key`),
	cert: fs.readFileSync(`${__dirname}/../cert/certificate.crt`),
}

const app: Application = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(flash())
if (!process.env.SESSION_SECRET)
	throw Error("Can't find SESSION_SECRET in env variables")

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
)

app.use(
	passport.initialize({
		userProperty: "currentUser",
	})
)
app.use(passport.session())

app.get("/", (req: Request, res: Response) => {
	res.send("TS App is running")
})

app.get("/api", (req, res) => {
	res.send(
		app._router.stack
			.map((r: any) => {
				if (!r.route) return ""
				const method = Object.keys(r.route.methods)[0]
				return `${method}:${r.route.path}`
			})
			.filter((v: string) => v !== "")
	)
})

const PORT = process.env.PORT || "wrong env port"
const HTTPSPORT = process.env.HTTPSPORT || "wrong env https port"
const db = process.env.MONGO_URL || "wrong env dburl"

connect({ db })

Routes(app, passport)

// app.listen(PORT, () => {
// 	console.log(`Express is listening on port ${PORT}`)
// })

// https necessity
const httpServer = http.createServer(app)
const httpsServer = https.createServer(httpsOptions, app)

httpServer.listen(PORT, () => {
	console.log(`Listening for http on port ${PORT}`)
})
httpsServer.listen(HTTPSPORT, () => {
	console.log(`Listening for https on port ${HTTPSPORT}`)
})
