const findByIdImpl = require('../../findByIdImpl');
const {hira_taskbased_ra_list_details_fragment: details_fragment} = require("./commons");

const args = {
	name: "TaskBaseRiskAssessmentListItems",
	tbl: "hira_taskbased_ra_list",
	details_fragment,
};

eventManager.on("hira-and-opportunities/task-based-ra-list/findById", findByIdImpl(args));
