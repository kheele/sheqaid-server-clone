const createImpl = require("../../createImpl");
const {inc_fragment} = require("./commons");

const args = {
    name: "JobAppointment",
    tbl: "hr_employees_docs_job_appointments",
    details_fragment: inc_fragment({inc_employee: true}),
    uploadUpdate: ({id, data: {employee}}) => ({
        new_name: `employees/${employee.id}/docs/job_appointments/${id}/Job-Appointment-doc-${Dates.formatTimestamp(new Date())}`,
        key: 'doc',
    }),
};

//<editor-fold desc="createJobAppointment">
exports.createJobAppointment = async (socket, input) => {
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        formData,
    } = input;

    const {
        doc, //
        embeddedEmployee, employee,//
        date, //
        expiry_date, //
        notes,//
        //
        client,
        project,
        site,
    } = formData;

    const data = {
        employee_id: (embeddedEmployee || employee).id,
        doc,

        date: Dates.formatTimestampSQL(date),
        expiry_date: Dates.formatTimestampSQL(expiry_date),
        notes,

        //
        client_id: !isContractor ? (client && client.id) : null,
        project_id: !isContractor ? (project && project.id) : null,
        site_id: !isContractor ? (site && site.id) : null,

        contractor_client_id: isContractor ? (client && client.id) : null,
        contractor_site_id: isContractor ? (site && site.id) : null,
        // contractor_user_id: contractor_user && contractor_user.id,
    };

    const create = createImpl(args);
    return create(socket, data);
};
//</editor-fold>
