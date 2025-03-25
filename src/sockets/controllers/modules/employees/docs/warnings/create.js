const createImpl = require("../../../createImpl");
const {inc_fragment} = require("./commons");

const args = {
    name: 'Warning',
    tbl: 'hr_employees_docs_warnings',
    details_fragment: inc_fragment({inc_employee: true}),
    uploadUpdate: ({id, data: {employee}}) => ({
        new_name: `employees/${employee.id}/docs/warnings/${id}/Warning-doc-${Dates.formatTimestamp(new Date())}`,
        key: 'doc',
    }),
};

//<editor-fold desc="createWarning">
exports.createWarning = async (socket, input) => {
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        formData,
    } = input;

    const {
        embeddedEmployee, employee, //
        issued_by,//
        type,//
        category_of_misconduct,
        date,//
        expiry_date, //
        details,//
        employee_comments,//
        notes,//
        witness_list,//
        doc,//
        //
        client,
        project,
        site,
    } = formData;

    const data = {
        employee_id: (embeddedEmployee || employee).id,
        doc,

        date: Dates.formatTimestampSQL(date),
        details,
        employee_comments,
        expiry_date: Dates.formatTimestampSQL(expiry_date),
        issued_by_id: issued_by && issued_by.id,
        notes,
        type,
        category_of_misconduct,
        witness_list: {
            data: (witness_list || []).filter(v => !!v).map(({other_person, employee}) => {
                if (other_person) {
                    delete other_person.id;
                    if (other_person.job_position) {
                        other_person.job_position_id = other_person.job_position.id;
                        delete other_person.job_position;
                    }
                }
                return {
                    witness_id: employee && employee.id,
                    witness_external: other_person && {
                        data: other_person
                    } || null,
                };
            }),
        },

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
