const {
	employee_personal_details_fragment,
	personal_details_other_fragment,
} = require("../../../../graphql/Fragments");

//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		name,
		reg_num,
		serial_num,
		model,
		condition,
		location,
		manufacturer,
		asset_type,
		//
		status,
		written_off = false,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		data_export = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	let asset_detail_filter = [];
	
	if(id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if (logged_employee_id) {
			// filter.push(`_or: [
			// 	{auditor_list:{employee_id: {_eq: ${logged_employee_id}}}},
			// 	{representative_list:{employee_id: {_eq: ${logged_employee_id}}}},
			// 	{list:{responsible_person_id: {_eq: ${logged_employee_id}}}},
			// ]`);
		}
		
		//
		// if (isBoolean(written_off)) {
		// 	filter.push(`written_off: {_eq: ${written_off}}`);
		// }
		
		if(status) {
			if(status.startsWith('!')) {
				filter.push(`status: {_neq: "${status.substring(1)}"}`);
			} else {
				filter.push(`status: {_eq: "${status}"}`);
			}
		}
		
		if(name) {
			asset_detail_filter.push(`name: {_ilike: "%${name}%"}`);
		}
		
		if(reg_num) {
			asset_detail_filter.push(`reg_num: {_eq: "${reg_num}"}`);
		}
		
		if(serial_num) {
			asset_detail_filter.push(`serial_num: {_eq: "${serial_num}"}`);
		}
		
		if(model) {
			asset_detail_filter.push(`model: {_ilike: "%${model}%"}`);
		}
		
		if(condition) {
			asset_detail_filter.push(`condition: {_eq: "${condition}"}`);
		}
		
		if(location) {
			asset_detail_filter.push(`location: {_ilike: "%${location}%"}`);
		}
		
		if(manufacturer) {
			asset_detail_filter.push(`manufacturer: {_ilike: "%${manufacturer}%"}`);
		}
		
		if(asset_type) {
			asset_detail_filter.push(`asset_type: {_eq: "${asset_type}"}`);
		}
	}
	
	if(asset_detail_filter.isNotEmpty()) {
		filter.push(`asset_detail: {${asset_detail_filter.join(',')}}`);
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="asset_basic_details_fragment">
const asset_basic_details_fragment = `
    id
    created_at
    status
    written_off
    written_off_date
    written_off_store_keeper_signature
    written_off_manager_signature
    written_off_reason
    written_off_comments
    profile_pic:photo_list(where: {removed: {_eq: false}, is_default: {_eq: true}}){
        id
        doc
        is_default
        removed
    }
    photo_list(where: {removed: {_eq: false}}){
        id
        doc
        is_default
        removed
    }
    responsible_person{
        id
        fname
        lname
        full_name
        email
        phone
        job_position{
            id
            name
        }
    }
    asset_detail{
    	id
        owning_company
        name
        asset_type
        desc
        manufacturer
        model
        reg_num
        serial_num
        location
        toolkit
        condition
        barcode
        qr_code
        notes
    }
`;
exports.asset_basic_details_fragment = asset_basic_details_fragment;
//</editor-fold>

//<editor-fold desc="asset_export_details_fragment">
exports.asset_export_details_fragment = `
    ${asset_basic_details_fragment}
    purchase_info{
        id
        created_at
        acquisition_date
        acquisition_value
        vendor
        warranty_expiry
        reference_num
        warranty_certificate
    }
    doc_list{
        id
        created_at
        doc
        expiry
        title
        desc
        type
    }
    depreciation{
        id
        depreciation_method
        asset_cost
        salvage_value
        depreciation_years
        depreciation_factor
        partial_year_depreciation
    }
    job_card_list{
        id
    }
    part_list{
        id
    }
    calibration_record_list{
        id
        next_calibration_interval
		next_calibration_date
        calibration_list{
          id
          calibrating_company
		  reference_standard
		  certificate_num
		  calibration_date
        }
    }
    maintenance_plan_list{
        id
        next_service_hrs_or_km
        plan_list{
        	id
          	reason_for_service
			service_date
			service_hrs_or_km
        }
    }
    monitoring_plan_list{
        id
        fuel_usage_list{
        	id
	        refilled_fuel
			current_hrs_or_km
			working_hrs_or_km
			date
			receipt
			cost
        }
        working_distance_or_time_list{
        	id
	        working_hrs_or_km_opening
			working_hrs_or_km_closing
			working_hrs_or_km
			date
        }
    }
`;
//</editor-fold>

//<editor-fold desc="asset_details_fragment">
exports.asset_details_fragment = `
  ${asset_basic_details_fragment}
  purchase_info{
    id
    created_at
    acquisition_date
    acquisition_value
    vendor
    warranty_expiry
    reference_num
    warranty_certificate
  }
  doc_list(where: {removed: {_eq: false}}){
    id
    created_at
    doc
    expiry
    title
    desc
    type
  }
  asset_children_list_aggregate{
    aggregate{
      count
    }
  }
  asset_parent_list_aggregate{
    aggregate{
      count
    }
  }
  #inspection_template_list: inspection_and_template_list(where: {is_template: {_eq: true}}){
    #\${/*inspection_fragment()*/}
  #}
  #inspection_list: inspection_and_template_list(where: {is_template: {_eq: false}}){
    #\${/*inspection_fragment()*/}
  #}
  #inspection_scheduled_list: inspection_and_template_list(where: {is_template: {_eq: false}, schedule_list: {completed: {_eq: false}}}){
    #\${/*inspection_fragment()*/}
  #}
  #inspection_history_list: inspection_and_template_list(where: {is_template: {_eq: false}, schedule_list: {completed: {_eq: true}}}){
    #\${/*inspection_fragment()*/}
  #}
  depreciation{
    id
    depreciation_method
    asset_cost
    salvage_value
    depreciation_years
    depreciation_factor
    partial_year_depreciation
  }
  job_card_list{
    id
  }
  part_list{
    id
  }
  calibration_record_list{
    id
    next_calibration_interval
		next_calibration_date
    calibration_list{
    	id
      calibrating_company
			reference_standard
			certificate_num
			calibration_date
    }
  }
  maintenance_plan_list{
    id
    next_service_hrs_or_km
    plan_list{
    	id
      reason_for_service
      service
			service_date
			service_hrs_or_km
    }
  }
  monitoring_plan_list{
    id
    fuel_usage_list{
    	id
	    refilled_fuel
			current_hrs_or_km
			working_hrs_or_km
			date
			receipt
			cost
    }
    working_distance_or_time_list{
    	id
	    working_hrs_or_km_opening
			working_hrs_or_km_closing
			working_hrs_or_km
			date
    }
  }
  register_list{
    id
    created_at
    taken_date
    taken_time
    due_return_date
    returned_date
    returned_time
    comments
    status
    condition
    location
    asset_id
    asset{
      id
    }
    employee_issued_by_id
    employee_issued_by{
      ${employee_personal_details_fragment}
    }
    employee_received_by_id
    employee_received_by{
      ${employee_personal_details_fragment}
    }
    employee_returned_by_id
    employee_returned_by{
      ${employee_personal_details_fragment}
    }
    employee_return_accepted_by_id
    employee_return_accepted_by{
      ${employee_personal_details_fragment}
    }
  }
  
  contractor_site{
    id
    name
  }
  contractor {
    id
    name
  }
`;
//</editor-fold>
