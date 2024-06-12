const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {training_course_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, id) => {
    return getGraphQLOne({
        query: `
            query findByIdCourseQuery {
                sheq_training_courses(
                  where: {id: {_eq: ${id}},},
                ) {
                    ${training_course_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
        operationName: "findByIdCourseQuery",
    });
}
//</editor-fold>