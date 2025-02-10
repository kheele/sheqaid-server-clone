const updateImpl = require("../../updateImpl");
const {employee_external_details_fragment} = require("./commons");

const args = {
    name: "EmployeeExternal",
    tbl: "hr_employees_external",
    details_fragment: employee_external_details_fragment,
};

//<editor-fold desc="updateEmployeeExternal">
exports.updateEmployeeExternal = async (socket, attrs) => {
    const {id} = attrs;
    const update = updateImpl(args);
    return update(socket, {
        ...attrs, id,
    });
};
//</editor-fold>
