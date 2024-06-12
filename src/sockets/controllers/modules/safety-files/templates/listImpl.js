const {orgs_no_project_and_site_fragment} = require("../../../../../graphql/Fragments");
const {safety_file_template_details_list_fragment, getVariablesAndQueryConfig} = require('./commons');

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
        visibility,
        answered_by,
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
        visibility,
        answered_by,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	if (id) {
		return listGraphQL({
			query: `
				query listAllSafetyFileTemplateByLoggedQuery {
					default_contractor_questionnaires(
					where: {
						${filter}
					}
					) {
						${safety_file_template_details_list_fragment}
						${orgs_no_project_and_site_fragment}
					}
				}
			`,
			operationName: "listAllSafetyFileTemplateByLoggedQuery",
		});
	} else {
		let _or;
		
		if(visibility) {
			_or = `
				{visibility: {_eq: "${visibility}"}},
        		{${filter}}
			`;
		} else {
			_or = `
				{_or: [
					{visibility: {_eq: "Public"}},
					{_and: [
						{visibility: {_eq: "Private"}},
						{${filter}}
					]}
				]}
			`;
		}
		
		return listGraphQL({
			query: `
				query listAllSafetyFileTemplateByLoggedQuery {
					default_contractor_questionnaires(
					where: {
						_and: [
							{removed: {_eq: ${removed}}},
							{group: {_eq: "Safety Files"}},
							{is_template: {_eq: true}},
							${_or}
						]
					},
					order_by: {name: asc},
					offset: ${offset},
					${limit > 0 ? `limit: ${limit}` : ''}
					) {
						${safety_file_template_details_list_fragment}
						${orgs_no_project_and_site_fragment}
					}
				}
			`,
			operationName: "listAllSafetyFileTemplateByLoggedQuery",
		});
	}
}
//</editor-fold>
