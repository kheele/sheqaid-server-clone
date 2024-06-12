const listImpl = require('../../employees/docs/listImpl');
const {inc_fragment} = require("./commons");

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    const {
        date,
        notes,
    } = data;
    return listImpl({
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