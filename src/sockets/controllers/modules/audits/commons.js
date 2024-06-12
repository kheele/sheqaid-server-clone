const {
	employee_personal_details_fragment,
	personal_details_other_fragment,
} = require("../../../../graphql/Fragments");

//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		representative_list,
		representative_id,
		auditor,
		type,
		scope,
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
		if (logged_employee_id) {
			filter.push(`_or: [
				{auditor_list:{employee_id: {_eq: ${logged_employee_id}}}},
				{representative_list:{employee_id: {_eq: ${logged_employee_id}}}},
				{list:{responsible_person_id: {_eq: ${logged_employee_id}}}},
			]`);
		}
		
		//
		if(representative_list) {
			filter.push(`representative_list: {employee_id:{_in: [${representative_list.map(v => v.id).join(', ')}]}}`);
		}
		if(representative_id) {
			filter.push(`representative_list: {employee_id:{_eq: ${representative_id}}}`);
		}
		if(auditor) {
			filter.push(`
				auditor_list:{
	        _or:[
	          {employee:{
	            _or:[
	              {fname: {_ilike: "%${auditor}%"}},
	              {lname: {_ilike: "%${auditor}%"}}
	            ]
	          }},
	          {other_person:{
	            _or:[
	              {fname: {_ilike: "%${auditor}%"}},
	              {lname: {_ilike: "%${auditor}%"}}
	            ]
	          }}
	        ]
	      }
      `);
		}
		
		if(type) {
			filter.push(`type: {_ilike: "%${type}%"}`);
		}
		if(scope) {
			filter.push(`scope: {_ilike: "%${scope}%"}`);
		}
		
		if (date_range) {
			const {start, end} = date_range;
			if (start && end) {
				filter.push(`date: {_gte: "${start}", _lte: "${end}"}`);
			} else if (start) {
				filter.push(`date: {_gte: "${start}"}`);
			} else if (end) {
				filter.push(`date: {_lte: "${end}"}`);
			}
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="audit_details_fragment">
exports.audit_details_fragment = `
  id
  removed
  created_at
  type
  date
  scope
  
  auditor_list{
    id
    audit_id
    employee{
      ${employee_personal_details_fragment}
    }
    other_person{
      ${personal_details_other_fragment}
    }
  }
  representative_list{
    id
    audit_id
    employee{
      ${employee_personal_details_fragment}
    }
    other_person{
      ${personal_details_other_fragment}
    }
  }
  definition_list{
    id
    audit_id
    title
    desc
  }
  list{
    id
    audit_id
    audit{
      id
    }
    element
    sub_element
    target_date
    due_date
    audit_findings
    audit_summary
    possible_score
    achieved_score
    comments
    compliance
    responsible_person{
      ${employee_personal_details_fragment}
    }
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
