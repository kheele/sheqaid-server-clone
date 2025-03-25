require("./messages");
require("./questions");
require("./question-options");

const updateImpl = require("../updateImpl");

const args = {
    name: "Questionnaire",
    tbl: "default_contractor_questionnaires",
    details_fragment: `
        id
    `,
};

const path = 'questionnaires';

eventManager.on(`${path}/update`, updateImpl(args));
