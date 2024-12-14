const findImpl = require("../../findImpl");
const findByIdImpl = require("../../findByIdImpl");
const {employee_details_fragment} = require("./commons");

const args = {
    name: "Employee",
    tbl: "hr_employees",
    details_fragment: `
        id
        auth_id
    `,
};

//<editor-fold desc="findByIdEmployee">
exports.findByIdEmployee = async (socket, id) => {
    const findById = findByIdImpl({
        ...args,
        details_fragment: employee_details_fragment
    });

    return findById(socket, id);
};
//</editor-fold>

//<editor-fold desc="findByEmailDuplicateEmployee">
exports.findByEmailDuplicateEmployee = async (socket, {id, email}) => {
    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({id, email}) => {
            return {filter: `id: {_neq: ${id}}, email: {_eq: "${email}"}`};
        }
    });

    return findBy(socket, {id, email});
};
//</editor-fold>

//<editor-fold desc="findByPhoneDuplicateEmployee">
exports.findByPhoneDuplicateEmployee = async (socket, {id, phone}) => {
    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({id, phone}) => {
            return {filter: `id: {_neq: ${id}}, phone: {_eq: "${phone}"}`};
        }
    });

    return findBy(socket, {id, phone});
};
//</editor-fold>
