const createImpl = require("../../createImpl");
const {details_fragment} = require("./commons");

const args = {
    name: "QuestionOption",
    tbl: "default_contractor_questionnaires_ques_options",
    details_fragment,
    orgs_fragment: null,
    uploadUpdate: ({id, data: {ques_id}}) => ({
        new_names: [
            `questionnaires/questions/${ques_id}/${id}/optionImage`,
            `questionnaires/questions/${ques_id}/${id}/answer`,
        ],
        key: ['optionImage', 'answer'],
    }),
};

//<editor-fold desc="createQuestionOption">
exports.createQuestionOption = async (socket, input) => {
    const create = createImpl(args);

    const {
        ques_id,
        answer,
        optionImage,
        optionText,
        optionType,
    } = input;

    return create(socket, input);
};
//</editor-fold>
