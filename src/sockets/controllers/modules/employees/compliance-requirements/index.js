const findByIdImpl = require('../../findByIdImpl');
const {
    compliance_requirements_details_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");
const exportExcelImpl = require("../../exportExcelImpl2");

const args = {
    name: "ComplianceRequirements",
    tbl: "compliance_requirements",
    details_fragment: compliance_requirements_details_fragment,
    order_by: `{name: asc}`,
    getVariablesAndQueryConfig,
};

const path = 'compliance-requirements';

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
                contact_person,
                email,
                phone,
                address,
            }
        } = item;

        return {
            idx: idx + 1,
            id,

            project: project && project.name,
            site: site && site.name,

            name,
            contact_person,
            email,
            phone,
            address,

            status: removed ? "Inactive" : "Active",
        };
    },
}));
