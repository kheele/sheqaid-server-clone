const findByIdImpl = require('../../findByIdImpl');
const {
    ppe_fit_test_details_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");
const exportExcelImpl = require("../../exportExcelImpl2");

const args = {
    name: "PPEFitTests",
    tbl: "ppe_fit_tests",
    details_fragment: ppe_fit_test_details_fragment,
    order_by: `{test_date: desc}`,
    getVariablesAndQueryConfig,
};

const path = 'ppe-fit-tests';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    ...args,
    details_fragment: ppe_fit_test_details_fragment,
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

                test_date,
                next_due_date,
                result,
                notes,
                ppe_type,
                employee,
            }
        } = item;

        return {
            idx: idx + 1,
            id,

            project: project && project.name,
            site: site && site.name,

            ppe_type: ppe_type.name,
            employee: employee.full_name,
            result,
            notes,
            test_date: Dates.formatDate(test_date),
            next_due_date: Dates.formatDate(next_due_date),

            status: removed ? "Inactive" : "Active",
        };
    },
}));
