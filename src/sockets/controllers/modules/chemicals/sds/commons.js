//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		name,
		category,
		manufacturer,
		risk_level,
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
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if (name) {
			if (filter.anyMatch(v => v.trim().startsWith('_or'))) {
				filter.push(`_and: {
            _or: [
              {name: {_ilike: "%${name}%"}},
              {common_names: {_ilike: "%${name}%"}},
              {chemical_name: {_ilike: "%${name}%"}}
            ]
          }`);
			} else {
				filter.push(`_or: [
          {name: {_ilike: "%${name}%"}},
          {common_names: {_ilike: "%${name}%"}},
          {chemical_name: {_ilike: "%${name}%"}}
        ]`);
			}
		}
		if (category) {
			filter.push(`category: {_eq: "${category}"}`);
		}
		if (manufacturer) {
			filter.push(`manufacturer: {_eq: "${manufacturer}"}`);
		}
		if (risk_level) {
			filter.push(`risk_level: {_eq: "${risk_level}"}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="chemical_sds_details_fragment">
const chemical_sds_details_fragment = `
    id
    created_at
    
    product{
        id
        name
    }
    name
    common_names
    chemical_name
    empirical_formula
    un_num
    category
    date_identified
    application_or_use
    
    supplier_list{
      id
      manufacturer
      address
      phone
      email
      fax
      website
    }
    
    emergency_phone_nums
    risk_level
    more_product_info
    
    composition_or_information_on_ingredients
    
    hazards_identification
    
    first_aid_measures_and_precautions
    
    firefighting_measures
    
    accidental_release_measures
    
    handling_and_storage_requirements
    
    exposure_controls_or_personal_protection
    
    physical_and_chemical_properties
    
    stability_and_reactivity
    
    toxicological_info
    
    ecological_info
    
    disposal_considerations
    
    transport_info
    
    regulatory_info
    
    other_info
    
    doc
`;
exports.chemical_sds_details_fragment = chemical_sds_details_fragment;
//</editor-fold>
