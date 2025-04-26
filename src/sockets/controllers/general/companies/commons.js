
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		name,
		module_id,
		module_list,
		sector_id,
		sector_list,
		category_id,
		category_list,
		zone_id,
		zone_list,
		country_id,
		country_list,
		//
		date_range,
		//
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
		if(name) {
			filter.push(`name: {_ilike: "%${name}%"}`);
		}
		if(module_list) {
			filter.push(`module_list: {module_id:{_in: [${module_list.map(v => v.id).join(', ')}]}}`);
		}
		if(module_id) {
			filter.push(`module_list: {module_id:{_eq: ${module_id}}}`);
		}
		if(sector_list) {
			filter.push(`sector_list: {sector_id:{_in: [${sector_list.map(v => v.id).join(', ')}]}}`);
		}
		if(sector_id) {
			filter.push(`sector_list: {sector_id:{_eq: ${sector_id}}}`);
		}
		if(category_list) {
			filter.push(`category_id:{_in: [${category_list.map(v => v.id).join(', ')}]}`);
		}
		if(category_id) {
			filter.push(`category_id:{_eq: ${category_id}}`);
		}
		if(zone_list) {
			filter.push(`zone_id:{_in: [${zone_list.map(v => v.id).join(', ')}]}`);
		}
		if(zone_id) {
			filter.push(`zone_id:{_eq: ${zone_id}}`);
		}
		if(country_list) {
			filter.push(`country_id:{_in: [${country_list.map(v => v.id).join(', ')}]}`);
		}
		if(country_id) {
			filter.push(`country_id:{_eq: ${country_id}}`);
		}
		
		if (date_range) {
			const {start, end} = date_range;
			if (start && end) {
				filter.push(`created_at: {_gte: "${start}", _lte: "${end}"}`);
			} else if (start) {
				filter.push(`created_at: {_gte: "${start}"}`);
			} else if (end) {
				filter.push(`created_at: {_lte: "${end}"}`);
			}
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="company_details_fragment">
exports.company_details_fragment = `
  id
  created_at
  account_type
  address
  business_id
  consultant
  email
  name
  no_projects
  phone
  profile_pic
  sector_list {
    id
    sector {
      id
      name
    }
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
    }
  }
  zone {
    id
    name
  }
  country {
    id
    name
  }
  category {
    id
    name
  }
`;
//</editor-fold>
