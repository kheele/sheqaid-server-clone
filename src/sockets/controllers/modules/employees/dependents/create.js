const createImpl = require("../../createImpl");

const args = {
    name: "EmployeeDependent",
    tbl: "hr_employees_dependents",
    details_fragment: `
        id
        created_at
        fname
        lname
        dob
        gender
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

//<editor-fold desc="createDependent">
exports.createDependent = async (socket, input) => {
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
        gender,
        dob,
    } = formData;

    const data = {
        employee_id,
        //
        fname,
        lname,
        gender,
        dob: Dates.formatDateSQL(dob),
        // contractor_user_id: contractor_user && contractor_user.id,
    };

    const create = createImpl(args);
    return create(socket, data);
};
//</editor-fold>
