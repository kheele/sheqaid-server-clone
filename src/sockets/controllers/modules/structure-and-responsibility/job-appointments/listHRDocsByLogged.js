const listHRDocsByLoggedImpl = require('../../employees/docs/listHRDocsByLoggedImpl');
const {inc_fragment} = require("./commons");

//<editor-fold desc="listHRDocsByLoggedImpl">
module.exports = async (socket, data) => {
    const {
        date,
        notes,
    } = data;
    return listHRDocsByLoggedImpl({
        socket,
        data,
        tbl: 'hr_employees_docs_job_appointments',
        listName: 'job_appointment_list',
        singular: 'Job Appointment',
        inc_fragment,
        attrs: {
            date,
            notes,
        },
    });
    // console.log('data', data)
}
//</editor-fold>