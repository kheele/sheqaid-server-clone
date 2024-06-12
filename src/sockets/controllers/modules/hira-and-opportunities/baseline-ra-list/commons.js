const {employee_personal_details_fragment} = require("../../../../../graphql/Fragments");

//<editor-fold desc="hira_baseline_ra_list_details_fragment">
exports.hira_baseline_ra_list_details_fragment = `
  id
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
`;
//</editor-fold>
