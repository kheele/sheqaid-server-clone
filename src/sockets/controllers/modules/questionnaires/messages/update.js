const updateImpl = require("../../updateImpl");
const {details_fragment} = require("./commons");

const args = {
    name: "QuestionMessage",
    tbl: "default_contractor_questionnaires_messages",
    details_fragment,
    orgs_fragment: null,
};

//<editor-fold desc="updateQuestionMessage">
exports.updateQuestionMessage = async (socket, attrs) => {
    const update = updateImpl(args);

    delete attrs.data;

    const {
        date,
        msg,
        read,
        sender_id,
    } = attrs;

    const _attrs = {...attrs};
    // delete _attrs.linkDoc;

    // if(answer_asset) {
    // 	_attrs.answer_asset_id = answer_asset.id;
    // }

    return update(socket, _attrs);
};
//</editor-fold>
