const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {contractor_questionnaire_template_details_list_fragment, getVariablesAndQueryConfig} = require('./commons');

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
		doc_num,
		category,
		//
		client_id, company_id,
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
		doc_num,
		category,
		//
		client_id, company_id,
		//
		exact_orgs
	});
	
	if (id) {
		return listGraphQL({
			query: `
        query listAllContractorQuestionnaireTemplateByLoggedQuery {
            default_contractor_questionnaire_templates(
              where: {
                 ${filter}
              }
            ) {
                ${contractor_questionnaire_template_details_list_fragment}
                ${orgs_fragment}
            }
        }
      `,
			operationName: "listAllContractorQuestionnaireTemplateByLoggedQuery",
		});
	} else {
		return listGraphQL({
			query: `
        query listAllContractorQuestionnaireTemplateByLoggedQuery {
            default_contractor_questionnaire_templates(
              where: {
                removed: {_eq: ${removed}},
                ${filter}
              },
              order_by: {name: asc},
              offset: ${offset},
              ${limit > 0 ? `limit: ${limit}` : ''}
            ) {
                ${contractor_questionnaire_template_details_list_fragment}
                ${orgs_fragment}
            }
        }
      `,
			operationName: "listAllContractorQuestionnaireTemplateByLoggedQuery",
		});
	}
}
//</editor-fold>
