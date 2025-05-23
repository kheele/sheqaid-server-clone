
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        excludeIds,
        id,
        //
        incContractors = false,
        leave_type_id,
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
        if (leave_type_id) {
            filter.push(`leave_type_id: {_eq: ${leave_type_id}}`);
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
    default_days_allowed
    max_carryover_years
    accrual_period_start
    accrual_period_end
    leave_type{
        id
        name
    }
`;
//</editor-fold>
