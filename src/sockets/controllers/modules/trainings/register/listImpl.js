const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {training_register_details_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	// console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		removed = false,
		id,
		id_list,
		//
		job_position_list,
		trainer_list,
		course_list,
		unit_standard,
		date,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		client_filter,
		orgs_filter = [],
	} = data;
	
	const {filter} = getVariablesAndQueryConfig({
		orgs_filter,
		//
		id,
		//
		job_position_list,
		trainer_list,
		course_list,
		unit_standard,
		date,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	if (id) {
		return listGraphQL({
			query: `
        query listAllTrainingRegisterByLoggedQuery {
          sheq_training_registers(
            where: {
              ${filter}
            }
          ) {
              ${training_register_details_fragment}
              ${orgs_fragment}
          }
        }
			`,
			operationName: `listAllTrainingRegisterByLoggedQuery`,
		});
	} else if (id_list) {
		return listGraphQL({
			query: `
					query listByIdsTrainingRegisterByLoggedQuery {
		        sheq_training_registers(
		          where: {
		            id: {_in: [${id_list.join(',')}]}
		          },
	            order_by: {training: {course: {name: asc}}, date: asc},
		        ) {
		          ${training_register_details_fragment}
              ${orgs_fragment}
		        }
		      }
				`,
			operationName: "listByIdsTrainingRegisterByLoggedQuery",
		});
	} else {
		return listGraphQL({
			query: `
				query listAllTrainingRegisterByLoggedQuery {
                sheq_training_registers(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter}
                  },
                    order_by: {training: {course: {name: asc}}, date: asc},
                    offset: ${offset},
                    ${limit > 0 ? `limit: ${limit}` : ''}
                ) {
                    ${training_register_details_fragment}
                    ${orgs_fragment}
                }
      }
		`,
			operationName: "listAllTrainingRegisterByLoggedQuery",
		});
	}
}
//</editor-fold>
