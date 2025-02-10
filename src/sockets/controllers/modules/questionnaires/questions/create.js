const createImpl = require("../../createImpl");
const {inspection_question_list_fragment} = require("./commons");

const args = {
    name: "Question",
    tbl: "default_contractor_questionnaires_ques",
    details_fragment: inspection_question_list_fragment(),
    orgs_fragment: null,
    uploadUpdate: ({id, data: {questionnaire_id}}) => ({
        new_names: [
            `questionnaires/questions/${questionnaire_id}/${id}/questionImage`,
            `questionnaires/questions/${questionnaire_id}/${id}/responseAttachment`,
            `questionnaires/questions/${questionnaire_id}/${id}/answer`,
        ],
        key: ['questionImage', 'responseAttachment', 'answer'],
    }),
};

//<editor-fold desc="createQuestion">
exports.createQuestion = async (socket, input) => {
    const create = createImpl(args);

    const {
        client_id,
        project_id,
        site_id,
        //
        asset_type,
        asset_id,
        //
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

    // if(question_list) {
    // 	await Promise.all(question_list.map(async v => {
    // 		if(v.id) {
    // 			return updateQuestion(v);
    // 		} else {
    // 			return insertQuestion({ques_id: id, ...v});
    // 		}
    // 	}));
    // }

    return create(socket, input);
};
//</editor-fold>
