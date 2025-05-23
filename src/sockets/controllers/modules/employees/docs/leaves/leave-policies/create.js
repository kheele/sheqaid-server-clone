const createImpl = require("../../../../createImpl");
const {details_fragment} = require("./commons");

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
};

//<editor-fold desc="createLeavePolicy">
exports.createLeavePolicy = async (socket, input) => {
    const loggedUser = await socket.getLoggedUser();
    if (!loggedUser) return;
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        client,
        //
        leave_type,
        default_days_allowed,
        max_carryover_years,
        accrual_period_start,
        accrual_period_end,
    } = input;

    const data = {
        client_id: !isContractor ? (client && client.id) : null,

        //
        leave_type_id: leave_type && leave_type.id,
        default_days_allowed,
        max_carryover_years,
        accrual_period_start: Dates.formatDateSQL(accrual_period_start),
        accrual_period_end: Dates.formatDateSQL(accrual_period_end),
    };

    const { user:{id: user_id}, company:{id: company_id}} = loggedUser;
    data.user_id = user_id;
    data.company_id = company_id;

    const create = createImpl(args);
    return create(socket, data);
};
//</editor-fold>
