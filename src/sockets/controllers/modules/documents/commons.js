const {employee_personal_details_fragment} = require("../../../../graphql/Fragments");
const {signable_doc_template_details_fragment} = require("../../default/doc-signing-settings/templates/commons");

//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		doc_type,
		is_template,
		template_id,
		//
		title,
		type,
		internal_or_external,
		category_list,
		category_id,
		employee_list,
		employee_id,
		responsible_person_list,
		responsible_person_id,
		responsible_department_list,
		responsible_department_id,
		//
		date_range,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if(id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if(logged_employee_id) {
			filter.push(`_or: [
				{employee_id: {_eq: ${logged_employee_id}}},
				{responsible_person_id: {_eq: ${logged_employee_id}}},
				{responsible_department:{employee_list:{id: {_eq: ${logged_employee_id}}}}}
			]`);
		}

		console.log('is_template', is_template, isBoolean(is_template))
		
		if (isBoolean(is_template)) {
			filter.push(`is_template: {_eq: ${is_template}}`);
		}

		if (template_id) {
			filter.push(`template_id: {_eq: ${template_id}`);
		}
		if (doc_type) {
			filter.push(`doc_type: {_eq: "${doc_type}"}`);
		}
		if (title) {
			filter.push(`title: {_ilike: "%${title}%"}`);
		}
		if (type) {
			filter.push(`type: {_eq: "${type}"}`);
		}
		if (internal_or_external) {
			filter.push(`internal_or_external: {_eq: "${internal_or_external}"}`);
		}
		
		if (category_list) {
			filter.push(`category_id: {_in: [${category_list.map(v => v.id).join(', ')}]}`);
		}
		if (category_id) {
			filter.push(`category_id: {_eq: ${category_id}}`);
		}
		
		if (employee_list) {
			filter.push(`employee_id: {_in: [${employee_list.map(v => v.id).join(', ')}]}`);
		}
		if (employee_id) {
			filter.push(`employee_id: {_eq: ${employee_id}}`);
		}
		
		if (responsible_person_list) {
			filter.push(`responsible_person_id: {_in: [${responsible_person_list.map(v => v.id).join(', ')}]}`);
		}
		if (responsible_person_id) {
			filter.push(`responsible_person_id: {_eq: ${responsible_person_id}}`);
		}
		
		if (responsible_department_list) {
			filter.push(`responsible_department_id: {_in: [${responsible_department_list.map(v => v.id).join(', ')}]}`);
		}
		if (responsible_department_id) {
			filter.push(`responsible_department_id: {_eq: ${responsible_department_id}}`);
		}
		
		if (date_range) {
			const {start, end} = date_range;
			if (start && end) {
				filter.push(`doc_version_list:{expiry: {_gte: "${start}", _lte: "${end}"}}`);
			} else if (start) {
				filter.push(`doc_version_list:{expiry: {_gte: "${start}"}}`);
			} else if (end) {
				filter.push(`doc_version_list:{expiry: {_lte: "${end}"}}`);
			}
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="document_details_fragment">
exports.document_details_fragment = `
  id
  created_at
  title
  desc
  doc_type
  internal_or_external
  is_template
  category {
      id
      name
  }
  doc_version_list(order_by:{expiry: desc_nulls_last}){
      id
      type
      doc_num
      doc
      doc_docs_id
      expiry
  }
  latest_version: doc_version_list(limit: 1, order_by: {expiry: desc_nulls_last}){
      id
      type
      doc_num
      doc
      doc_docs_id
      expiry
  }
  shared_doc_list{
      id
      doc_expiry_date
      email
      fname
      lname
  }
  signable_doc_template_list{
  	${signable_doc_template_details_fragment}
  }
  employee{
      ${employee_personal_details_fragment}
  }
  responsible_person{
      ${employee_personal_details_fragment}
  }
  responsible_department{
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
