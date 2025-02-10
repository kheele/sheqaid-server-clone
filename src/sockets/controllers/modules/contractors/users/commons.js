//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		name,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if(name) {
			if (filter.anyMatch(v => v.trim().startsWith('_or'))) {
				filter.push(`_and: {
          _or: [{fname: {_ilike: "${name}"}}, {lname: {_ilike: "${name}"}}]
        }`);
			} else {
				filter.push(`_or: [{fname: {_ilike: "${name}"}}, {lname: {_ilike: "${name}"}}]`);
			}
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="user_details_fragment">
const user_details_fragment = `
    id
    auth_id
    created_at
    fname
    lname
    full_name
    username
    phone
    profile_pic
    auth_type
    has_biometric

    permissions_module_list {
        actions {
          create
          edit
          id
          remove
          share
          view
        }
        id
        module {
          key
          id
          plugin {
            id
            key
            desc
            title
            status
          }
          title
        }
      }
      permissions_other_list {
        actions {
          create
          edit
          id
          remove
          share
          view
        }
        id
        key {
          value
          id
        }
    }
    
    notifications_settings {
      id
      receive_asset_management_notifs
      receive_chemicals_management_notifs
      receive_contractor_management_notifs
      receive_employees_expired_docs_medicals
      receive_employees_profile_notifs
      receive_incident_management_notifs
      receive_non_conformance_management_notifs
      receive_training_management_notifs
      receive_expired_docs_notifs
    }
    linked_employee_id
    linked_employee {
      id
      fname
      lname
      email
      phone
    }
    contractor {
      id
      name
    }
`;
exports.user_details_fragment = user_details_fragment;
//</editor-fold>
