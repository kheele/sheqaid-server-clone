const createImpl = require("../../../../createImpl");

const args = {
    name: "EmployeeDocBankingDetail",
    tbl: "hr_employees_banking_details",
    details_fragment: `
        id
        created_at
        is_default
        name

        account_num
        branch
        code
        doc
        employee_id
        employee{
            id
        }
    `,
    uploadUpdate: ({id, data: {employee}}) => ({
        new_name: `employees/${employee.id}/docs/banking-details/banking_detail-${id}-${Dates.formatTimestamp(new Date())}`,
        key: 'doc',
    }),
    orgs_fragment: null,
    skipOrgs: true,
    skipUsers: true,
};

//<editor-fold desc="createBankingDetail">
exports.createBankingDetail = async (socket, input) => {
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        formData,
    } = input;

    const {
        employee_id,
        //1
        name,
        branch,
        code,
        account_num,
        //2
        doc,
    } = formData;

    const data = {
        employee_id,
        is_default: true,
        //1
        name,
        branch,
        code,
        account_num,
        //2
        doc,

        // contractor_user_id: contractor_user && contractor_user.id,
    };

    const create = createImpl(args);
    return create(socket, data);
};
//</editor-fold>
