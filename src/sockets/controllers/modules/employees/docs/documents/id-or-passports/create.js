const createImpl = require("../../../../createImpl");
const {inc_fragment} = require("./commons");

const args = {
    name: 'IDOrPassport',
    tbl: 'hr_employees_documents',
    details_fragment: inc_fragment({inc_employee: true}),
    uploadUpdate: ({id, data: {employee}}) => ({
        new_name: `employees/${employee.id}/docs/document-${id}-${Dates.formatTimestamp(new Date())}`,
        key: 'doc',
    }),
    orgs_fragment: null,
    skipOrgs: true,
    skipUsers: true,
};

//<editor-fold desc="createIDOrPassport">
exports.createIDOrPassport = async (socket, input) => {
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        formData,
    } = input;

    const {
        employee_id,
        type,
        //1
        expiry_date,
        //2
        doc,
    } = formData;

    const data = {
        employee_id,
        is_default: true,
        type,
        //1
        expiry_date: Dates.formatDateSQL(expiry_date),
        //2
        doc,

        // contractor_user_id: contractor_user && contractor_user.id,
    };

    const create = createImpl(args);
    return create(socket, data);
};
//</editor-fold>
