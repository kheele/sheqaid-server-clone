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
		if (name) {
			filter.push(`name: {_ilike: "%${name}%"}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="details_fragment">
exports.details_fragment = `
    id
    created_at
    name
    address
    project{
      id
      name
    }
    client{
      id
      name
    }
    contractor_site_user_list_aggregate {
      aggregate {
        count
      }
    }
    contractor_list_aggregate {
      aggregate {
        count
      }
    }
    user_list_aggregate {
      aggregate {
        count
      }
    }
    employee_list_aggregate {
      aggregate {
        count
      }
    }
    team_list_aggregate {
      aggregate {
        count
      }
    }
    incident_list_aggregate {
      aggregate {
        count
      }
    }
    training_matrix_list_aggregate {
      aggregate {
        count
      }
    }
    asset_list_aggregate {
      aggregate {
        count
      }
    }
`;
//</editor-fold>
