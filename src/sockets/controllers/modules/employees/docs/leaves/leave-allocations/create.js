const createImpl = require("../../../../createImpl");
const {details_fragment} = require("./commons");

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
};

//<editor-fold desc="createLeaveAllocation">
exports.createLeaveAllocation = async (socket, input) => {
    const loggedUser = await socket.getLoggedUser();
    if (!loggedUser) return;
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        employee,
        leave_type,
        days_allocated,
        days_used,
        days_carried_over,
        days_accrued,
        last_accrual_date,
        carryover_expiry_date,
        year,
    } = input;

    const data = {
        employee_id: employee.id,

        //
        leave_type_id: leave_type && leave_type.id,
        days_allocated,
        days_used,
        days_carried_over,
        days_accrued,
        last_accrual_date: Dates.formatDateSQL(last_accrual_date),
        carryover_expiry_date: Dates.formatDateSQL(carryover_expiry_date),
        year,
    };

    const { user:{id: user_id}, company:{id: company_id}} = loggedUser;
    data.user_id = user_id;
    data.company_id = company_id;

    const create = createImpl(args);
    return create(socket, data);
};
//</editor-fold>
