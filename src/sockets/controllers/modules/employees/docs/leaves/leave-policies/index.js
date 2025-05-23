const findByIdImpl = require("../../../../findByIdImpl");
const listByLoggedImpl = require("../../../../listByLoggedImpl");
const exportExcelImpl = require("../../../../exportExcelImpl2");

const updateImpl = require("../../../../updateImpl");
const {details_fragment} = require("./commons");
const {createLeavePolicy} = require("./create");
const {getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: 'LeavePolicies',
	tbl: 'company_leave_policies',
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
	order_by: "order_by: {leave_type:{name: asc}}",
	getVariablesAndQueryConfig,
};

const path = `employees/docs/leaves/policies`;

eventManager.on(`${path}/create`, createLeavePolicy);

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
				leave_type,
				default_days_allowed,
				max_carryover_years,
				accrual_period_start,
				accrual_period_end,
				removed,
			}
		} = item;

		return {
			idx: idx + 1,
			id,

			leave_type: leave_type && leave_type.name,

			default_days_allowed,
			max_carryover_years,

			accrual_period_start: Dates.formatDate(accrual_period_start),
			accrual_period_end: Dates.formatDate(accrual_period_end),

			status: removed ? "Inactive" : "Active",
		};
	},
}));
