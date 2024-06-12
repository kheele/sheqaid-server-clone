//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	if (!data) return;
	
	const {removed = false, now, range_start, range_end,} = data;
	const {site_id, project_id, client_id, company_id, contractor_id, contractor_site_id,} = data;
	
	const id = site_id || project_id || client_id || company_id;
	let tbl;
	if (site_id) {
		tbl = "default_sites";
	} else if (project_id) {
		tbl = "default_projects";
	} else if (client_id) {
		tbl = "default_clients";
	} else {
		tbl = "default_companies";
	}
	
	return getGraphQLOne({
		query: `
      query findByIdOrgChemicalsDashboardQuery {
        ${tbl}(
          where: {
            id: {_eq: ${id}}
          }
        ) {
			    #
			    all_chemical_sds_list_aggregate: chemical_sds_list_aggregate {
			      aggregate {
			        count
			      }
			    }
			    all_hazchem_sheet_list_aggregate: hazchem_sheet_list_aggregate {
			      aggregate {
			        count
			      }
			    }
			    all_chemical_product_list_aggregate: chemical_product_list_aggregate {
			      aggregate {
			        count
			      }
			    }
			    
			    #
			    risk_unclassified_sds_list_aggregate: chemical_sds_list_aggregate(where:{risk_level: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_low_sds_list_aggregate: chemical_sds_list_aggregate(where:{risk_level: {_eq: "Low"}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_medium_sds_list_aggregate: chemical_sds_list_aggregate(where:{risk_level: {_eq: "Medium"}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_high_sds_list_aggregate: chemical_sds_list_aggregate(where:{risk_level: {_eq: "High"}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_very_high_sds_list_aggregate: chemical_sds_list_aggregate(where:{risk_level: {_eq: "Very High"}}) {
			      aggregate {
			        count
			      }
			    }
    
			    #
			    risk_unclassified_hazchem_sheet_list_aggregate: hazchem_sheet_list_aggregate(where:{product:{risk_level: {_is_null: true}}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_low_hazchem_sheet_list_aggregate: hazchem_sheet_list_aggregate(where:{product:{risk_level: {_eq: "Low"}}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_medium_hazchem_sheet_list_aggregate: hazchem_sheet_list_aggregate(where:{product:{risk_level: {_eq: "Medium"}}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_high_hazchem_sheet_list_aggregate: hazchem_sheet_list_aggregate(where:{product:{risk_level: {_eq: "High"}}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_very_high_hazchem_sheet_list_aggregate: hazchem_sheet_list_aggregate(where:{product:{risk_level: {_eq: "Very High"}}}) {
			      aggregate {
			        count
			      }
			    }
			    
			    #
			    risk_unclassified_chemical_product_list_aggregate: chemical_product_list_aggregate(where:{risk_level: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_low_chemical_product_list_aggregate: chemical_product_list_aggregate(where:{risk_level: {_eq: "Low"}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_medium_chemical_product_list_aggregate: chemical_product_list_aggregate(where:{risk_level: {_eq: "Medium"}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_high_chemical_product_list_aggregate: chemical_product_list_aggregate(where:{risk_level: {_eq: "High"}}) {
			      aggregate {
			        count
			      }
			    }
			    risk_very_high_chemical_product_list_aggregate: chemical_product_list_aggregate(where:{risk_level: {_eq: "Very High"}}) {
			      aggregate {
			        count
			      }
			    }
			    
			    #
			    physical_state_unclassified_sds_list_aggregate: chemical_sds_list_aggregate(where:{product:{physical_state: {_is_null: true}}}) {
			      aggregate {
			        count
			      }
			    }
			    physical_state_gas_sds_list_aggregate: chemical_sds_list_aggregate(where:{product:{physical_state: {_eq: "Gas"}}}) {
			      aggregate {
			        count
			      }
			    }
			    physical_state_liquid_sds_list_aggregate: chemical_sds_list_aggregate(where:{product:{physical_state: {_eq: "Liquid"}}}) {
			      aggregate {
			        count
			      }
			    }
			    physical_state_solid_sds_list_aggregate: chemical_sds_list_aggregate(where:{product:{physical_state: {_eq: "Solid"}}}) {
			      aggregate {
			        count
			      }
			    }
			    physical_state_liquid_crystal_sds_list_aggregate: chemical_sds_list_aggregate(where:{product:{physical_state: {_eq: "Liquid Crystal"}}}) {
			      aggregate {
			        count
			      }
			    }
			    
			    #
			    physical_state_unclassified_hazchem_sheet_list_aggregate: hazchem_sheet_list_aggregate(where:{physical_state: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    physical_state_gas_hazchem_sheet_list_aggregate: hazchem_sheet_list_aggregate(where:{physical_state: {_eq: "Gas"}}) {
			      aggregate {
			        count
			      }
			    }
			    physical_state_liquid_hazchem_sheet_list_aggregate: hazchem_sheet_list_aggregate(where:{physical_state: {_eq: "Liquid"}}) {
			      aggregate {
			        count
			      }
			    }
			    physical_state_solid_hazchem_sheet_list_aggregate: hazchem_sheet_list_aggregate(where:{physical_state: {_eq: "Solid"}}) {
			      aggregate {
			        count
			      }
			    }
			    physical_state_liquid_crystal_hazchem_sheet_list_aggregate: hazchem_sheet_list_aggregate(where:{physical_state: {_eq: "Liquid Crystal"}}) {
			      aggregate {
			        count
			      }
			    }
			    
			    #
			    physical_state_unclassified_chemical_product_list_aggregate: chemical_product_list_aggregate(where:{physical_state: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    physical_state_gas_chemical_product_list_aggregate: chemical_product_list_aggregate(where:{physical_state: {_eq: "Gas"}}) {
			      aggregate {
			        count
			      }
			    }
			    physical_state_liquid_chemical_product_list_aggregate: chemical_product_list_aggregate(where:{physical_state: {_eq: "Liquid"}}) {
			      aggregate {
			        count
			      }
			    }
			    physical_state_solid_chemical_product_list_aggregate: chemical_product_list_aggregate(where:{physical_state: {_eq: "Solid"}}) {
			      aggregate {
			        count
			      }
			    }
			    physical_state_liquid_crystal_chemical_product_list_aggregate: chemical_product_list_aggregate(where:{physical_state: {_eq: "Liquid Crystal"}}) {
			      aggregate {
			        count
			      }
			    }
			    
			    #
			    has_product_yes_sds_list_aggregate: chemical_sds_list_aggregate(where: {product_id: {_is_null: false}}) {
			      aggregate {
			        count
			      }
			    }
			    has_product_no_sds_list_aggregate: chemical_sds_list_aggregate(where: {product_id: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    has_product_yes_hazchem_sheet_list_aggregate: hazchem_sheet_list_aggregate(where: {product_id: {_is_null: false}}) {
			      aggregate {
			        count
			      }
			    }
			    has_product_no_hazchem_sheet_list_aggregate: hazchem_sheet_list_aggregate(where: {product_id: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    is_stable_yes_chemical_product_list_aggregate: chemical_product_list_aggregate(where: {is_stable: {_eq: true}}) {
			      aggregate {
			        count
			      }
			    }
			    is_stable_no_chemical_product_list_aggregate: chemical_product_list_aggregate(where: {is_stable: {_eq: false}}) {
			      aggregate {
			        count
			      }
			    }
			    is_hazardous_yes_chemical_product_list_aggregate: chemical_product_list_aggregate(where: {is_hazardous: {_eq: true}}) {
			      aggregate {
			        count
			      }
			    }
			    is_hazardous_no_chemical_product_list_aggregate: chemical_product_list_aggregate(where: {is_hazardous: {_eq: false}}) {
			      aggregate {
			        count
			      }
			    }
			    is_combustible_yes_chemical_product_list_aggregate: chemical_product_list_aggregate(where: {is_combustible: {_eq: true}}) {
			      aggregate {
			        count
			      }
			    }
			    is_combustible_no_chemical_product_list_aggregate: chemical_product_list_aggregate(where: {is_combustible: {_eq: false}}) {
			      aggregate {
			        count
			      }
			    }
			    is_flammable_yes_chemical_product_list_aggregate: chemical_product_list_aggregate(where: {is_flammable: {_eq: true}}) {
			      aggregate {
			        count
			      }
			    }
			    is_flammable_no_chemical_product_list_aggregate: chemical_product_list_aggregate(where: {is_flammable: {_eq: false}}) {
			      aggregate {
			        count
			      }
			    }
			    has_sds_yes_chemical_product_list_aggregate: chemical_product_list_aggregate(where: {_or: [{has_sds_view: {_eq: true}}, {sds_id: {_is_null: false}}, {sds_doc: {_is_null: false}}]}) {
			      aggregate {
			        count
			      }
			    }
			    has_sds_no_chemical_product_list_aggregate: chemical_product_list_aggregate(where: {has_sds_view: {_eq: false}, sds_id: {_is_null: true}, sds_doc: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    has_hazchem_sheet_yes_chemical_product_list_aggregate: chemical_product_list_aggregate(where: {_or: [{has_hazchem_sheet_view: {_eq: true}}, {hazchem_sheet_id: {_is_null: false}}, {hazchem_sheet_doc: {_is_null: false}}]}) {
			      aggregate {
			        count
			      }
			    }
			    has_hazchem_sheet_no_chemical_product_list_aggregate: chemical_product_list_aggregate(where: {has_hazchem_sheet_view: {_eq: false}, hazchem_sheet_id: {_is_null: true}, hazchem_sheet_doc: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			    has_risk_assessment_yes_chemical_product_list_aggregate: chemical_product_list_aggregate(where: {_or: [{has_risk_assessment: {_eq: true}}, {risk_assessment_doc: {_is_null: false}}]}) {
			      aggregate {
			        count
			      }
			    }
			    has_risk_assessment_no_chemical_product_list_aggregate: chemical_product_list_aggregate(where: {has_risk_assessment: {_eq: false}, risk_assessment_doc: {_is_null: true}}) {
			      aggregate {
			        count
			      }
			    }
			  }
      }
    `,
		operationName: "findByIdOrgChemicalsDashboardQuery",
	});
}
//</editor-fold>
