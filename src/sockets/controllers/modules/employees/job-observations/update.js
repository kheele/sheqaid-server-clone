const updateImpl = require("../../updateImpl");
const {job_observation_details_find_fragment} = require("./commons");
const {updateEmployeeExternal} = require("../employees-external/update");
const {createEmployeeExternal} = require("../employees-external/create");
const {createQuestion} = require("../../questionnaires/questions/create");

const args = {
    name: "JobObservationQuestionnaire",
    tbl: "default_contractor_questionnaires",
    details_fragment: job_observation_details_find_fragment,
};

//<editor-fold desc="updateJobObservation">
exports.updateJobObservation = async (socket, attrs) => {
    const update = updateImpl(args);

    const {id, question_list, employee_other} = attrs;

    if (employee_other) {
        delete attrs.employee_other;
        let {data, job_position} = employee_other;
        job_position = job_position || (data && data.job_position);
        if (job_position) {
            delete data.job_position;
            delete employee_other.job_position;
            employee_other.job_position_id = job_position.id;
        }

        let employee_other_pg;
        if (employee_other.id) {
            employee_other_pg = await updateEmployeeExternal(socket, employee_other);
        } else {
            employee_other_pg = await createEmployeeExternal(socket, employee_other);
        }
        if (employee_other_pg) {
            attrs.employee_other_id = employee_other_pg.id;
        }
    }

    if (question_list) {
        delete attrs.question_list;

        await Promise.all(question_list.map(async q => {
            if (q.id) {
                return updateQuestion(socket, q);
            } else {
                return createQuestion(socket, {questionnaire_id: id, ...q});
            }
        }));
    }

    return update(socket, attrs);
};
//</editor-fold>
