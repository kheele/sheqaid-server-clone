const createImpl = require("../../createImpl");
const {teams_details_one_fragment} = require("./commons");
const {updateEmployee} = require("../employees/update");
const {findByIdTeam} = require("./query_teams");

const args = {
    name: "Teams",
    tbl: "default_teams",
    details_fragment: teams_details_one_fragment,
};

//<editor-fold desc="createTeam">
exports.createTeam = async (socket, input) => {
    const create = createImpl(args);

    const {
        employee_list
    } = input;

    if (employee_list) {
        delete input.employee_list;
    }

    const savedItem = await create(socket, input);
    if (savedItem) {
        if (employee_list) {
            await Promise.all(employee_list.map(async id => {
                return updateEmployee(socket, {id, team_id: savedItem.id});
            }));
        }

        return findByIdTeam(socket, savedItem.id);
    }
};
//</editor-fold>
