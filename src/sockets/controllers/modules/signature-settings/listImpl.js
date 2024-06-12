const {orgs_fragment} = require("../../../../graphql/Fragments");
const {inspection_details_list_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    // console.log('data', data)

    let {
        offset = 0,
        limit = 50,
        //
        removed = false,
        status,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
        //
        client_filter,
        orgs_filter = [],
    } = data;

    const {filter} = getVariablesAndQueryConfig({
        orgs_filter,
        status,
        //
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    return listGraphQL({
        query: `
			  query listAllInspectionQuestionnaireByLoggedQuery {
				default_contractor_questionnaires(
				  where: {
					removed: {_eq: ${removed}},
					group: {_eq: "Inspections"},
					is_template: {_eq: false},
					${client_filter}
					${filter}
				  },
					order_by: {name: asc},
					offset: ${offset},
					${limit > 0 ? `limit: ${limit}` : ''}
				) {
				    ${inspection_details_list_fragment}
                    ${orgs_fragment}
				}
			  }
			`,
        operationName: "listAllInspectionQuestionnaireByLoggedQuery",
    });
}
//</editor-fold>