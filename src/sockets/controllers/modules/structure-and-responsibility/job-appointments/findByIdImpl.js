const findByIdImpl = require("../../employees/docs/findByIdImpl");
const {inc_fragment} = require("./commons");

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return findByIdImpl({
        socket,
        id,
        tbl: 'hr_employees_docs_job_appointments',
        singular: 'Job Appointment',
        inc_fragment,
    });
}
//</editor-fold>