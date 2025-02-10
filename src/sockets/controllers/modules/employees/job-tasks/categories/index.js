const findByIdImpl = require('../../../findByIdImpl');
const {
    job_task_categories_details_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../../createImpl");
const updateImpl = require("../../../updateImpl");
const listByLoggedImpl = require("../../../listByLoggedImpl");
const exportExcelImpl = require("../../../exportExcelImpl2");

const args = {
    name: "JobTaskCategories",
    tbl: "job_task_categories",
    details_fragment: job_task_categories_details_fragment,
    order_by: `{name: asc}`,
    getVariablesAndQueryConfig,
};

const path = 'job-tasks/categories';

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

                name,
                desc,
                job_task_list_aggregate,
            }
        } = item;

        return {
            idx: idx + 1,
            id,

            project: project && project.name,
            site: site && site.name,

            name,
            desc,
            job_task_list_aggregate: job_task_list_aggregate.aggregate.count,

            status: removed ? "Inactive" : "Active",
        };
    },
}));
