//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		//
		module_name,
		//
		orgs_filter = [],
		//
		id,
		//
		removed = false,
		view,
		mon, mon2, mon3,
		expiry_date = 'ALL',
		date_range,
		follow_up_date_range,
		issued_date,
		date,
		isContract = false,
		isExpense = false,
		//
		type,
		//
		annexture_3,
		//
		// type,
		competency_type,
		course_id,
		//
		notes,
		//
		issued_by_id,
		witness_id,
		// type,
		//
		status,
		due_to,
		//
		responsible_person_id,
		types,
		reasons,
		//
		contract_type,
		payment_type,
		salary_interval,
		//
		desc,
		//
		department_id,
		job_position_id,
		team_id,
		supervisor_id,
		employee_id,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filterEmployee = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	let filter = [];
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if (view !== "Employee") {
			filterEmployee.push(`removed: {_eq: ${removed}}`);
		}

		if (logged_employee_id) {
			if (view === "Employee") {
				filterEmployee.push(`id: {_eq: ${logged_employee_id}}`);
			} else {
				filterEmployee.push(`employee_id: {_eq: ${logged_employee_id}}`);
			}
		}
		
		//
		if (department_id) {
			filterEmployee.push(`department_id: {_eq: ${department_id}}`);
		}
		if (job_position_id) {
			filterEmployee.push(`job_position_id: {_eq: ${job_position_id}}`);
		}
		if (team_id) {
			filterEmployee.push(`team_id: {_eq: ${team_id}}`);
		}
		if (supervisor_id) {
			filterEmployee.push(`_and:{
				_or: [
				  {supervisor_id: {_eq: ${supervisor_id}}},
				  {team:{supervisor_id: {_eq: ${supervisor_id}}}}
			   ]
			  }`);
		}
		
		if (view === "Employee") {
			if (employee_id) {
				filterEmployee.push(`id: {_eq: ${employee_id}}`);
			}
			filterEmployee = `,${filterEmployee.join(',')}`;
		} else {
			if (employee_id) {
				filterEmployee = `,employee_id: {_eq: ${employee_id}}`;
			} else {
				filterEmployee = `,employee: {${filterEmployee.join(',')}}`;
			}
		}
		
		if(!isExpense) {
			if (date_range) {
				const {start, end} = date_range;
				
				let __filter;
				if (start && end) {
					__filter = `expiry_date: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}`;
				} else if (start) {
					__filter = `expiry_date: {_gte: "${Dates.formatDateSQL(start)}"}`;
				} else if (end) {
					__filter = `expiry_date: {_lte: "${Dates.formatDateSQL(end)}"}`;
				}
				
				if (__filter) {
					if (isContract) {
						filter.push(`contract_details:{${__filter}}`);
					} else {
						filter.push(__filter);
					}
				}
			} else {
				mon = mon || Dates.formatDateSQL(new Date().addMonths(1));
				mon2 = mon2 || Dates.formatDateSQL(new Date().addMonths(2));
				mon3 = mon3 || Dates.formatDateSQL(new Date().addMonths(3));
				
				let __filter;
				if (expiry_date === null || expiry_date === 'null') {//expiry_no
					__filter = `expiry_date: {_is_null: true}`;
				} else if (expiry_date === -1) {//expired
					__filter = `expiry_date: {_lte: "now()"}`;
				} else if (expiry_date === 1) {//expired_1mon
					__filter = `expiry_date: {_gt: "now()", _lte: "${mon}"}`;
				} else if (expiry_date === 2) {//expired_2mon
					__filter = `expiry_date: {_gt: "${mon}", _lte: "${mon2}"}`;
				} else if (expiry_date === 3) {//expired_3mon
					__filter = `expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}`;
				} else if (expiry_date === 4) {//expired_4mon
					__filter = `expiry_date: {_gt: "${mon3}"}`;
				}
				
				if (__filter) {
					if (isContract) {
						filter.push(`contract_details:{${__filter}}`);
					} else {
						filter.push(__filter);
					}
				}
			}
		}

		if(status) {
			filter.push(`status: {_eq: "${status}"}`);
		}

		//
		if (date) {
			filter.push(`date: {_eq: "${date}"}`);
		}
		if (type) {
			filter.push(`type: {_eq: "${type}"}`);
		}
		
		//
		if (annexture_3) {
			filter.push(`annexture_3: {_eq: ${annexture_3}}`);
		}
		
		//
		if (issued_date) {
			filter.push(`issued_date: {_eq: "${issued_date}"}`);
		}
		if (competency_type) {
			filter.push(`competency_type: {_eq: "${competency_type}"}`);
		}
		if (course_id) {
			filter.push(`training:{course_id: {_eq: ${course_id}}}`);
		}
		
		//
		if (issued_by_id) {
			filter.push(`issued_by_id: {_eq: ${issued_by_id}}`);
		}
		if (witness_id) {
			filter.push(`witness_list: {witness_id: {_eq: ${witness_id}}}`);//TODO: add other_person_id
		}
		
		if (due_to) {
			filter.push(`due_to: {_eq: "${due_to}"}`);
		}
		
		//
		if (responsible_person_id) {
			filter.push(`responsible_person_id: {_eq: ${responsible_person_id}}`);
		}
		if (types) {
			filter.push(`types: {_contained_in: [${types.map(v => `"${v}"`).join(',')}]}`);
		}
		if (reasons) {
			filter.push(`reasons: {_contained_in: [${reasons.map(v => `"${v}"`).join(',')}]}`);
		}
		
		//
		if (contract_type) {
			filter.push(`contract_details:{contract_type: {_eq: "${contract_type}"}}`);
		}
		if (payment_type) {
			filter.push(`salary_info: {payment_type: {_eq: "${payment_type}"}}`);
		}
		if (salary_interval) {
			filter.push(`salary_info:{salary_interval: {_eq: "${salary_interval}"}}`);
		}
		
		//
		if (notes) {
			filter.push(`notes: {_ilike: "%${notes}%"}`);
		}
		
		//
		if (desc) {
			filter.push(`desc: {_ilike: "%${desc}%"}`);
		}
		
		if (!filter.isEmpty()) {
			filter = `,${filter.join(',')}`;
		}
	}
	//</editor-fold>
	
	return {filter, filterEmployee};
};
//</editor-fold>
