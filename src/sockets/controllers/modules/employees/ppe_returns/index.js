const findByIdImpl = require('../../findByIdImpl');
const {
    ppe_return_details_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");
const exportExcelImpl = require("../../exportExcelImpl2");

const args = {
    name: "PPEReturns",
    tbl: "ppe_returns",
    details_fragment: ppe_return_details_fragment,
    order_by: `{return_date: desc}`,
    getVariablesAndQueryConfig,
    uploadUpdate: ({id}) => ({
        new_name: `ppes/returns/${id}/ppe-return-doc`,
        key: 'doc',
    }),
};

const path = 'ppe-returns';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    ...args,
    details_fragment: ppe_return_details_fragment,
}));

eventManager.on(`${path}/export-excel`, exportExcelImpl({
    ...args,
    currDir: __dirname,
    mapRow: (item, idx) => {
        let {
            id,
            data: {
                created_at, removed,
                company, client, project, site,

                return_date,
                ppe_condition,
                ppe_item,
                employee,
                returner_signature,
                receiver_signature,
            }
        } = item;
//033541
        return {
            idx: idx + 1,
            id,

            project: project && project.name,
            site: site && site.name,

            ppe_item: ppe_item.name,
            employee: employee.full_name,
            ppe_condition,
            returner_signature: returner_signature ? "Yes" : "No",
            receiver_signature: receiver_signature ? "Yes" : "No",
            return_date: Dates.formatDate(return_date),

            status: removed ? "Inactive" : "Active",
        };
    },
}));
