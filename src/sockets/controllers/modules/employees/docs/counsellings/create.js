const createImpl = require("../../../createImpl");
const {inc_fragment} = require("./commons");

const args = {
    name: 'Counselling',
    tbl: 'hr_employees_docs_counsellings',
    details_fragment: inc_fragment({inc_employee: true}),
    uploadUpdate: ({id, data: {employee}}) => ({
        new_name: `employees/${employee.id}/docs/counsellings/${id}/Counselling-doc-${Dates.formatTimestamp(new Date())}`,
        key: 'doc',
    }),
};

//<editor-fold desc="createCounselling">
exports.createCounselling = async (socket, input) => {
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        formData,
    } = input;

    const {
        //1
        embeddedEmployee, employee, //
        responsible_person,//
        //2
        types,//
        reasons,//
        incident_desc,//
        corrective_actions,//
        counselling_hrs_to_complete,//
        expiry_date,//
        witness_list,//
        //3
        doc,//
        //
        client,
        project,
        site,
    } = formData;

    const data = {
        employee_id: (embeddedEmployee || employee).id,
        doc,

        responsible_person_id: responsible_person && responsible_person.id,

        corrective_actions,
        counselling_hrs_to_complete,
        expiry_date: Dates.formatTimestampSQL(expiry_date),
        incident_desc,
        reasons,
        types,
        witness_list: {
            data: witness_list ? witness_list.map(({employee, other_person}) => {
                console.log('witness_list', employee, other_person)
                if (employee) {
                    return {witness_id: employee.id};
                }
                const {job_position} = other_person;
                if (job_position) {
                    delete other_person.job_position;
                    other_person.job_position_id = job_position.id;
                }
                return {witness_other: {data: other_person}};
            }) : []
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
