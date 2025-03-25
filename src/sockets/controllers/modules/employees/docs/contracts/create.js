const createImpl = require("../../../createImpl");
const {inc_fragment} = require("./commons");

const args = {
    name: 'Contract',
    tbl: 'hr_employees_docs_contracts',
    details_fragment: inc_fragment({inc_employee: true}),
    uploadUpdate: ({id, data: {employee}}) => {
        const d = Dates.formatTimestamp(new Date());
        const path = `employees/${employee.id}/docs/contracts/${id}`;
        return {
            new_names: [
                `${path}/Contract-doc-${d}`,
                `${path}/Contract-job-profile_doc-${d}`,
            ],
            keys: ['doc', 'job_profile_doc'],
        };
    },
};

//<editor-fold desc="createContract">
exports.createContract = async (socket, input) => {
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        formData,
    } = input;

    const {
        embeddedEmployee, employee,//
        doc,//
        job_profile_doc,//
        //
        contractDetailsFormData,
        salaryInfoFormData,
        //
        client,
        project,
        site,
    } = formData;

    const data = {
        employee_id: (embeddedEmployee || employee).id,
        //
        doc,
        job_profile_doc,

        //
        client_id: !isContractor ? (client && client.id) : null,
        project_id: !isContractor ? (project && project.id) : null,
        site_id: !isContractor ? (site && site.id) : null,

        contractor_client_id: isContractor ? (client && client.id) : null,
        contractor_site_id: isContractor ? (site && site.id) : null,
        // contractor_user_id: contractor_user && contractor_user.id,
    };

    if (contractDetailsFormData) {
        const {
            contract_type,
            start_date,
            expiry_date,
            end_of_trial_period,
            start_time,
            end_time,
            daily_working_hours,
            notes,
        } = contractDetailsFormData;
        data.contract_details_list = {
            data: [{
                contract_type,
                start_date: Dates.formatTimestampSQL(start_date),
                expiry_date: Dates.formatTimestampSQL(expiry_date),
                end_of_trial_period: Dates.formatTimestampSQL(end_of_trial_period),
                start_time,
                end_time,
                daily_working_hours,
                notes,
            }]
        };
    }

    if (salaryInfoFormData) {
        const {
            payment_type,
            salary_interval,
            salary,
            wage,
            deductible,//[{text, value}]
        } = salaryInfoFormData;

        const deductible_list = deductible ? deductible.list.filter(v => !!v && !!v.text && !!v.value) : [];

        data.salary_info_list = {
            data: [{
                payment_type,
                salary_interval,
                salary,
                wage,
                deductible_list: {data: deductible_list},//[{text, value}]
            }]
        };
    }

    const create = createImpl(args);
    return create(socket, data);
};
//</editor-fold>
