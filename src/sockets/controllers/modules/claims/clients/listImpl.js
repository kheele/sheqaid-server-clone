const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {coida_claims_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    // console.log('data', data)

    let {
        offset = 0,
        limit = 50,
        //
        removed = false,
        //
        employee,
        occupation,
        status,
        claim_status,
        //
        accident_date_range,
        resume_date_range,
        year,
        id,
        mcr_ref_num,
        claim_number,
        injury_disease,
        injury_type,
        //
        logged_employee_id,
        site_id, project_id, client_id,
        //
        exact_orgs = false,
        //
        orgs_filter = [],
    } = data;

    const {filter} = getVariablesAndQueryConfig({
        orgs_filter,
        //
        removed,
        //
        employee,
        occupation,
        status,
        claim_status,
        //
        accident_date_range,
        resume_date_range,
        year,
        id,
        mcr_ref_num,
        claim_number,
        injury_disease,
        injury_type,
        //
        logged_employee_id,
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    return listGraphQL({
        query: `
            query listAllClaimsClientByLoggedQuery {
                coida_claims(
                  where: {
                    ${filter}
                  },
                    order_by: {accident_date: desc},
                    offset: ${offset},
                    ${limit > 0 ? `limit: ${limit}` : ''}
                ) {
                  ${coida_claims_fragment}
                  ${orgs_fragment}
                }
            }
		`,
        operationName: "listAllQuickIncidentsByLoggedQuery",
    });
}
//</editor-fold>
