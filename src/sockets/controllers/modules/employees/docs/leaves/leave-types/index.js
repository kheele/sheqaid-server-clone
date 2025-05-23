const findByIdImpl = require("../../../../findByIdImpl");
const listByLoggedImpl = require("../../../../listByLoggedImpl");
const exportExcelImpl = require("../../../../exportExcelImpl2");

const updateImpl = require("../../../../updateImpl");
const {details_fragment} = require("./commons");
const {createLeaveType} = require("./create");
const {getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: 'LeaveTypes',
	tbl: 'leave_types',
	details_fragment,
	orgs_fragment: `
		client{
			id
			name
		}
		company{
			id
			name
		}
	`,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
};

const path = `employees/docs/leaves/types`;

eventManager.on(`${path}/create`, createLeaveType);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));

eventManager.on(`${path}/export-excel`, exportExcelImpl({
	...args,
	currDir: __dirname,
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				name,
				desc,
				removed,
			}
		} = item;

		return {
			idx: idx + 1,
			id,

			name,
			desc,

			status: removed ? "Inactive" : "Active",
		};
	},
}));
