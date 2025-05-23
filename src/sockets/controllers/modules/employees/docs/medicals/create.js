const createImpl = require("../../../createImpl");
const {inc_fragment} = require("./commons");

const args = {
    name: 'Medical',
    tbl: 'hr_employees_docs_medicals',
    details_fragment: inc_fragment({inc_employee: true}),
    uploadUpdate: ({id, data: {employee}}) => {
        const d = Dates.formatTimestamp(new Date());
        const path = `employees/${employee.id}/docs/medicals/${id}`;
        return {
            new_names: [
                `${path}/Medical-doc-${d}`,
                `${path}/Medical-Annexture3-Doc-${d}`,
            ],
            keys: ['doc', 'annexture3_doc'],
        };
    },
};

//<editor-fold desc="createMedical">
exports.createMedical = async (socket, input) => {
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        formData,
    } = input;

    const {
        embeddedEmployee, employee,//
        follow_up_date, //
        expiry_date, //
        annexture_3,//
        fitness_option,//
        restrictions,//
        annexture3_doc,//
        doc,//
        //
        client,
        project,
        site,
    } = formData;

    const data = {
        employee_id: (embeddedEmployee || employee).id,
        annexture3_doc,
        doc,

        follow_up_date: Dates.formatTimestampSQL(follow_up_date),
        expiry_date: Dates.formatTimestampSQL(expiry_date),
        fitness_option,
        restrictions,
        annexture_3,

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
