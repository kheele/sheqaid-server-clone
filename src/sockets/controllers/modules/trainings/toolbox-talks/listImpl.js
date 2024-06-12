const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {
	training_toolbox_talks_details_fragment,
	sheq_training_toolbox_talk_list_details_fragment,
	getVariablesAndQueryConfig
} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	// console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		removed = false,
		id,
		//
		view = 'Toolbox Talk / Safety Meeting',
		//
		training_frequency,
		date,
		subject_list,
		subject_id,
		subject_category_list,
		subject_category,
		trainer_list,
		trainer_id,
		job_position_list,
		job_position_id,
		employee_list,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		client_filter,
		orgs_filter = [],
	} = data;
	
	const {filter, filterToolboxTalk} = getVariablesAndQueryConfig({
		orgs_filter,
		//
		id,
		//
		view,
		//
		subject_list,
		subject_id,
		subject_category_list,
		subject_category,
		trainer_list,
		trainer_id,
		job_position_list,
		job_position_id,
		employee_list,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	if (view === 'Toolbox Talk / Safety Meeting') {
		//<editor-fold desc="ByGroup">
		return listGraphQL({
			query: `
			query listAllToolboxTalksByLoggedQuery {
                sheq_training_toolbox_talks(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter}
                  },
	                order_by: {subject_category: asc},
                    offset: ${offset},
                    ${limit > 0 ? `limit: ${limit}` : ''}
                ) {
                    ${training_toolbox_talks_details_fragment}
                    ${orgs_fragment}
                }
            }
		`,
			operationName: "listAllToolboxTalksByLoggedQuery",
		});
		//</editor-fold>
	} else {
		//<editor-fold desc="ByEach">
		return listGraphQL({
			query: `
                query listAllByEachToolboxTalkListByLoggedQuery {
                  sheq_training_toolbox_talk_list(
                      where: {
                         removed: {_eq: ${removed}},
                         ${filter}
                         ${filterToolboxTalk}
                      },
                      order_by: {toolbox_talk: {subject_category: asc}},
                      offset: ${offset},
                      ${limit > 0 ? `limit: ${limit}` : ''}
                  ) {
                      ${sheq_training_toolbox_talk_list_details_fragment}
                      ${orgs_fragment}
                  }
                }
			`,
			operationName: `listAllByEachToolboxTalkListByLoggedQuery`,
		});
		//</editor-fold>
	}
}
//</editor-fold>
