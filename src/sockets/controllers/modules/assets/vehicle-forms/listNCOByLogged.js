const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {nco_details_fragment, getNCOVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    // console.log('data', data)

    let {
        offset = 0,
        limit = 50,
        //
        removed = false,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
        //
        client_filter,
        orgs_filter = [],
    } = data;

    const {filter} = getNCOVariablesAndQueryConfig({
        orgs_filter,
        //
        //
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    return listGraphQL({
        query: `
			query listAllNCOByLoggedQuery {
                vehicle_change_notification(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter}
                  },
                    order_by: {vehicle_identification: {reg_num: desc}},
                    offset: ${offset},
                    ${limit > 0 ? `limit: ${limit}` : ''}
                ) {
                    ${nco_details_fragment}
                    ${orgs_fragment}
                }
            }
		`,
        operationName: "listAllNCOByLoggedQuery",
    });
}
//</editor-fold>