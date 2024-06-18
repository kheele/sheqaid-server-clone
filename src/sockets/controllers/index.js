require("../eventManager");
require("./ACntr");

require("./general");
require("./modules");

exports.start = (socket) => {
	socket.on("emit", async (req, callback) => {
		// console.log('socket emit', req);
		const {path, data} = req;
		if (data !== undefined && data !== null && !isNumber(data) && !isBoolean(data) && !isString(data) && !isArray(data)) {
			if ('now' in data) {
				const {now} = data;
				if (isDate(now)) {
					data.now = Dates.parse(now);
				}
			}
			if ('range_start' in data) {
				const {range_start} = data;
				if (range_start) {
					console.log('range_start', range_start);
					if (range_start.contains("All")) {
						data.range_start = undefined;
					} else if (isDate(range_start)) {
						data.range_start = Dates.parse(range_start);
					}
				}
			}
			if ('range_end' in data) {
				const {range_end} = data;
				if (range_end) {
					if (range_end.contains("All")) {
						data.range_end = undefined;
					} else if (isDate(range_end)) {
						data.range_end = Dates.parse(range_end);
					}
				}
			}
		}
		
		const args = [socket, path];
		if (data !== undefined && data !== null) {
			data && args.push(data);
		}
		
		try {
			const res = await eventManager.emit.apply(eventManager, args);
			callback && callback(res, null);
		} catch (err) {
			// console.error(`eventManager.emit(${path}) err:`, err.message);
			console.error(`eventManager.emit(${path}) stack:`, err.stack);
			const {name, message, stack} = err;
			callback && callback(null, JSON.stringify({name, message, stack}));
		}
	});
};

exports.destroy = (socket) => {
	// socket.off("emit");
};
