
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        id,
        //
        name,
        manufacturer,
        type,
        category,
        physical_state,
        risk_level,
        is_stable,
        is_hazardous,
        is_combustible,
        is_flammable,
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
        if (manufacturer) {
            filter.push(`manufacturer: {_eq: "${manufacturer}"}`);
        }
        if (type) {
            filter.push(`type: {_eq: "${type}"}`);
        }
        if (category) {
            filter.push(`category: {_eq: "${category}"}`);
        }
        if (physical_state) {
            filter.push(`physical_state: {_eq: "${physical_state}"}`);
        }
        if (risk_level) {
            filter.push(`risk_level: {_eq: "${risk_level}"}`);
        }
        if (is_stable) {
            filter.push(`is_stable: {_eq: ${is_stable}}`);
        }
        if (is_hazardous) {
            filter.push(`is_hazardous: {_eq: ${is_hazardous}}`);
        }
        if (is_combustible) {
            filter.push(`is_combustible: {_eq: ${is_combustible}}`);
        }
        if (is_flammable) {
            filter.push(`is_flammable: {_eq: ${is_flammable}}`);
        }
        if (date_range) {
            // filter.push(`is_flammable: {_eq: ${is_flammable}}`);
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="chemical_product_details_fragment">
const chemical_product_details_fragment = `
    id
    created_at
    
    name
    common_names
    chemical_name
    empirical_formula
    un_num
    cas_num
    concentration
    category
    physical_state
    type
    application_or_use
    
    #manufacturer
    #manufacturer_addr
    #manufacturer_phone_num
    #manufacturer_email
    #manufacturer_fax
    #manufacturer_website
    
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
    
    location_where_product_is_used
    process_where_product_is_used
    is_stable
    is_cool_well_ventilated_area
    heat_sparks_static_flames
    spillage_control
    other_special_info
    
    compatible_with_list
    incompatible_with_list
    
    risk_level
    
    is_combustible
    is_flammable
    flammability_combustibility_class
    
    fire_fighting_foam
    fire_fighting_dcp
    fire_fighting_co2
    fire_fighting_sand
    fire_fighting_water
    fire_fighting_other
    
    is_hazardous
    hazard_class_list
    
    has_sds
    has_sds_view
    sds{
        id
    }
    sds_doc
    sds_date
    
    has_hazchem_sheet
    has_hazchem_sheet_view
    hazchem_sheet{
        id
    }
    hazchem_sheet_doc
    hazchem_sheet_date
    
    has_risk_assessment
    risk_assessment_doc
    risk_assessment_date
    
    ppe_type_list {
        ppe_type{
            id
            name
        }
    }
    
    action_or_comments
    
    chemical_stock_list {
       is_clearly_labeled
       storage_location
       unit
       qty
       date_received
       expiry_date
    }
`;
exports.chemical_product_details_fragment = chemical_product_details_fragment;
//</editor-fold>
