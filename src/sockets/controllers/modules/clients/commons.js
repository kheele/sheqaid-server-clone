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

//<editor-fold desc="client_details_fragment">
const client_details_fragment = `
    id
    created_at
    name
    address
    contractor_email
    email
    phone
    profile_pic
    linked_contractor {
      id
      name
      username
    }
    module_list {
      id
      price
      module {
        id
        borderColor
        desc
        discount
        faIconLeft
        faIconRight
        has_update
        hover
        key
        price
        sort
        status
        svgIconLeft
        svgIconRight
        title
        plugin{
          key
        }
      }
    }
    sector_list{
      id
      sector {
        id
        name
      }
    }
    project_list{
      id
      name
      site_list {
        id
        name
      }
    }
    site_list{
      id
      name
    }
    project_list_aggregate {
      aggregate {
        count
      }
    }
    site_list_aggregate {
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
exports.client_details_fragment = client_details_fragment;
//</editor-fold>
