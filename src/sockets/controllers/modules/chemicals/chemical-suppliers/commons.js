//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		manufacturer,
		product_id,
		sds_id,
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
		if (manufacturer) {
			filter.push(`manufacturer: {_ilike: "%${manufacturer}%"}`);
		}
		if (product_id) {
			filter.push(`product_id: {_eq: ${product_id}}`);
		}
		if (sds_id) {
			filter.push(`sds_id: {_eq: ${sds_id}}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="chemical_supplier_details_fragment">
const chemical_supplier_details_fragment = `
    id
    manufacturer
    address
    phone
    email
    fax
    website
    product_id
    sds_id
    
    product{
        id
        name
    }
    sds{
        id
        name
    }
`;
exports.chemical_sds_details_fragment = chemical_supplier_details_fragment;
//</editor-fold>
