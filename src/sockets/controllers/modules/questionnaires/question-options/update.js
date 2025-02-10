const updateImpl = require("../../updateImpl");
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

//<editor-fold desc="updateQuestionOption">
exports.updateQuestionOption = async (socket, attrs) => {
    const update = updateImpl(args);

    delete attrs.data;

    const {
        id,
        ques_id,
        answer,
        optionImage,
        optionText,
        optionType,
    } = attrs;

    const _attrs = {...attrs};
    // delete _attrs.linkDoc;

    // if(answer_asset) {
    // 	_attrs.answer_asset_id = answer_asset.id;
    // }

    return update(socket, _attrs);
};
//</editor-fold>
