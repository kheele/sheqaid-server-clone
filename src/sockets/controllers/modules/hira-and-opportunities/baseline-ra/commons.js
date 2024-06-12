const {employee_personal_details_fragment} = require("../../../../../graphql/Fragments");

//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		expiry_date = 'ALL',
		expiry_range,
		mon, mon2, mon3,
		activity,
		risk_tolerance,
		//
		logged_employee_id,
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
		if (logged_employee_id) {
			filter.push(`_or: [
				{list:{responsible_person_id: {_eq: ${logged_employee_id}}}},
				{list:{control_measure_list_additional:{responsible_person_id: {_eq: ${logged_employee_id}}}}}
			]`);
		}
		
		//
		if (expiry_date === null) {//expiry_no
			filter.push(`expiry_date: {_is_null: true}`);
		} else if (expiry_date === -1) {//expired
			filter.push(`expiry_date: {_lte: "now()"}`);
		} else if (expiry_date === 1) {//expired_1mon
			filter.push(`expiry_date: {_gt: "now()", _lte: "${mon}"}`);
		} else if (expiry_date === 2) {//expired_2mon
			filter.push(`expiry_date: {_gt: "${mon}", _lte: "${mon2}"}`);
		} else if (expiry_date === 3) {//expired_3mon
			filter.push(`expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}`);
		} else if (expiry_date === 4) {//expired_4mon
			filter.push(`expiry_date: {_gt: "${mon3}"}`);
		}
		
		if (activity) {
			filter.push(`activity: {_ilike: "%${activity}%"}`);
		}
		if (risk_tolerance) {
			filter.push(`risk_tolerance: {_eq: ${risk_tolerance}}`);
		}
		
		if (expiry_range) {
			const {start, end} = expiry_range;
			if(start && end) {
				filter.push(`expiry_date: {_gte: "${start}", _lte: "${end}"}`);
			} else if(start) {
				filter.push(`expiry_date: {_gte: "${start}"}`);
			} else if(end) {
				filter.push(`expiry_date: {_lte: "${end}"}`);
			}
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="hira_baseline_ra_details_fragment">
exports.hira_baseline_ra_details_fragment = `
  id
  created_at
  expiry_date
	activity
	risk_tolerance
	list{
		baseline_ra_id
		task_step
		hazard
		risk
		risk_type
		consequence_1
		consequence_2
		consequence_3
		frequency_1
		frequency_2
		frequency_3
		likelihood_1
		likelihood_2
		likelihood_3
		risk_rank_1
		risk_rank_2
		risk_rank_3
		risk_rating_1
		risk_rating_2
		risk_rating_3
		due_date
		target_date
		responsible_person{
			${employee_personal_details_fragment}
		}
		control_measure_list
		control_measure_list_additional{
			id
			baseline_ra_list_id
			text
			cost
			date_completed
			responsible_person{
				${employee_personal_details_fragment}
			}
		}
	}
`;
//</editor-fold>
