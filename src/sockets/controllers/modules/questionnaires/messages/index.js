const findByIdImpl = require("../../findByIdImpl");
const {details_fragment} = require("./commons");
const {createQuestionMessage} = require("./create");
const {updateQuestionMessage} = require("./update");

const args = {
    name: "QuestionMessage",
    tbl: "default_contractor_questionnaires_messages",
    details_fragment,
    orgs_fragment: null,
};

const path = 'questionnaires/messages';

eventManager.on(`${path}/create`, createQuestionMessage);

// eventManager.on(`${path}/update`, updateQuestionMessage);
