const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {contractor_questionnaire_details_list_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		removed = false,
		//
		id,
		//
		name,
		status,
		template_id,
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
		//
		id,
		//
		name,
		status,
		template_id,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	if (id) {
		return listGraphQL({
			query: `
        query listAllContractorQuestionnaireByLoggedQuery {
            default_contractor_questionnaires(
              where: {
                  ${filter}
              }
            ) {
                ${contractor_questionnaire_details_list_fragment}
                ${orgs_fragment}
            }
        }
			`,
			operationName: "listAllContractorQuestionnaireByLoggedQuery",
		});
	} else {
		return listGraphQL({
			query: `
        query listAllContractorQuestionnaireByLoggedQuery {
            default_contractor_questionnaires(
              where: {
                  removed: {_eq: ${removed}},
                  group: {_eq: "Contractors"},
                  is_template: {_eq: false},
                  ${client_filter}
                  ${filter}
              },
              order_by: {name: asc},
              offset: ${offset},
              ${limit > 0 ? `limit: ${limit}` : ''}
            ) {
                ${contractor_questionnaire_details_list_fragment}
                ${orgs_fragment}
            }
        }
			`,
			operationName: "listAllContractorQuestionnaireByLoggedQuery",
		});
	}
}
//</editor-fold>
