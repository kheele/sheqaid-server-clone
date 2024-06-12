//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		client_name,
		site_name,
		name,
		username,
		//
		hasProjects, isConsultant,
		sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id,
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		contractor_site_id_key = "site_id",
	}
) => {
	//<editor-fold desc="variables, filters">
	// let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	let filter = [];
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		let filterSite = [];
		
		const company_id = sess_company_id;
		
		if(company_id) {
			filterSite.push(`company_id: {_eq: ${company_id}}`);
		}
		
		const site_id_fn = (site_id) => {
			if (site_id) {
				if (sess_my_site_id || exact_orgs) {
					return `, ${contractor_site_id_key}: {_eq: ${site_id}}`;
				} else {
					return `, _or: [
					{${contractor_site_id_key}: {_eq: ${site_id}}},
					{${contractor_site_id_key}: {_is_null: true}}
				]`;
				}
			}
			return ``;
		};
		const project_id_fn = (project_id) => {
			if (project_id) {
				if (sess_my_project_id || exact_orgs) {
					return `, _or: [
					{
						project_id: {_eq: ${project_id}}
						${site_id_fn(site_id)}
					}
				]`;
				} else {
					return `, _or: [
				  	{
						project_id: {_eq: ${project_id}}
						${site_id_fn(site_id)}
				  	},
				  	{project_id: {_is_null: true}}
				]`;
				}
			}
			return ``;
		};
		
		if (isConsultant) {
			if (client_id) {
				if (sess_my_client_id || exact_orgs) {
					filterSite.push(`_or: [
					{
					  client_id: {_eq: ${client_id}}
					  ${project_id_fn(project_id)}
					}
				]`);
				} else {
					filterSite.push(`_or: [
					{
					  client_id: {_eq: ${client_id}}
					  ${project_id_fn(project_id)}
					},
					{client_id: {_is_null: true}}
				]`);
				}
			}
		} else {
			if (hasProjects) {
				filterSite.push(`_or: [
				${project_id_fn(project_id).replace(', _or', '_or')}
	    	]`);
			}
		}
		
		if (client_name) {
			filterSite.push(`client: {name: {_ilike: "%${client_name}%"}}`);
		}
		if (site_name) {
			filterSite.push(`name: {_ilike: "%${site_name}%"}`);
		}
		
		if(filterSite.isNotEmpty()) {
			filter.push(`site_list: {site: {${filterSite.join(',')}}}`);
		}
		
		//
		if (name) {
			filter.push(`name: {_ilike: "%${name}%"}`);
		}
		if (username) {
			filter.push(`username: {_ilike: "%${username}%"}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="site_details_fragment">
const site_details_fragment = `
      id
      status
      contractor{
        id
        name
        username
      }
      site {
        id
        name
        company {
          id
          name
        }
        client {
          id
          name
        }
        project {
          id
          name
        }
      }
`;
//</editor-fold>

exports.contractor_details_fragment = (data) => {
	let where;
	
	if(data) {
		const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = data;
		const {client_id, project_id, site_id} = data;
		const {contractor_site_id_key = "site_id"} = data;
		
		const company_id = sess_company_id;
		
		const id = site_id || project_id || client_id || company_id;
		
		if (site_id) {
			where = `id: {_eq: ${id}}`;
		} else if (project_id) {
			where = `project_id: {_eq: ${id}}`;
		} else if (client_id) {
			where = `client_id: {_eq: ${id}}`;
		} else {
			where = `company_id: {_eq: ${id}}`;
		}
		
		where = `site: {removed: {_eq: false}, ${where}}`;
	}

	return `
    id
    created_at
    name
    username
    inc_contractor_pack
    contractor_user_list_aggregate(where:{removed: {_eq: false}}){
      aggregate{
        count
      }
    }
    employee_list_aggregate(where:{removed: {_eq: false}}){
      aggregate{
        count
      }
    }
    questionnaire_list_aggregate:contractor_questionnaire_list_aggregate(where: {removed: {_eq: false}, is_template: {_eq: false}, group: {_eq: "Contractors"}}){
      aggregate{
        count
      }
    }
    questionnaire_active_list_aggregate:contractor_questionnaire_list_aggregate(where: {removed: {_eq: false}, is_template: {_eq: false}, group: {_eq: "Contractors"}, status: {_neq: "CompleteAccepted"}}){
      aggregate{
        count
      }
    }
    questionnaire_complete_list_aggregate:contractor_questionnaire_list_aggregate(where: {removed: {_eq: false}, is_template: {_eq: false}, group: {_eq: "Contractors"}, status: {_eq: "CompleteAccepted"}}){
        aggregate{
          count
        }
    }
    questionnaire_compliance_list_aggregate:contractor_questionnaire_list_aggregate(where: {removed: {_eq: false}, is_template: {_eq: false}, group: {_eq: "Contractors"}, status: {_eq: "CompleteAccepted"}}){
        nodes {
            id
            question_list_aggregate {
                aggregate {
                    sum {
                        score
                        maxScore
                    }
                    min {
                        score
                    }
                    max {
                        score
                    }
                    avg {
                        score
                    }
                }
            }
        }
    }
    incident_list_aggregate(where:{removed: {_eq: false}}){
      aggregate{
        count
      }
    }
    site_pending_list:site_list(where: {status: {_eq: "Pending"}${where ? `, ${where}` : ""}}){
		  ${site_details_fragment}
		}
		site_accepted_list:site_list(where: {status: {_eq: "Accepted"}${where ? `, ${where}` : ""}}){
		  ${site_details_fragment}
		}
		site_declined_list:site_list(where: {status: {_eq: "Declined"}${where ? `, ${where}` : ""}}){
		  ${site_details_fragment}
		}
		site_cancelled_list:site_list(where: {status: {_eq: "Cancelled"}${where ? `, ${where}` : ""}}){
		  ${site_details_fragment}
		}
		site_removed_list:site_list(where: {status: {_eq: "Removed"}${where ? `, ${where}` : ""}}){
		  ${site_details_fragment}
		}
		site_list${where ? `(where: {${where}})` : ""}{
		  ${site_details_fragment}
		}
	`;
};
