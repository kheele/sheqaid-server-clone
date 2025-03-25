const findByIdImpl = require('../../findByIdImpl');
const deleteImpl = require('../../deleteImpl');
const {
    ppe_requisition_details_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");
const exportExcelImpl = require("../../exportExcelImpl2");

const args = {
    name: "PPERequisitions",
    tbl: "ppe_requisitions",
    details_fragment: ppe_requisition_details_fragment,
    order_by: `{created_at: desc}`,
    getVariablesAndQueryConfig,
};

const path = 'ppe-requisitions';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/delete`, deleteImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    ...args,
    details_fragment: ppe_requisition_details_fragment,
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

                auto_reorder_trigger,
                approval_status,
                quantity,
                reason,
                ppe_type,
                employee,
            }
        } = item;

        return {
            idx: idx + 1,
            id,

            project: project && project.name,
            site: site && site.name,

            ppe_type: ppe_type && ppe_type.name,
            ppe_type_unit: ppe_type && ppe_type.unit,
            quantity,
            employee: employee && employee.full_name,
            reason,
            auto_reorder_trigger: auto_reorder_trigger ? "Automatic" : "Manual",
            created_at: Dates.formatDate(created_at),
            approval_status,

            status: removed ? "Inactive" : "Active",
        };
    },
}));
