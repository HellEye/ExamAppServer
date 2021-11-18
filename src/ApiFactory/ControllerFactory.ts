import { Document, Model } from "mongoose"
export enum HttpMethods {
	get = "get",
	put = "put",
	post = "post",
	delete = "delete",
}
export interface Controller {
	method: HttpMethods
	path: string
	allowedQueryParams?: string[]
	many?: boolean
}
export interface ControllerObject<D extends Document> {
	basePath: string
	model: Model<D>
	//maybe other things

	// this is generated
	controllers: Controller[]
}

//shortcuts for html method types
type HTTPMethodFunc<D extends Document> = (
	path: string,
	query?: string[]
) => GetControllersOut<D>

type ControllerFinish<D extends Document> = () => ControllerObject<D>

type GetControllersOut<D extends Document> = {
	get: HTTPMethodFunc<D>
	update: HTTPMethodFunc<D>
	add: HTTPMethodFunc<D>
	delete: HTTPMethodFunc<D>
	finish: ControllerFinish<D>
}
export type GeneratorInput<D extends Document> = {
	findObj?: Partial<D>
	data?: Partial<D> | Partial<D>[]
}

export const generators: { [key: string]: any } = {
	findOne: <D extends Document>(
		model: Model<D>,
		{ findObj = {}, data = {} }: GeneratorInput<D>
	) => {
		return model.findOne(findObj as any)
	},
	find: <D extends Document>(
		model: Model<D>,
		{ findObj = {}, data = {} }: GeneratorInput<D>
	) => {
		return model.find(findObj as any)
	},

	create: <D extends Document>(
		model: Model<D>,
		{ findObj = {}, data = {} }: GeneratorInput<D>
	) => {
		return model.create(data)
	},
	insertMany: <D extends Document>(
		model: Model<D>,
		{ findObj = {}, data = {} }: GeneratorInput<D>
	) => {
		return model.insertMany(data as any)
	},

	findOneAndUpdate: <D extends Document>(
		model: Model<D>,
		{ findObj = {}, data = {} }: GeneratorInput<D>
	) =>
		model.findOneAndUpdate(findObj as any, data as any, {
			new: true,
		}),

	updateMany: <D extends Document>(
		model: Model<D>,
		{ findObj = {}, data = {} }: GeneratorInput<D>
	) =>
		model.updateMany(findObj as any, data as any, {
			new: true,
		}),

	findOneAndDelete: <D extends Document>(
		model: Model<D>,
		{ findObj = {}, data = {} }: GeneratorInput<D>
	) => model.findOneAndDelete(findObj as any),

	deleteMany: <D extends Document>(
		model: Model<D>,
		{ findObj = {}, data = {} }: GeneratorInput<D>
	) => model.deleteMany(findObj as any),
}

const getControllers = <D extends Document>(
	basePath: string,
	model: Model<D>
): GetControllersOut<D> => {
	const out: ControllerObject<D> = {
		basePath,
		model,
		controllers: [],
	}

	const addToController = (
		method: HttpMethods,
		path: string,
		query?: string[]
	) => {
		out.controllers.push({
			method,
			path,
			allowedQueryParams: query || [],
			many: query !== undefined,
		})
	}

	const finish: ControllerFinish<D> = (): ControllerObject<D> => {
		return out
	}

	const get: HTTPMethodFunc<D> = (path, query): GetControllersOut<D> => {
		addToController(HttpMethods.get, path, query)
		return funcs
	}
	const add: HTTPMethodFunc<D> = (path, query): GetControllersOut<D> => {
		addToController(HttpMethods.post, path, query)
		return funcs
	}
	const update: HTTPMethodFunc<D> = (path, query): GetControllersOut<D> => {
		addToController(HttpMethods.put, path, query)
		return funcs
	}
	const del: HTTPMethodFunc<D> = (path, query): GetControllersOut<D> => {
		addToController(HttpMethods.delete, path, query)
		return funcs
	}

	const funcs: GetControllersOut<D> = {
		finish,
		get,
		add,
		update,
		delete: del,
	}
	return funcs
}

export default getControllers
