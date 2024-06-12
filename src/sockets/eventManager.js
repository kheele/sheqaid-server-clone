
class EventManager {
	constructor() {
		this.events = {};
		this.cntrs = {};

		this.add = this.add.bind(this);
		this.get = this.get.bind(this);
		this.on = this.on.bind(this);
		this.emit = this.emit.bind(this);
	}

	add(root, cntr) {
		this.cntrs[root] = cntr;
	}

	get(root) {
		return this.cntrs[root];
	}

	// static async get(root) {
	// 	if (!this.cntrs[root])
	// 		throw new Error('controllers [' + root + '] not found');
	// 	return this.cntrs[root];
	// }

	on(path, fn) {
		this.events[path] = fn;
	}

	async emit(socket, path, args) {
		const fn = this.events[path];
		if (fn) {
			if (args) {
				if (Array.isArray(args)) {
					return await fn(socket, ...args);
				} else {
					return await fn(socket, args);
				}
			} else {
				return await fn(socket);
			}
		} else {
			return Promise.reject(new Error("Function: " + path + " not available"));
		}
	}
}

const eventManager = new EventManager();
global.eventManager = eventManager;