const findByIdImpl = require('../../findByIdImpl');
const {hira_baseline_ra_list_details_fragment: details_fragment} = require("./commons");

const args = {
	name: "BaselineRiskAssessmentListItems",
	tbl: "hira_baseline_ra_list",
	details_fragment,
};

eventManager.on("hira-and-opportunities/baseline-ra-list/findById", findByIdImpl(args));
