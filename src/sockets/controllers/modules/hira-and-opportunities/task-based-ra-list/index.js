const findByIdImpl = require('../../findByIdImpl');
const {hira_taskbased_ra_list_details_fragment: details_fragment} = require("./commons");
const updateImpl = require("../../updateImpl");
const createImpl = require("../../createImpl");

const args = {
	name: "TaskBaseRiskAssessmentListItems",
	tbl: "hira_taskbased_ra_list",
	details_fragment,
};

const path = 'hira-and-opportunities/task-based-ra-list';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));
