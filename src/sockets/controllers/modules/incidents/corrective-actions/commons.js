//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		view,
		//
		// status,
		
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	// let filterIncidentInvestigation = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if (view === "Incident Investigation") {
			if (logged_employee_id) {
				filter.push(`_or: [
					{person_reporting_id: {_eq: ${logged_employee_id}}},
					{person_reported_to_id: {_eq: ${logged_employee_id}}},
					{person_involved_list: {person_involved_id: {_eq: ${logged_employee_id}}}},
					{person_injured_id: {_eq: ${logged_employee_id}}},
					{distribution_list: {employee_id: {_eq: ${logged_employee_id}}}},
					{witness_list: {witness_id: {_eq: ${logged_employee_id}}}},
					{vehicle_list: {driver_id: {_eq: ${logged_employee_id}}}},
					
					#For Investigation
					{investigation:{investigation_team_list:{investigator_id: {_eq: ${logged_employee_id}}}}},
					
					#For Corrective Actions
					{investigation:{cause_analysis:{immediate_analysis:{cause_analysis_cause_list:{corrective_action_list:{responsible_person_id: {_eq: ${logged_employee_id}}}}}}}},
					{investigation:{cause_analysis:{root_analysis:{cause_analysis_cause_list:{corrective_action_list:{responsible_person_id: {_eq: ${logged_employee_id}}}}}}}},
					
					#For NCR
					{ncr_list:{approving_person_id: {_eq: ${logged_employee_id}}}}
					{ncr_list:{assigned_person_list: {employee_id: {_eq: ${logged_employee_id}}}}}
					#One of the following 2 below may cause error
					{ncr_list:{assigned_job_position_list: {employee_list:{id: {_eq: ${logged_employee_id}}}}}}
					#{ncr_list:{responsible_person_id: {_eq: ${logged_employee_id}}}}
				]`);
			}
			
			// if (employee_id) {
			// 	filterIncidentInvestigation.push(`id: {_eq: ${employee_id}}`);
			// }
			// filterIncidentInvestigation = `,${filterIncidentInvestigation.join(',')}`;
		} else {
			// if (employee_id) {
			// 	filterIncidentInvestigation = `,employee_id: {_eq: ${employee_id}}`;
			// } else {
			// 	filterIncidentInvestigation = `,employee: {${filterIncidentInvestigation.join(',')}}`;
			// }
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>
