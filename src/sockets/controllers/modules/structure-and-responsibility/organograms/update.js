const updateImpl = require("../../updateImpl");
const createImpl = require("../../createImpl");
const {organogram_details_fragment, getVariablesAndQueryConfig} = require("./commons");

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

//<editor-fold desc="updateOrganogram">
exports.updateOrganogram = async (socket, attrs) => {
    const {
        id, target, client, project, site, type, doc, employee_list
    } = attrs;

    if(employee_list) {
        delete attrs.employee_list;

        await Promise.all(employee_list.map(async v => {
            const {employee_list} = v;
            if(v.id) {
                if(employee_list) {
                    delete v.employee_list;
                    await Promise.all(employee_list.map(async v => {
                        if(v.id) {
                            return updateProxyEmployeeOrganogramEmployee(v);
                        } else {
                            return insertProxyEmployeeOrganogramEmployee({proxy_employee__organogram_id: v.id, ...v});
                        }
                    }));
                }
                return updateProxyEmployeeOrganogram(v);
            } else {
                if(employee_list) {
                    v.employee_list = {
                        data: employee_list,
                    };
                }
                return insertProxyEmployeeOrganogram({organogram_id: id, ...v});
            }
        }));
    }

    const update = updateImpl(args);
    return update(socket, {
        ...attrs, id,
    });
};
//</editor-fold>

const insertProxyEmployeeOrganogram = (socket, data) => {
    const create = createImpl({
        name: "ProxyEmployeeOrganogram",
        tbl: "proxy_employee__organogram",
        details_fragment: `
            id
        `,
    });
    return create(socket, data);
};

const updateProxyEmployeeOrganogram = (socket, attrs) => {
    const update = updateImpl({
        name: "ProxyEmployeeOrganogram",
        tbl: "proxy_employee__organogram",
        details_fragment: `
            id
        `,
    });

    const {id} = attrs;
    return update(socket, {
        ...attrs, id,
    });
};

const insertProxyEmployeeOrganogramEmployee = (socket, data) => {
    const create = createImpl({
        name: "ProxyEmployeeOrganogramEmployee",
        tbl: "proxy_employee__organogram__employees",
        details_fragment: `
            id
        `,
    });
    return create(socket, data);
};

const updateProxyEmployeeOrganogramEmployee = (socket, attrs) => {
    const update = updateImpl({
        name: "ProxyEmployeeOrganogramEmployee",
        tbl: "proxy_employee__organogram__employees",
        details_fragment: `
            id
        `,
    });

    const {id} = attrs;
    return update(socket, {
        ...attrs, id,
    });
};