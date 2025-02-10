const createImpl = require("../../createImpl");
const {employee_external_details_fragment} = require("./commons");

const args = {
    name: "EmployeeExternal",
    tbl: "hr_employees_external",
    details_fragment: employee_external_details_fragment,
};

//<editor-fold desc="createEmployeeExternal">
exports.createEmployeeExternal = async (socket, input) => {
    const create = createImpl(args);
    return create(socket, input);
};
//</editor-fold>
