const createImpl = require("../../../createImpl");
const {inc_fragment} = require("./commons");

const args = {
    name: 'Leave',
    tbl: 'hr_employees_docs_leaves',
    details_fragment: inc_fragment({inc_employee: true}),
    uploadUpdate: ({id, data: {employee}}) => {
        const d = Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-');
        const path = `employees/${employee.id}/docs/leaves/${id}`;
        return {
            new_names: [
                `${path}/Time-Off-doc-${d}`,
                `${path}/Time-Off-Fitness-certificate-doc-${d}`,
            ],
            keys: ['doc', 'doc_fitness_certificate'],
        };
    },
};

//<editor-fold desc="createTimeOff">
exports.createTimeOff = async (socket, input) => {
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        formData,
    } = input;

    const {
        doc, //
        doc_fitness_certificate, //
        embeddedEmployee, employee,//
        type,//
        due_to,//
        date, //
        expiry_date, //
        days_booked,//
        reason,//
        employee_comments,//
        notes,//
        //
        client,
        project,
        site,
    } = formData;

    const data = {
        employee_id: (embeddedEmployee || employee).id,
        doc,
        doc_fitness_certificate,

        date: Dates.formatTimestampSQL(date),
        days_booked,
        due_to: due_to || 'Occurred Incident',
        employee_comments,
        expiry_date: Dates.formatTimestampSQL(expiry_date),
        notes,
        reason,
        type,

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
