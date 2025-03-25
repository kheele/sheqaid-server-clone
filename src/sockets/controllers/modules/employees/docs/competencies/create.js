const createImpl = require("../../../createImpl");
const {inc_fragment} = require("./commons");

const args = {
    name: 'Competency',
    tbl: 'hr_employees_docs_competencies',
    details_fragment: inc_fragment({inc_employee: true}),
    uploadUpdate: ({id, data: {employee}}) => ({
        new_name: `employees/${employee.id}/docs/competencies/${id}/Competency-Certificate-doc-${Dates.formatTimestamp(new Date())}`,
        key: 'doc',
    }),
};

//<editor-fold desc="createCompetency">
exports.createCompetency = async (socket, input) => {
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        formData,
    } = input;

    const {
        embeddedEmployee, employee,//
        issued_date, //
        expiry_date, //
        type, //
        competency_type, //
        accreditation_num, //
        certificate_num, //
        training, //
        doc,//
        //
        client,
        project,
        site,
    } = formData;

    const data = {
        employee_id: (embeddedEmployee || employee).id,
        //
        issued_date: Dates.formatDateSQL(issued_date),
        expiry_date: Dates.formatDateSQL(expiry_date),
        type,
        competency_type,
        accreditation_num,
        certificate_num,
        training_id: training && training.id,
        doc,

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
