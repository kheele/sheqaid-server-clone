const {orgs_no_project_and_site_fragment} = require("../../../../../graphql/Fragments");
const {inspection_template_details_list_fragment, getVariablesAndQueryConfig} = require('./commons');

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
		asset_id,
		status,
		name,
		scheduled,
		visibility,
		asset_type,
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
		status,
		name,
		scheduled,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	if (id) {
		return listGraphQL({
			query: `
        query listAllInspectionTemplateByLoggedQuery {
            default_contractor_questionnaires(
              where: {
                 ${filter}
              }
            ) {
                ${inspection_template_details_list_fragment}
                ${orgs_no_project_and_site_fragment}
            }
        }
      `,
			operationName: "listAllInspectionTemplateByLoggedQuery",
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
		
		let where_asset_type;
		if(asset_type) {
			if(isArray(asset_type)) {
				where_asset_type = `
					{asset_type:{_in: [${asset_type.map(v => `"${v}"`).join(',')}]}},
				`;
			} else {
				where_asset_type = `
					{asset_type:{_eq: ${asset_type}}},
				`;
			}
		}
		
		return listGraphQL({
			query: `
        query listAllInspectionTemplateByLoggedQuery {
            default_contractor_questionnaires(
              where: {
                _and: [
                  {removed: {_eq: ${removed}}},
                  {group: {_eq: "Inspections"}},
                  {is_template: {_eq: true}},
                  ${asset_id ? `{asset_id: {_eq: ${asset_id}}},` : ''}
                  ${where_asset_type ? where_asset_type : ''}
                  ${_or}
                ]
              },
              order_by: {name: asc},
              offset: ${offset},
              ${limit > 0 ? `limit: ${limit}` : ''}
            ) {
                ${inspection_template_details_list_fragment}
                ${orgs_no_project_and_site_fragment}
            }
        }
      `,
			operationName: "listAllInspectionTemplateByLoggedQuery",
		});
	}
}
//</editor-fold>
