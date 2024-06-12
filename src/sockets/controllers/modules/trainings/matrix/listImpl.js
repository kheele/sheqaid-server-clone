const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {training_matrix_details_fragment, getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    console.log('data', data)

    let {
        offset = 0,
        limit = 50,
        //
        removed = false,
        id,
        //
        job_position_list,
        job_position_id,
        trainer_list,
        trainer_id,
        course_list,
        course_id,
        training_frequency,
        unit_standard,
        provider_requirement,
        requirement,
        status,
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
        job_position_id,
        trainer_list,
        trainer_id,
        course_list,
        course_id,
        training_frequency,
        unit_standard,
        provider_requirement,
        requirement,
        status,
        //
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    return listGraphQL({
        query: `
			query listAllTrainingMatrixByLoggedQuery {
                sheq_training_matrices(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter}
                  },
	                order_by: [
                      {course: {name: asc}},
                      {course: {unit_standard: asc}},
                      {course: {unit_standard_desc: asc}},
                      {unit_standard: asc},
                      {unit_standard_desc: asc}
                    ],
                    offset: ${offset},
                    ${limit > 0 ? `limit: ${limit}` : ''}
                ) {
                    ${training_matrix_details_fragment}
                    ${orgs_fragment}
                }
            }
		`,
        operationName: "listAllTrainingMatrixByLoggedQuery",
    });
}
//</editor-fold>