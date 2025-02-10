const findByIdImpl = require('../../findByIdImpl');
const {
    ppe_disposal_details_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");
const exportExcelImpl = require("../../exportExcelImpl2");

const args = {
    name: "PPEDisposals",
    tbl: "ppe_disposal",
    details_fragment: ppe_disposal_details_fragment,
    order_by: `{disposal_date: desc}`,
    getVariablesAndQueryConfig,
};

const path = 'ppe-disposals';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    ...args,
    details_fragment: ppe_disposal_details_fragment,
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

                disposal_date,
                method,
                reason,
                ppe_item,
                disposed_by,
            }
        } = item;

        return {
            idx: idx + 1,
            id,

            project: project && project.name,
            site: site && site.name,

            ppe_item: ppe_item.name,
            disposed_by: disposed_by.full_name,
            method,
            reason,
            disposal_date: Dates.formatDate(disposal_date),

            status: removed ? "Inactive" : "Active",
        };
    },
}));
