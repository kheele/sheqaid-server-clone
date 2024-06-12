
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
        physical_state,
        type,
        risk_level,
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
        //
        if (name) {
            filter.push(`name: {_ilike: "%${name}%"}`);
        }
        if (category) {
            filter.push(`category: {_eq: "${category}"}`);
        }
        if (manufacturer) {
            filter.push(`manufacturer: {_eq: "${manufacturer}"}`);
        }
        if (physical_state) {
            filter.push(`physical_state: {_eq: "${physical_state}"}`);
        }
        if (type) {
            filter.push(`type: {_eq: "${type}"}`);
        }
        if (risk_level) {
            filter.push(`type: {_eq: "${risk_level}"}`);
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="chemical_hazchem_details_fragment">
exports.chemical_hazchem_details_fragment = `
  id
  created_at

  name
  physical_state
  type
  product{
    id
    name
  }
  sds{
    id
    name
  }

  contacts_emergency_name
  contacts_emergency_num
  contacts_manufacturer_name
  contacts_manufacturer_num

  doc

  precaution_photo_concentrate_list:precaution_photo_list(where: {type: {_eq: "Concentrate"}}){
    id
    doc
    type
  }
  precaution_photo_application_list:precaution_photo_list(where: {type: {_eq: "Application"}}){
    id
    doc
    type
  }

  active_ingredient_list:list(where: {group: {_eq: "Active Ingredient"}}){
    value
    group
  }

  hazard_identification_physical_list:list(where: {group: {_eq: "Hazard Identification"}, type: {_eq: "Physical"}}){
    value
    group
    type
  }
  hazard_identification_reproductive_list:list(where: {group: {_eq: "Hazard Identification"}, type: {_eq: "Reproductive"}}){
    value
    group
    type
  }
  hazard_identification_biological_list:list(where: {group: {_eq: "Hazard Identification"}, type: {_eq: "Biological"}}){
    value
    group
    type
  }

  first_aid_procedure_splashes_in_eyes_list:list(where: {group: {_eq: "First Aid Procedure"}, type: {_eq: "Splashes In Eyes"}}){
    value
    group
    type
  }
  first_aid_procedure_contact_with_skin_list:list(where: {group: {_eq: "First Aid Procedure"}, type: {_eq: "Contact with Skin"}}){
    value
    group
    type
  }
  first_aid_procedure_mouth_contact_or_eaten_list:list(where: {group: {_eq: "First Aid Procedure"}, type: {_eq: "Mouth Contact or Eaten"}}){
    value
    group
    type
  }
  first_aid_procedure_fumes_breathed_in_list:list(where: {group: {_eq: "First Aid Procedure"}, type: {_eq: "Fumes Breathed In"}}){
    value
    group
    type
  }

  emergency_action_for_spills_small_list:list(where: {group: {_eq: "Emergency Action For Spills"}, type: {_eq: "Small Spills"}}){
    value
    group
    type
  }
  emergency_action_for_spills_large_list:list(where: {group: {_eq: "Emergency Action For Spills"}, type: {_eq: "Large Spills"}}){
    value
    group
    type
  }

  disposal_used_container_list:list(where: {group: {_eq: "Disposal"}, type: {_eq: "Used Containers"}}){
    value
    group
    type
  }
  disposal_unused_product_list:list(where: {group: {_eq: "Disposal"}, type: {_eq: "Unused Product"}}){
    value
    group
    type
  }
`;
//</editor-fold>
