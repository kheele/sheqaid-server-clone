const {orgs_fragment} = require("../../../../graphql/Fragments");
const {inspection_details_list_fragment, getVariablesAndQueryConfig} = require('./commons');

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
		interval,
		template_id,
		asset_type,
		//
		logged_employee_id,
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
		interval,
		template_id,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	if (id) {
		return listGraphQL({
			query: `
        query listAllInspectionQuestionnaireByLoggedQuery {
            default_contractor_questionnaires(
              where: {
                  ${filter}
              }
            ) {
                ${inspection_details_list_fragment}
                ${orgs_fragment}
            }
        }
			`,
			operationName: "listAllInspectionQuestionnaireByLoggedQuery",
		});
	} else {
		let where_asset_type;
		if (asset_type) {
			if (isArray(asset_type)) {
				where_asset_type = `
					asset_type:{_in: [${asset_type.map(v => `"${v}"`).join(',')}]},
				`;
			} else {
				where_asset_type = `
					asset_type:{_eq: ${asset_type}},
				`;
			}
		}
		
		return listGraphQL({
			query: `
        query listAllInspectionQuestionnaireByLoggedQuery {
            default_contractor_questionnaires(
              where: {
                  removed: {_eq: ${removed}},
                  group: {_eq: "Inspections"},
                  is_template: {_eq: false},
                  ${where_asset_type ? where_asset_type : ''}
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
}
//</editor-fold>
