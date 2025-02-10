const findByIdImpl = require("../../findByIdImpl");
const {inspection_question_list_fragment} = require("./commons");
const {createQuestion} = require("./create");
const {updateQuestion} = require("./update");

const args = {
    name: "Question",
    tbl: "default_contractor_questionnaires_ques",
    details_fragment: inspection_question_list_fragment(),
    orgs_fragment: null,
};

const path = 'questionnaires/questions';

eventManager.on(`${path}/create`, createQuestion);

eventManager.on(`${path}/update`, updateQuestion);

eventManager.on(`${path}/findById`, findByIdImpl(args));
