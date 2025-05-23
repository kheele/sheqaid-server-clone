const createImpl = require("../../../../createImpl");
const {details_fragment} = require("./commons");

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
};

//<editor-fold desc="createLeaveType">
exports.createLeaveType = async (socket, input) => {
    const loggedUser = await socket.getLoggedUser();
    if (!loggedUser) return;
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        client,
        //
        name,
        desc,
    } = input;

    const data = {
        client_id: !isContractor ? (client && client.id) : null,
        name,
        desc,
    };

    const { user:{id: user_id}, company:{id: company_id}} = loggedUser;
    data.user_id = user_id;
    data.company_id = company_id;

    const create = createImpl(args);
    return create(socket, data);
};
//</editor-fold>
