const createImpl = require("../../createImpl");
const {job_observation_details_find_fragment} = require("./commons");

const args = {
    name: "JobObservationQuestionnaire",
    tbl: "default_contractor_questionnaires",
    details_fragment: job_observation_details_find_fragment,
};

//<editor-fold desc="createJobObservation">
exports.createJobObservation = async (socket, input) => {
    const create = createImpl(args);

    const {
        client_id,
        project_id,
        site_id,
        //
        asset_type,
        asset_id,
        //
        employee_other,
        responsible_person_id,
        responsible_department_id,
        interval,
        start_date,
        //
        template_id,
        //
        name,
        desc,
        question_list,
    } = input;

    if(employee_other && employee_other.data) {
        if(employee_other.data.job_position) {
            employee_other.data.job_position_id = employee_other.data.job_position.id;
            delete employee_other.data.job_position;
        }
        socket.injectCreate({input: employee_other.data});
    }


    return create(socket, {is_template: false, group: "Job Observations", answered_by: "Sender", ...input});
};
//</editor-fold>
