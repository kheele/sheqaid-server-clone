//<editor-fold desc="findByIdOrgHRDashboardStatsImpl">
const getArgs = async (socket) => {
	//logged_contractor_id, selected_contractor_client_id, selected_contractor_site_id,
	//access_type
	const is = await socket.is();
	if (!is) return;

	const {isConsultant, isNoProjects, isContractorView} = is;
	const decodedIdToken = await socket.getDecodedIdToken();
	if (!decodedIdToken) return;
	const {
		company_id,
		selected_client_id,
		selected_project_id,
		selected_site_id,
		logged_contractor_id
	} = decodedIdToken;

	let org, org_id_key, id;
	if (isContractorView) {
		id = logged_contractor_id;
		org_id_key = "contractor_id";
		org = "Contractor";
	} else {
		if (isConsultant) {
			if (selected_site_id) {
				id = selected_site_id;
				org_id_key = "site_id";
				org = "Site";
			} else if (selected_project_id) {
				id = selected_project_id;
				org_id_key = "project_id";
				org = "Project";
			} else if (selected_client_id) {
				id = selected_client_id;
				org_id_key = "client_id";
				org = "Client";
			} else {
				id = company_id;
				org_id_key = "company_id";
				org = "Company";
			}
		} else if (!isNoProjects) {//client with projects
			if (selected_site_id) {
				id = selected_site_id;
				org_id_key = "site_id";
				org = "Site";
			} else if (selected_project_id) {
				id = selected_project_id;
				org_id_key = "project_id";
				org = "Project";
			} else {
				id = company_id;
				org_id_key = "company_id";
				org = "Company";
			}
		} else {
			id = company_id;
			org_id_key = "company_id";
			org = "Company";
		}
	}

	return {org, org_id_key, id};
};

