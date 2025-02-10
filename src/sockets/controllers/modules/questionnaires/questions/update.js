const updateImpl = require("../../updateImpl");
const {inspection_question_list_fragment} = require("./commons");
const {createQuestion} = require("./create");

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

//<editor-fold desc="updateQuestion">
exports.updateQuestion = updateQuestion = async (socket, attrs) => {
    const update = updateImpl(args);

    delete attrs.data;

    const {
        id,
        answer_asset,
        answer_employee,
        //
        notified_list,
        // message_list,Excluded
        question_list,
        options,
    } = attrs;

    const _attrs = {...attrs};
    delete _attrs.open;
    delete _attrs.notified_list;
    delete _attrs.message_list;
    delete _attrs.question_list;
    delete _attrs.options;
    delete _attrs.questionnaire;
    delete _attrs.linkDoc;
    delete _attrs.answer_asset;
    delete _attrs.answer_employee;

    if(answer_asset) {
        _attrs.answer_asset_id = answer_asset.id;
    }

    if(answer_employee) {
        _attrs.answer_employee_id = answer_employee.id;
    }

    if(notified_list) {
        await Promise.all(notified_list.map(async v => {
            if(v.id) {
                return updateQuestionNotifiedList(v);
            } else {
                return insertQuestionNotifiedList({question_id: id, ...v});
            }
        }));
    }

    if(question_list) {
        await Promise.all(question_list.map(async v => {
            if(v.id) {
                return updateQuestion(socket, v);
            } else {
                return createQuestion(socket, {ques_id: id, ...v});
            }
        }));
    }

    if(options) {
        await Promise.all(options.map(async option => {
            if(option.id) {
                return updateQuestionOption(option);
            } else {
                return insertQuestionOption({ques_id: id, ...option});
            }
        }));
    }

    return update(socket, _attrs);
};
//</editor-fold>
