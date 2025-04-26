const createImpl = require("../../createImpl");
const {organogram_details_fragment} = require("./commons");
const {getVariablesAndQueryConfig} = require("./commons");

const args = {
    name: "Organogram",
    tbl: "sheq_organograms",
    details_fragment: organogram_details_fragment,
    uploadUpdate: ({id}) => ({
        new_name: `organograms/${id}/organogram-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
        key: 'doc',
    }),
    getVariablesAndQueryConfig,
};

//<editor-fold desc="createOrganogram">
exports.createOrganogram = async (socket, input) => {
    let {
        client, project, site, target, type, doc, employee_list,
    } = input;

    if (doc) {
        delete input.doc;
    }

    const data = {
        //0
        client_id: client && client.id,
        project_id: project && project.id,
        site_id: site && site.id,
        target,
        type,
        employee_list: {
            data: (employee_list || []).map(({employee_list, team, employee, employee_reported_to}) => {
                return {
                    employee_reported_to_id: employee_reported_to && employee_reported_to.id,
                    employee_id: employee && employee.id,
                    team_id: team && team.id,
                    employee_list: {
                        data: (employee_list || []).map(({id: employee_id}) => ({employee_id}))
                    }
                };
            })
        },
        doc,
    };

    const create = createImpl(args);
    return create(socket, data);
};
//</editor-fold>
