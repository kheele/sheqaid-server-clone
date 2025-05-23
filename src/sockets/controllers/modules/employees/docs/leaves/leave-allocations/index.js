const findByIdImpl = require("../../../../findByIdImpl");
const listByLoggedImpl = require("../../../../listByLoggedImpl");
const exportExcelImpl = require("../../../../exportExcelImpl2");

const updateImpl = require("../../../../updateImpl");
const {details_fragment} = require("./commons");
const {createLeaveAllocation} = require("./create");
const {getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: 'LeaveAllocations',
	tbl: 'employee_leave_allocations',
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
	getVariablesAndQueryConfig,
};

const path = `employees/docs/leaves/allocations`;

eventManager.on(`${path}/create`, createLeaveAllocation);

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
