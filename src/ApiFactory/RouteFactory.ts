import { Application, RequestHandler, Request, Response } from "express"
import { Document, Model, Query } from "mongoose"
import {
	ControllerObject,
	HttpMethods,
	generators,
	ProjectionExpression,
} from "./ControllerFactory"
import { Nullable } from "../Types/common"
interface ExtraDbMethods {
	dbFunc: string
	params: ((req: Request) => any) | any
}
type Method = "get" | "post" | "put" | "delete"
type QueryParamValues = string | Object
type QueryParams = { [key: string]: QueryParamValues }

/**
 * @param method: HTTP method to use
 * @param apiPath: Full path to access this endpoint
 * @param dbFunc: Database access function from a predefined list
 * @param extra: Extra database functions to perform on cursor before collecting
 * @param params: Change queryparam handling (big chunk of code, not advised)
 * @param data: Change what part of request is returned as data (default: req.body)
 * @param then: modify the response before replying
 * @param catch: change error handling behavior
 */
interface ApiObject<D extends Document> {
	/**@param method: HTTP method to use*/
	method: Method
	/**@param apiPath: Full path to access this endpoint */
	apiPath: string
	/**@param dbFunc: Database access function from a predefined list */
	dbFunc: DbFunctions
	/** @param extra: Extra database functions to perform on cursor before collecting */
	extra?: ExtraDbMethods[]
	/** @param params: Change queryparam handling (big chunk of code, not advised) */
	params: (req: Request) => QueryParams
	/**@param projection: Set the projection expression for data */
	projection: ProjectionExpression<D>
	/**@param data: Change what part of request is returned as data (default: req.body) */
	data: (req: Request) => any
	/**@param then: modify the response before replying */
	then: (res: Response) => (data: any) => any
	/**@param catch: change error handling behavior */
	catch: (res: Response) => (e: any) => any
}

interface ApiBuilder<D extends Document> {
	override: (
		method: Method,
		path: string,
		obj: Partial<ApiObject<D>>
	) => ApiBuilder<D>
	finish: () => void
}

type DbFunctions =
	| "findOne"
	| "find"
	| "create"
	| "insertMany"
	| "findOneAndUpdate"
	| "updateMany"
	| "deleteOne"
	| "deleteMany"

const getDbFunc = (method: HttpMethods, many: boolean = false): DbFunctions => {
	switch (method) {
		case HttpMethods.get:
			return `find${many ? "" : "One"}`
		case HttpMethods.post:
			return many ? "insertMany" : "create"
		case HttpMethods.put:
			return many ? "updateMany" : "findOneAndUpdate"
		case HttpMethods.delete:
			return `delete${many ? "Many" : "One"}`
	}
}
type ControlParam = "sort"

const ControlParams: ControlParam[] = ["sort"]

const FuzzyMatchOperator = "~"

const getApi = <D extends Document>(
	app: Application,
	data: ControllerObject<D>
): ApiBuilder<D> => {
	const out: { [key: string]: ApiObject<D> } = {}

	data.controllers.forEach((c) => {
		const newApi: ApiObject<D> = {} as ApiObject<D>
		newApi.apiPath = `${data.basePath}${c.path}`
		newApi.method = c.method
		newApi.dbFunc = getDbFunc(c.method, c.many)

		c.allowedQueryParams?.forEach((q: string | ControlParam) => {
			if (ControlParams.findIndex((param) => param === q) !== -1) {
				if (!newApi.extra) newApi.extra = []
				switch (q) {
					case "sort":
						newApi.extra.push({
							dbFunc: "sort",
							params: (req: Request): Nullable<{}> => {
								if (!req.query.sort) return null
								if (typeof req.query.sort === "string")
									return JSON.parse(req.query.sort)
								return req.query.sort
							},
						})
				}
			}
		})
		newApi.params = (req: Request) => {
			// ~ fuzzy match
			const findObj: QueryParams = {} as QueryParams
			for (let [key, param] of Object.entries(req.params)) {
				if (key === "id") findObj._id = param
				else findObj[key] = param
			}
			c.allowedQueryParams?.forEach((q: string | ControlParam) => {
				if (ControlParams.findIndex((param) => param === q) !== -1) return
				const queryValue = req.query[q]
				if (queryValue) {
					// fuzzy matching
					if (
						typeof queryValue === "string" &&
						queryValue.charAt(0) === FuzzyMatchOperator
					) {
						findObj[q] = { $regex: queryValue.slice(1) }
					} else {
						findObj[q] = queryValue as string
					}
				}
			})
			return findObj
		}

		newApi.projection = {
			__v: 0,
		}

		newApi.data = (req: Request) => {
			return req.body
		}
		newApi.then =
			(res) =>
			(data: any): any => {
				return res.send(data)
			}
		newApi.catch =
			(res) =>
			(e: any): any => {
				return res.status(500).send({ message: e })
			}
		out[`${c.method}:${`${c.path}`}`] = newApi
	})

	const override = (
		method: Method,
		path: string,
		obj: Partial<ApiObject<D>>
	): ApiBuilder<D> => {
		out[`${method}:${path}`] = {
			...out[`${method}:${path}`],
			...obj,
		}
		return funcs
	}
	const finish = () => {
		for (let [key, obj] of Object.entries(out)) {
			app[obj.method](obj.apiPath, async (req, res) => {
				const findObj = obj.params(req)
				const newData = obj.data(req)
				const projection = obj.projection
				let query = generators[obj.dbFunc](data.model, {
					findObj,
					data: newData,
					projection,
				})
				if (obj.extra) {
					for (let extra of obj.extra) {
						const queryParams =
							typeof extra.params === "function"
								? extra.params(req)
								: extra.params
						if (queryParams) query[extra.dbFunc](queryParams)
					}
				}

				query.then(obj.then(res)).catch(obj.catch(res))
			})
		}
	}
	const funcs: ApiBuilder<D> = {
		override,
		finish,
	}
	return funcs
}

export default getApi
