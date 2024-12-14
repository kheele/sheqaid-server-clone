const updateImpl = require("../../updateImpl");
const createImpl = require("../../createImpl");
const {teams_details_one_fragment} = require("./commons");
const {findByIdTeam} = require("./query_teams");
const {updateEmployee} = require("../employees/update");

const args = {
    name: "Teams",
    tbl: "default_teams",
    details_fragment: teams_details_one_fragment,
};

//<editor-fold desc="updateTeam">
exports.updateTeam = async (socket, attrs) => {
    const update = updateImpl(args);

    const {
        id,
        name,
        status,
        removed,
        client_id,
        project_id,
        site_id,

        supervisor_id,
        employee_list,
        ppe_type_list,
    } = attrs;

    const existingItem = await findByIdTeam(socket, id);
    if (!existingItem) {
        return "NOT_FOUND";
    }

    if (employee_list) {
        await Promise.all(employee_list.map(async employee_id => {
            return updateEmployee(socket, {id: employee_id, team_id: id});
        }));
    }
    if (ppe_type_list) {
        const proxyTeamPPEArgs = {
            name: "ProxyTeamPPE",
            tbl: "proxy_team__ppe_type",
            details_fragment: `
                id
            `,
            orgs_fragment: null,
        };
        const updateProxyTeamPPE = updateImpl(proxyTeamPPEArgs);
        const createProxyTeamPPE = createImpl(proxyTeamPPEArgs);
        await Promise.all(ppe_type_list.map(async item => {
            if (item.id) {
                return updateProxyTeamPPE(socket, item);
            } else {
                return createProxyTeamPPE(socket, item);
            }
        }));
    }

    if ('removed' in attrs) {
        attrs.status = removed ? 'Inactive' : 'Active';
        delete attrs.removed;
    }

    return update(socket, attrs);
};
//</editor-fold>
