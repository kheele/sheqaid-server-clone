process.on('uncaughtException', async (err) => {
    console.error('Caught exception: ', err);
    console.error('Caught exception stringify: ', JSON.stringify(err));

    const opts = {
        from: '"SHEQIntel" <no-reply@sheqsolve.com>',
        to: "support@sheqsolve.com",
        subject: 'SHEQIntel Server Error Reporting',
        html: `<h3>Server Error</h3>\n
            <p>SHEQIntel would like to notify you of the following:</p>\n
            <p><b>------Message Details------</b></p>
            <p>${err.message}</p>\n
            <p><b>------Error Stack Details------</b></p>\n
            <p>${err.stack}</p>`
    };
    // EmailUtils.send(opts);
});

require('./globals.js');
require('./app.js');

const automate = require('./fn/automate');
// automate.run({
//     name: 'Competency',
//     tbl: 'hr_employees_docs_competencies',
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/competencies/${id}/Competency-Certificate-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
// automate.run({
//     name: 'Contract',
//     tbl: 'hr_employees_docs_contracts',
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/contracts/${id}/Contract-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
// automate.run({
//     name: 'Contract',
//     tbl: 'hr_employees_docs_contracts',
//     key: 'job_profile_doc',
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/contracts/${id}/Contract-job-profile_doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
// automate.run({
//     name: 'Counselling',
//     tbl: 'hr_employees_docs_counsellings',
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/counsellings/${id}/Counselling-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
// automate.run({
//     name: 'Leave',
//     tbl: 'hr_employees_docs_leaves',
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/leaves/${id}/Time-Off-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
// automate.run({
//     name: 'Leave',
//     tbl: 'hr_employees_docs_leaves',
//     key: 'doc_fitness_certificate',
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/leaves/${id}/Time-Off-Fitness-certificate-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
// automate.run({
//     name: 'Medical',
//     tbl: 'hr_employees_docs_medicals',
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/medicals/${id}/Medical-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
// automate.run({
//     name: 'Medical',
//     tbl: 'hr_employees_docs_medicals',
//     key: 'annexture3_doc',
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/medicals/${id}/Medical-Annexture3-Doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
// automate.run({
//     name: 'Warning',
//     tbl: 'hr_employees_docs_warnings',
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/warnings/${id}/Warning-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
// automate.run({
//     name: "Expense",
//     tbl: "hr_employees_docs_expenses",
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/expenses/${id}/Expense-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
////////////////////////
// automate.run({
//     name: 'WorkPermit',
//     tbl: 'hr_employees_docs_work_permits',
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/work-permits/${id}/Work-Permit-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
// automate.run({
//     name: 'License',
//     tbl: 'hr_employees_docs_licenses',
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/licenses/${id}/License-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
// automate.run({
//     name: 'IDOrPassport',
//     tbl: 'hr_employees_documents',
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/document-${id}-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
// automate.run({
//     name: "EmployeeDocBankingDetail",
//     tbl: "hr_employees_banking_details",
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/banking-details/banking_detail-${id}-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
// automate.run({
//     name: "EmployeeDocLivingAddress",
//     tbl: "hr_employees_living_address",
//     new_name: ({employee_id, id}) => `employees/${employee_id}/docs/residential-addresses/residential-address-${id}-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
// });
