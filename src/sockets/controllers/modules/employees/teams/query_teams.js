const findByIdImpl = require("../../findByIdImpl");
const {teams_details_one_fragment} = require("./commons");

const args = {
    name: "Teams",
    tbl: "default_teams",
    details_fragment: teams_details_one_fragment,
};

//<editor-fold desc="findByIdTeam">
exports.findByIdTeam = findByIdImpl(args);
//</editor-fold>
