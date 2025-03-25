const createImpl = require("../../createImpl");

const args = {
    name: "EmployeeNextOfKin",
    tbl: "hr_employees_next_of_kin",
    details_fragment: `
        id
        created_at
        fname
        lname
        phone1
        phone2
        relationship
        employee_id
        employee{
            id
        }
    `,
    orgs_fragment: null,
    skipOrgs: true,
    skipUsers: true,
    // order_by: `{name: asc}`,
    // getVariablesAndQueryConfig,
};

//<editor-fold desc="createNextOfKin">
exports.createNextOfKin = async (socket, input) => {
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        formData,
    } = input;

    const {
        employee_id,
        //
        fname,
        lname,
        phone1,
        phone2,
        relationship,
    } = formData;

    const data = {
        employee_id,
        //
        fname,
        lname,
        phone1,
        phone2,
        relationship,

        // contractor_user_id: contractor_user && contractor_user.id,
    };

    const create = createImpl(args);
    return create(socket, data);
};
//</editor-fold>
