const findByIdImpl = require('../../findByIdImpl');
const {
    regulations_details_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");
const exportExcelImpl = require("../../exportExcelImpl2");

const args = {
    name: "Regulations",
    tbl: "regulations",
    details_fragment: regulations_details_fragment,
    order_by: `{code: asc}`,
    getVariablesAndQueryConfig,
};

const path = 'applicable-regulations';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));

eventManager.on(`${path}/export-excel`, exportExcelImpl({
    ...args,
    currDir: __dirname,
    mapRow: (item, idx) => {
        let {
            id,
            data: {
                created_at, removed,
                company, client, project, site,

                code,
                desc,
                jurisdiction,
                effective_date,
                compliance_requirement_list_aggregate,
            }
        } = item;

        return {
            idx: idx + 1,
            id,

            project: project && project.name,
            site: site && site.name,

            code,
            desc,
            jurisdiction,
            effective_date: Dates.formatDate(effective_date),
            compliance_requirement_list_aggregate: compliance_requirement_list_aggregate.aggregate.count,

            status: removed ? "Inactive" : "Active",
        };
    },
}));
