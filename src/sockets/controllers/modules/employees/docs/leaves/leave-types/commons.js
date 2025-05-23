//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        excludeIds,
        id,
        //
        incContractors = false,
        // year = new Date().getFullYear(),
        name,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    if (id) {
        filter.push(`id: {_eq: ${id}}`);
    } else {
        if (excludeIds) {
            filter.push(`_not: {id: {_in: [${excludeIds}]}}`);
        }
        //
        if (name) {
            filter.push(`name: {_ilike: "%${name}%"}`);
        }
        // if (year) {
        //     filter.push(`employee_leave_allocation_list: {removed: {_eq: false}, year: {_eq: ${year}}}`);
        // }
    }

    filter = filter.join(',');
    //</editor-fold> ,

    return {filter};
};
//</editor-fold>

//<editor-fold desc="details_fragment">
exports.details_fragment = (socket, data) => {
    const {
        year = new Date().getFullYear(),
    } = data;

    return `
        id
        removed
        name
        desc
        days_allocated_aggregate: employee_leave_allocation_list_aggregate(where: {removed: {_eq: false}, year: {_eq: ${year}}}) {
          aggregate {
            sum {
              days_allocated
            }
          }
        }
        days_used_aggregate: employee_leave_allocation_list_aggregate(where: {removed: {_eq: false}, year: {_eq: ${year}}}) {
          aggregate {
            sum {
              days_used
            }
          }
        }
        days_accrued_aggregate: employee_leave_allocation_list_aggregate(where: {removed: {_eq: false}, year: {_eq: ${year}}}) {
          aggregate {
            sum {
              days_accrued
            }
          }
        }
        days_carried_over_aggregate: employee_leave_allocation_list_aggregate(where: {removed: {_eq: false}, year: {_eq: ${year}}}) {
          aggregate {
            sum {
              days_carried_over
            }
          }
        }
    `;
};
//</editor-fold>
