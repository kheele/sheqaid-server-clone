const {employee_personal_details_fragment} = require("../../../../../graphql/Fragments");

//<editor-fold desc="hira_taskbased_ra_list_details_fragment">
exports.hira_taskbased_ra_list_details_fragment = `
  id
	taskbased_ra_id
	task_step
	hazard
	risk
	risk_type
	consequence_1
	consequence_2
	likelihood_1
	likelihood_2
	due_date
	target_date
	risk_rank_1
	risk_rank_2
	risk_rating_1
	risk_rating_2
	control_measure_list
	responsible_person{
		${employee_personal_details_fragment}
	}
`;
//</editor-fold>
