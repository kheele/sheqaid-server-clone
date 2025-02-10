const findByIdImpl = require("../../findByIdImpl");
const {details_fragment} = require("./commons");
const {createQuestionOption} = require("./create");
const {updateQuestionOption} = require("./update");

const args = {
    name: "QuestionOption",
    tbl: "default_contractor_questionnaires_ques_options",
    details_fragment,
    orgs_fragment: null,
};

const path = 'questionnaires/question-options';

eventManager.on(`${path}/create`, createQuestionOption);

eventManager.on(`${path}/update`, updateQuestionOption);
