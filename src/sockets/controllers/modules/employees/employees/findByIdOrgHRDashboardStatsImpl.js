//<editor-fold desc="findByIdOrgHRDashboardStatsImpl">
const findByIdOrgHRDashboardStatsImpl = (
	{
		org,
		org_id_key,
	}
) => {
	const operationName = `findById${org}HRDashboardStatsQuery`;
	
	return async (socket, data) => {
		const {
			id,
			mon,
			mon2,
			mon3,
			//
			// site_id, project_id, client_id, company_id,
		} = data;
		
		// const id = site_id || project_id || client_id || company_id;
		// let tbl;
		// if(site_id) {
		// 	tbl = "default_sites";
		// } else if(project_id) {
		// 	tbl = "default_projects";
		// } else if(client_id) {
		// 	tbl = "default_clients";
		// } else {
		// 	tbl = "default_companies";
		// }
		
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
	            removed: {_eq: false}, supervisor_employee_list_aggregate: {count: {filter: {removed: {_gt: false}}, predicate: {_gt: 0}}}
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
	
	        team_list_aggregate:default_teams_aggregate(where:{${org_id_key}:{_eq: $id}}){
	            aggregate{
	                count
	            }
	        }
	        department_list_aggregate:default_departments_aggregate(where:{${org_id_key}:{_eq: $id}}){
	            aggregate{
	                count
	            }
	        }
	        job_category_list_aggregate:default_job_categories_aggregate(where:{${org_id_key}:{_eq: $id}}){
	            aggregate{
	                count
	            }
	        }
	        job_position_list_aggregate:default_job_positions_aggregate(where:{${org_id_key}:{_eq: $id}}){
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

exports.findByIdCompanyHRDashboardStats = () => {
	return findByIdOrgHRDashboardStatsImpl({
		org: "Company",
		org_id_key: "company_id",
	});
};

exports.findByIdClientHRDashboardStats = () => {
	return findByIdOrgHRDashboardStatsImpl({
		org: "Client",
		org_id_key: "client_id",
	});
};

exports.findByIdProjectHRDashboardStats = () => {
	return findByIdOrgHRDashboardStatsImpl({
		org: "Project",
		org_id_key: "project_id",
	});
};

exports.findByIdSiteHRDashboardStats = () => {
	return findByIdOrgHRDashboardStatsImpl({
		org: "Site",
		org_id_key: "site_id",
	});
};

exports.findByIdContractorHRDashboardStats = () => {
	return findByIdOrgHRDashboardStatsImpl({
		org: "Contractor",
		org_id_key: "contractor_id",
	});
};
