const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {training_course_details_fragment, getVariablesAndQueryConfig} = require('./commons');

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
        name,
        unit_standard,
        frequency,
        provider,
        job_position_list,
        job_position_id,
        sector_list,
        sector_id,
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
        name,
        unit_standard,
        frequency,
        provider,
        job_position_list,
        job_position_id,
        sector_list,
        sector_id,
        //
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    return listGraphQL({
        query: `
			query listAllCourseByLoggedQuery {
                sheq_training_courses(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter}
                  },
                    order_by: {name: asc_nulls_last, unit_standard: asc_nulls_last, unit_standard_desc: asc_nulls_last},
                    offset: ${offset},
                    ${limit > 0 ? `limit: ${limit}` : ''}
                ) {
                    ${training_course_details_fragment}
                    ${orgs_fragment}
                }
            }
		`,
        operationName: "listAllCourseByLoggedQuery",
    });
}
//</editor-fold>