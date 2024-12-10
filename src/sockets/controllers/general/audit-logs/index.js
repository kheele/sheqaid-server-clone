const listByLoggedImpl = require('../../modules/listByLoggedImpl');
const findByIdImpl = require('../../modules/findByIdImpl');
const {audit_logs_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "AuditTrails",
	tbl: "default_audit_trails",
	details_fragment,
};

const path = "audit-logs";

eventManager.on(`${path}/findById`, findByIdImpl({
	...args,
}));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
	...args,
	where: ({filters}) => {
		const {filter} = filters;
		return `
			record_name:{_is_null: false},
			${filter}
		`;
	},
	order_by: "order_by: {created_at: desc}",
	skipRemoved: true,
	getVariablesAndQueryConfig,
}));
//
