
//<editor-fold desc="getVariablesAndQueryConfig">
const {employee_basic_personal_details_fragment} = require("../../../../../../../graphql/Fragments");
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        excludeIds,
        id,
        //
        incContractors = false,
        employee_id,
        leave_type_id,
        year,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    if(id) {
        filter.push(`id: {_eq: ${id}}`);
    } else {
        if(excludeIds) {
            filter.push(`_not: {id: {_in: [${excludeIds}]}}`);
        }
        //
        if (employee_id) {
            filter.push(`employee_id: {_eq: ${employee_id}}`);
        }
        if (leave_type_id) {
            filter.push(`leave_type_id: {_eq: ${leave_type_id}}`);
        }
        if (year) {
            filter.push(`year: {_eq: ${year}}`);
        }
    }

    filter = filter.join(',');
    //</editor-fold> ,

    return {filter};
};
//</editor-fold>

//<editor-fold desc="details_fragment">
exports.details_fragment = `
    id
    removed
    days_allocated
    days_used
    days_carried_over
    days_accrued
    last_accrual_date
    carryover_expiry_date
    year
    
    employee{
        ${employee_basic_personal_details_fragment}
    }
    leave_type{
        id
        name
    }
`;
//</editor-fold>
