//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
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
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = [];//orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if(id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if(client_id) {
			filter.push(`client_id: {_eq: ${client_id}}`);
		}
		if(company_id) {
			filter.push(`company_id: {_eq: ${company_id}}`);
		}
		
		if(name) {
			filter.push(`name: {_ilike: "%${name}%"}`);
		}
		if(doc_num) {
			filter.push(`doc_version_list:{doc_num: {_eq: "${doc_num}"}}`);
		}
		if(category) {
			filter.push(`category: {_eq: "${category}"}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="contractor_questionnaire_template_details_find_fragment">
exports.contractor_questionnaire_template_details_find_fragment = `
    id
    created_at
    name
    category
    desc
    doc_version_list{
      id
      type
      doc_num
      doc
      expiry
    }
    latest_version: doc_version_list(order_by: {expiry: desc_nulls_last}){
      id
      type
      doc_num
      doc
      expiry
    }
    site{
        id
        name
    }
    contractor_site{
      id
      name
    }
    contractor {
      id
      name
    }
`;
//</editor-fold>

//<editor-fold desc="contractor_questionnaire_template_details_list_fragment">
exports.contractor_questionnaire_template_details_list_fragment = `
    id
    created_at
    name
    desc
    category
    doc_version_list{
        id
        type
        doc_num
        doc
        expiry
    }
    latest_version: doc_version_list(order_by: {expiry: desc_nulls_last}){
        id
        type
        doc_num
        doc
        expiry
    }
    contractor_site{
        id
        name
    }
    contractor {
        id
        name
    }
`;
//</editor-fold>
