const {
	employee_personal_details_fragment,
	personal_details_other_fragment,
	user_personal_details_fragment,
} = require("../../../../graphql/Fragments");

//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		expiry_date = 'ALL',
		mon, mon2, mon3,
		source,
		responsible_party_list,
		assigned_job_position_list,
		assigned_person_list,
		assigned_user_list,
		approving_person_list,
		type,
		priority,
		allocation,
		status_progress,
		status_acceptance,
		result,
		due_date_range,
		progress_date_range,
		completed_date_range,
		//
		logged_employee_id,
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
		if (logged_employee_id) {
			filter.push(`_or: [
				{approving_person_list: {employee_id: {_eq: ${logged_employee_id}}}},
				{assigned_person_list: {employee_id: {_eq: ${logged_employee_id}}}},
				{assigned_user_list: {user: {linked_employee_id:{_eq: ${logged_employee_id}}}}},
				{assigned_job_position_list: {employee_list:{id: {_eq: ${logged_employee_id}}}}},
				
				#For Site
				#{selected_source_site: {employee_list:{id: {_eq: ${logged_employee_id}}}}},
				
				#For Incident
				{selected_source_incident: {person_reporting_id: {_eq: ${logged_employee_id}}}}},
				{selected_source_incident: {person_reported_to_id: {_eq: ${logged_employee_id}}}},
				{selected_source_incident: {person_involved_list: {person_involved_id: {_eq: ${logged_employee_id}}}}},
				{selected_source_incident: {person_injured_id: {_eq: ${logged_employee_id}}}},
				{selected_source_incident: {distribution_list: {employee_id: {_eq: ${logged_employee_id}}}}},
				{selected_source_incident: {witness_list: {witness_id: {_eq: ${logged_employee_id}}}}},
				{selected_source_incident: {vehicle_list: {driver_id: {_eq: ${logged_employee_id}}}}},
				
				#For Incident Investigation
				{selected_source_incident: {investigation:{investigation_team_list:{investigator_id: {_eq: ${logged_employee_id}}}}}},
				
				#For Corrective Actions
				{selected_source_incident: {investigation:{cause_analysis:{immediate_analysis:{cause_analysis_cause_list:{corrective_action_list:{responsible_person_id: {_eq: ${logged_employee_id}}}}}}}}},
				{selected_source_incident: {investigation:{cause_analysis:{root_analysis:{cause_analysis_cause_list:{corrective_action_list:{responsible_person_id: {_eq: ${logged_employee_id}}}}}}}}},
				
				#For Inspection
				{selected_source_inspection: {responsible_person_id: {_eq: ${logged_employee_id}}}},
				
				#For Audit
				{selected_source_compliance_audit: {auditor_list:{employee_id: {_eq: ${logged_employee_id}}}}},
				{selected_source_compliance_audit: {representative_list:{employee_id: {_eq: ${logged_employee_id}}}}},
				{selected_source_compliance_audit: {list:{responsible_person_id: {_eq: ${logged_employee_id}}}}},
				{selected_source_item_compliance_audit_finding: {responsible_person_id: {_eq: ${logged_employee_id}}}},
			]`);
		}
		
		//
		if (expiry_date === null) {//expiry_no
			filter.push(`due_date: {_is_null: true}`);
		} else if (expiry_date === -1) {//expired
			filter.push(`due_date: {_lte: "now()"}`);
		} else if (expiry_date === 1) {//expired_1mon
			filter.push(`due_date: {_gt: "now()", _lte: "${mon}"}`);
		} else if (expiry_date === 2) {//expired_2mon
			filter.push(`due_date: {_gt: "${mon}", _lte: "${mon2}"}`);
		} else if (expiry_date === 3) {//expired_3mon
			filter.push(`due_date: {_gt: "${mon2}", _lte: "${mon3}"}`);
		} else if (expiry_date === 4) {//expired_4mon
			filter.push(`due_date: {_gt: "${mon3}"}`);
		}
		
		if (source) {
			filter.push(`source: {_eq: "${source}"}`);
		}
		
		if (responsible_party_list && responsible_party_list.isNotEmpty()) {
			filter.push(`responsible_party_list: {value: {_in: [${responsible_party_list.map(v => `"${v}"`).join(',')}]}}`);
		}
		if (assigned_job_position_list && assigned_job_position_list.isNotEmpty()) {
			filter.push(`assigned_job_position_list: {job_position_id: {_in: [${assigned_job_position_list.join(',')}]}}`);
		}
		if (assigned_person_list && assigned_person_list.isNotEmpty()) {
			filter.push(`assigned_person_list: {employee_id: {_in: [${assigned_person_list.join(',')}]}}`);
		}
		if (assigned_user_list && assigned_user_list.isNotEmpty()) {
			filter.push(`assigned_user_list: {user_id: {_in: [${assigned_user_list.join(',')}]}}`);
		}
		if (approving_person_list && approving_person_list.isNotEmpty()) {
			filter.push(`approving_person_list: {employee_id: {_in: [${approving_person_list.join(',')}]}}`);
		}
		
		if (type) {
			filter.push(`type: {_eq: "${type}"}`);
		}
		if (priority) {
			filter.push(`priority: {_eq: "${priority}"}`);
		}
		if (allocation) {
			filter.push(`allocation: {_eq: "${allocation}"}`);
		}
		if (status_progress) {
			filter.push(`status_progress: {_eq: "${status_progress}"}`);
		}
		if (status_acceptance) {
			filter.push(`status_acceptance: {_eq: "${status_acceptance}"}`);
		}
		if (result) {
			filter.push(`result: {_eq: "${result}"}`);
		}
		
		if (due_date_range) {
			const {start, end} = due_date_range;
			if (start && end) {
				filter.push(`due_date: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}`);
			} else if (start) {
				filter.push(`due_date: {_gte: "${Dates.formatDateSQL(start)}"}`);
			} else if (end) {
				filter.push(`due_date: {_lte: "${Dates.formatDateSQL(end)}"}`);
			}
		}
		if (progress_date_range) {
			const {start, end} = progress_date_range;
			if (start && end) {
				filter.push(`progress_list: {date: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}}`);
			} else if (start) {
				filter.push(`progress_list: {date: {_gte: "${Dates.formatDateSQL(start)}"}}`);
			} else if (end) {
				filter.push(`progress_list: {date: {_lte: "${Dates.formatDateSQL(end)}"}}`);
			}
		}
		if (completed_date_range) {
			const {start, end} = completed_date_range;
			if (start && end) {
				filter.push(`completed_date: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}`);
			} else if (start) {
				filter.push(`completed_date: {_gte: "${Dates.formatDateSQL(start)}"}`);
			} else if (end) {
				filter.push(`completed_date: {_lte: "${Dates.formatDateSQL(end)}"}`);
			}
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="ncr_details_fragment">
exports.ncr_details_fragment = `
  id
  created_at
  comments
  completed_date
  desc
  due_date
  process
  remarks
  type
  source
  priority
  allocation
  additional_notes
  status_acceptance
  status_progress
  result
  document_list(where: {type: {_eq: "Document Incident"}}){
    id
    doc
  }
  document_proof_list:document_list(where: {type: {_eq: "Document Proof"}}){
    id
    doc
  }
  progress_list{
    id
    outstanding
    notes
    date
  }
  responsible_party_list {
      id
      value
  }
  assigned_job_position_list {
      id
	  ncr_id
	  ncr{
		  id
	  }
	  job_position_id
      job_position{
          id
          name
      }
  }
  assigned_person_list {
      id
	  ncr_id
	  ncr{
		  id
	  }
	  employee_id
      employee{
        ${employee_personal_details_fragment}
      }
	  employee_other_id
      employee_other{
        ${personal_details_other_fragment}
      }
  }
  assigned_user_list {
	id
	ncr_id
	ncr{
		id
	}
	user_id
	user{
		${user_personal_details_fragment}
	}
  }
  approving_person_list{
	id
	ncr_id
	ncr{
		id
	}
	employee_id
	employee{
	  ${employee_personal_details_fragment}
	}
  }
  selected_source_site {
    id
    name
    project{
        id
        name
    }
    client{
        id
        name
    }
  }
  selected_source_incident {
    id
  }
  selected_source_inspection {
    id
  }
  selected_source_compliance_audit {
    id
  }
  
  #selected_source_item_incident {
  #  id
  #}
  selected_source_item_inspection_ques {
    id
  }
  selected_source_item_compliance_audit_finding {
    id
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