exports.findByIdOrgHRDashboardStatsImpl = () => {
	return async (socket, data) => {
		const args = await getArgs(socket, data);
		if (!args) return;

		const {org, org_id_key, id} = args;

		const operationName = `findById${org}HRDashboardStatsQuery`;

		const {
			// id,
			mon,
			mon2,
			mon3,
			//
			// site_id, project_id, client_id, company_id,
		} = data;

		return getGraphQLOne({
			variables: {id, mon, mon2, mon3},
			multi_queries: true,
			query: `
	      query ${operationName}($id: bigint, $mon: date, $mon2: date, $mon3: date) {
	        employee_active_list_aggregate:hr_employees_aggregate(where: {
            ${org_id_key}: {_eq: $id},
            removed: {_eq: false}
	        }){
	            aggregate{
	                count
	            }
	        }
	        employee_removed_list_aggregate:hr_employees_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: true}
	        }){
	            aggregate{
	                count
	            }
	        }
	        supervisor_list_aggregate:hr_employees_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, 
	            _or:[{
	            	supervisor_employee_list_aggregate: {
	            		count: {
	            			filter: {removed: {_eq: false}}, 
	            			predicate: {_gt: 0}
	            		}
	            	}},
	            	{supervisor_team_list_aggregate: {
	            		count: {
	            			filter: {status: {_eq: "Active"}}, 
	            			predicate: {_gt: 0}
	            		}
	            	},
	            }]
	        }){
	            aggregate{
	                count
	            }
	        }
	
	        #competency_list
	        competency_list_active_aggregate:hr_employees_docs_competencies_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}
	        }){
	            aggregate{
	                count
	            }
	        }
	        competency_list_no_expiry_aggregate:hr_employees_docs_competencies_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_is_null: true}
	        }){
	            aggregate{
	                count
	            }
	        }
	        competency_list_expired_aggregate:hr_employees_docs_competencies_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_lte: "now()"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        competency_list_mon_expiry_aggregate:hr_employees_docs_competencies_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
	        }){
	            aggregate{
	                count
	            }
	        }
	        competency_list_2mon_expiry_aggregate:hr_employees_docs_competencies_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
	        }){
	            aggregate{
	                count
	            }
	        }
	        competency_list_3mon_expiry_aggregate:hr_employees_docs_competencies_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	        competency_list_4mon_expiry_aggregate:hr_employees_docs_competencies_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	
	        #contract_list
	        contract_list_active_aggregate:hr_employees_docs_contracts_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}
	        }){
	            aggregate{
	                count
	            }
	        }
	        contract_list_no_expiry_aggregate:hr_employees_docs_contracts_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, contract_details: {expiry_date: {_is_null: true}}
	        }){
	            aggregate{
	                count
	            }
	        }
	        contract_list_expired_aggregate:hr_employees_docs_contracts_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, contract_details: {expiry_date: {_lte: "now()"}}
	        }){
	            aggregate{
	                count
	            }
	        }
	        contract_list_mon_expiry_aggregate:hr_employees_docs_contracts_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, contract_details: {expiry_date: {_gt: "now()", _lte: $mon}}
	        }){
	            aggregate{
	                count
	            }
	        }
	        contract_list_2mon_expiry_aggregate:hr_employees_docs_contracts_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, contract_details: {expiry_date: {_gt: $mon, _lte: $mon2}}
	        }){
	            aggregate{
	                count
	            }
	        }
	        contract_list_3mon_expiry_aggregate:hr_employees_docs_contracts_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, contract_details: {expiry_date: {_gt: $mon2, _lte: $mon3}}
	        }){
	            aggregate{
	                count
	            }
	        }
	        contract_list_4mon_expiry_aggregate:hr_employees_docs_contracts_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, contract_details: {expiry_date: {_gt: $mon3}}
	        }){
	            aggregate{
	                count
	            }
	        }
	
	        #job_appointment_list
	        job_appointment_list_active_aggregate:hr_employees_docs_job_appointments_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}
	        }){
	            aggregate{
	                count
	            }
	        }
	        job_appointment_list_no_expiry_aggregate:hr_employees_docs_job_appointments_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_is_null: true}
	        }){
	            aggregate{
	                count
	            }
	        }
	        job_appointment_list_expired_aggregate:hr_employees_docs_job_appointments_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_lte: "now()"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        job_appointment_list_mon_expiry_aggregate:hr_employees_docs_job_appointments_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
	        }){
	            aggregate{
	                count
	            }
	        }
	        job_appointment_list_2mon_expiry_aggregate:hr_employees_docs_job_appointments_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
	        }){
	            aggregate{
	                count
	            }
	        }
	        job_appointment_list_3mon_expiry_aggregate:hr_employees_docs_job_appointments_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	        job_appointment_list_4mon_expiry_aggregate:hr_employees_docs_job_appointments_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	
	        #counselling_list
	        counselling_list_active_aggregate:hr_employees_docs_counsellings_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}
	        }){
	            aggregate{
	                count
	            }
	        }
	        counselling_list_no_expiry_aggregate:hr_employees_docs_counsellings_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_is_null: true}
	        }){
	            aggregate{
	                count
	            }
	        }
	        counselling_list_expired_aggregate:hr_employees_docs_counsellings_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_lte: "now()"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        counselling_list_mon_expiry_aggregate:hr_employees_docs_counsellings_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
	        }){
	            aggregate{
	                count
	            }
	        }
	        counselling_list_2mon_expiry_aggregate:hr_employees_docs_counsellings_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
	        }){
	            aggregate{
	                count
	            }
	        }
	        counselling_list_3mon_expiry_aggregate:hr_employees_docs_counsellings_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	        counselling_list_4mon_expiry_aggregate:hr_employees_docs_counsellings_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	
	        #leave_list
	        leave_list_active_aggregate:hr_employees_docs_leaves_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}
	        }){
	            aggregate{
	                count
	            }
	        }
	        leave_list_no_expiry_aggregate:hr_employees_docs_leaves_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_is_null: true}
	        }){
	            aggregate{
	                count
	            }
	        }
	        leave_list_expired_aggregate:hr_employees_docs_leaves_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_lte: "now()"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        leave_list_mon_expiry_aggregate:hr_employees_docs_leaves_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
	        }){
	            aggregate{
	                count
	            }
	        }
	        leave_list_2mon_expiry_aggregate:hr_employees_docs_leaves_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
	        }){
	            aggregate{
	                count
	            }
	        }
	        leave_list_3mon_expiry_aggregate:hr_employees_docs_leaves_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	        leave_list_4mon_expiry_aggregate:hr_employees_docs_leaves_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	
	        #license_list
	        license_list_active_aggregate:hr_employees_docs_licenses_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}
	        }){
	            aggregate{
	                count
	            }
	        }
	        license_list_no_expiry_aggregate:hr_employees_docs_licenses_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_is_null: true}
	        }){
	            aggregate{
	                count
	            }
	        }
	        license_list_expired_aggregate:hr_employees_docs_licenses_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_lte: "now()"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        license_list_mon_expiry_aggregate:hr_employees_docs_licenses_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
	        }){
	            aggregate{
	                count
	            }
	        }
	        license_list_2mon_expiry_aggregate:hr_employees_docs_licenses_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
	        }){
	            aggregate{
	                count
	            }
	        }
	        license_list_3mon_expiry_aggregate:hr_employees_docs_licenses_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	        license_list_4mon_expiry_aggregate:hr_employees_docs_licenses_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	
	        #medical_list
	        medical_list_active_aggregate:hr_employees_docs_medicals_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}
	        }){
	            aggregate{
	                count
	            }
	        }
	        medical_list_no_expiry_aggregate:hr_employees_docs_medicals_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_is_null: true}
	        }){
	            aggregate{
	                count
	            }
	        }
	        medical_list_expired_aggregate:hr_employees_docs_medicals_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_lte: "now()"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        medical_list_mon_expiry_aggregate:hr_employees_docs_medicals_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
	        }){
	            aggregate{
	                count
	            }
	        }
	        medical_list_2mon_expiry_aggregate:hr_employees_docs_medicals_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
	        }){
	            aggregate{
	                count
	            }
	        }
	        medical_list_3mon_expiry_aggregate:hr_employees_docs_medicals_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	        medical_list_4mon_expiry_aggregate:hr_employees_docs_medicals_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	
	        #warning_list
	        warning_list_active_aggregate:hr_employees_docs_warnings_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}
	        }){
	            aggregate{
	                count
	            }
	        }
	        warning_list_no_expiry_aggregate:hr_employees_docs_warnings_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_is_null: true}
	        }){
	            aggregate{
	                count
	            }
	        }
	        warning_list_expired_aggregate:hr_employees_docs_warnings_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_lte: "now()"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        warning_list_mon_expiry_aggregate:hr_employees_docs_warnings_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
	        }){
	            aggregate{
	                count
	            }
	        }
	        warning_list_2mon_expiry_aggregate:hr_employees_docs_warnings_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
	        }){
	            aggregate{
	                count
	            }
	        }
	        warning_list_3mon_expiry_aggregate:hr_employees_docs_warnings_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	        warning_list_4mon_expiry_aggregate:hr_employees_docs_warnings_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	
	        #work_permit_list
	        work_permit_list_active_aggregate:hr_employees_docs_work_permits_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}
	        }){
	            aggregate{
	                count
	            }
	        }
	        work_permit_list_no_expiry_aggregate:hr_employees_docs_work_permits_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_is_null: true}
	        }){
	            aggregate{
	                count
	            }
	        }
	        work_permit_list_expired_aggregate:hr_employees_docs_work_permits_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_lte: "now()"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        work_permit_list_mon_expiry_aggregate:hr_employees_docs_work_permits_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}
	        }){
	            aggregate{
	                count
	            }
	        }
	        work_permit_list_2mon_expiry_aggregate:hr_employees_docs_work_permits_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}
	        }){
	            aggregate{
	                count
	            }
	        }
	        work_permit_list_3mon_expiry_aggregate:hr_employees_docs_work_permits_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	        work_permit_list_4mon_expiry_aggregate:hr_employees_docs_work_permits_aggregate(where: {
	            ${org_id_key}: {_eq: $id},
	            removed: {_eq: false}, expiry_date: {_gt: $mon3}
	        }){
	            aggregate{
	                count
	            }
	        }
	
	        #prdp_list
	        prdp_list_active_aggregate:hr_employees_documents_aggregate(where: {
	            employee: {${org_id_key}: {_eq: $id}},
	            removed: {_eq: false}, type: {_eq: "PrDP"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        prdp_list_no_expiry_aggregate:hr_employees_documents_aggregate(where: {
	            employee: {${org_id_key}: {_eq: $id}},
	            removed: {_eq: false}, expiry_date: {_is_null: true}, type: {_eq: "PrDP"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        prdp_list_expired_aggregate:hr_employees_documents_aggregate(where: {
	            employee: {${org_id_key}: {_eq: $id}},
	            removed: {_eq: false}, expiry_date: {_lte: "now()"}, type: {_eq: "PrDP"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        prdp_list_mon_expiry_aggregate:hr_employees_documents_aggregate(where: {
	            employee: {${org_id_key}: {_eq: $id}},
	            removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}, type: {_eq: "PrDP"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        prdp_list_2mon_expiry_aggregate:hr_employees_documents_aggregate(where: {
	            employee: {${org_id_key}: {_eq: $id}},
	            removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}, type: {_eq: "PrDP"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        prdp_list_3mon_expiry_aggregate:hr_employees_documents_aggregate(where: {
	            employee: {${org_id_key}: {_eq: $id}},
	            removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}, type: {_eq: "PrDP"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        prdp_list_4mon_expiry_aggregate:hr_employees_documents_aggregate(where: {
	            employee: {${org_id_key}: {_eq: $id}},
	            removed: {_eq: false}, expiry_date: {_gt: $mon3}, type: {_eq: "PrDP"}
	        }){
	            aggregate{
	                count
	            }
	        }
	
	        #id_or_passport_list
	        id_or_passport_list_active_aggregate:hr_employees_documents_aggregate(where: {
	            employee: {${org_id_key}: {_eq: $id}},
	            removed: {_eq: false}, type: {_eq: "ID/Passport"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        id_or_passport_list_no_expiry_aggregate:hr_employees_documents_aggregate(where: {
	            employee: {${org_id_key}: {_eq: $id}},
	            removed: {_eq: false}, expiry_date: {_is_null: true}, type: {_eq: "ID/Passport"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        id_or_passport_list_expired_aggregate:hr_employees_documents_aggregate(where: {
	            employee: {${org_id_key}: {_eq: $id}},
	            removed: {_eq: false}, expiry_date: {_lte: "now()"}, type: {_eq: "ID/Passport"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        id_or_passport_list_mon_expiry_aggregate:hr_employees_documents_aggregate(where: {
	            employee: {${org_id_key}: {_eq: $id}},
	            removed: {_eq: false}, expiry_date: {_gt: "now()", _lte: $mon}, type: {_eq: "ID/Passport"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        id_or_passport_list_2mon_expiry_aggregate:hr_employees_documents_aggregate(where: {
	            employee: {${org_id_key}: {_eq: $id}},
	            removed: {_eq: false}, expiry_date: {_gt: $mon, _lte: $mon2}, type: {_eq: "ID/Passport"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        id_or_passport_list_3mon_expiry_aggregate:hr_employees_documents_aggregate(where: {
	            employee: {${org_id_key}: {_eq: $id}},
	            removed: {_eq: false}, expiry_date: {_gt: $mon2, _lte: $mon3}, type: {_eq: "ID/Passport"}
	        }){
	            aggregate{
	                count
	            }
	        }
	        id_or_passport_list_4mon_expiry_aggregate:hr_employees_documents_aggregate(where: {
	            employee: {${org_id_key}: {_eq: $id}},
	            removed: {_eq: false}, expiry_date: {_gt: $mon3}, type: {_eq: "ID/Passport"}
	        }){
	            aggregate{
	                count
	            }
	        }
	
	        team_list_aggregate:default_teams_aggregate(where:{status: {_eq: "Active"}, ${org_id_key}:{_eq: $id}}){
	            aggregate{
	                count
	            }
	        }
	        department_list_aggregate:default_departments_aggregate(where:{removed: {_eq: false}, ${org_id_key}:{_eq: $id}}){
	            aggregate{
	                count
	            }
	        }
	        job_category_list_aggregate:default_job_categories_aggregate(where:{removed: {_eq: false}, ${org_id_key}:{_eq: $id}}){
	            aggregate{
	                count
	            }
	        }
	        job_position_list_aggregate:default_job_positions_aggregate(where:{removed: {_eq: false}, ${org_id_key}:{_eq: $id}}){
	            aggregate{
	                count
	            }
	        }
	      }
	    `,
			operationName,
		});
	};
};
//</editor-fold>
