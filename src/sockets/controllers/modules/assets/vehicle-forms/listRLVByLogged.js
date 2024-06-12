const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {rlv_details_fragment, getRLVVariablesAndQueryConfig} = require('./commons');

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

    const {filter} = getRLVVariablesAndQueryConfig({
        orgs_filter,
        //
        //
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    return listGraphQL({
        query: `
			query listAllRLVByLoggedQuery {
                vehicle_licensing_and_reg_application(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter}
                  },
                    order_by: {c_particulars_of_motor_vehicle: {reg_num: desc}},
                    offset: ${offset},
                    ${limit > 0 ? `limit: ${limit}` : ''}
                ) {
                    ${rlv_details_fragment}
                    ${orgs_fragment}
                }
            }
		`,
        operationName: "listAllRLVByLoggedQuery",
    });
}
//</editor-fold>
