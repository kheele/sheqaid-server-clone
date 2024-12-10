//<editor-fold desc="getVariablesAndQueryConfig">
const { user_personal_details_fragment, employee_basic_personal_details_fragment} = require("../../../../graphql/Fragments");
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		date_from,
		date_to,
		//
		action,
		tbl,
		//
		user_id,
		contractor_user_id,//
		supervisor_id,//
		employee_id,
		// logged_user_access_type,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if (action) {
			filter.push(`action: {_eq: "${action.toLowerCase()}"}`);
		}
		if (tbl) {
			filter.push(`tbl: {_eq: "${tbl}"}`);
		}
		// if (logged_user_access_type) {
		// 	filter.push(`logged_user_access_type: {_eq: "${logged_user_access_type}"}`);
		// }
		if (user_id) {
			filter.push(`logged_user_auth: {id:{_eq: ${user_id}}}`);
		}
		if (contractor_user_id) {
			filter.push(`logged_contractor_user_auth: {id:{_eq: ${contractor_user_id}}}`);
		}
		if (supervisor_id) {
			// filter.push(`contractor_user_id: {_eq: ${supervisor_id}}`);
		}
		if (employee_id) {
			filter.push(`logged_employee_auth: {id:{_eq: ${employee_id}}}`);
		}

		if (date_from || date_to) {
			if(date_from && date_to) {
				filter.push(`created_at: {_gte: "${Dates.formatDateSQL(date_from)}", _lte: "${Dates.formatDateSQL(date_to)}"}`);
			} else if(date_from) {
				filter.push(`created_at: {_gte: "${Dates.formatDateSQL(date_from)}"}`);
			} else if(date_to) {
				filter.push(`created_at: {_lte: "${Dates.formatDateSQL(date_to)}"}`);
			}
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="audit_logs_details_fragment">
const audit_logs_details_fragment = `
    id
    created_at
	tbl
	user{
		${user_personal_details_fragment}
	}
	action
	record
	record_name
	logged_user_access_type
	#
	contractor{
		id
        name
        username
	}
	contractor_site{
		id
		name
	}
	contractor_user{
		${user_personal_details_fragment}
	}
	contractor_client{
		id
		name
	}
	logged_contractor_user_auth{
		${user_personal_details_fragment}
	}
	logged_employee_auth{
		${employee_basic_personal_details_fragment}
	}
	logged_user_auth{
		${user_personal_details_fragment}
	}
`;
exports.audit_logs_details_fragment = audit_logs_details_fragment;
//</editor-fold>
