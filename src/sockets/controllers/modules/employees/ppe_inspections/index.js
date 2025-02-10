const findByIdImpl = require('../../findByIdImpl');

const {
    ppe_inspection_details_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");

const args = {
    name: "PPEInspections",
    tbl: "ppe_inspections",
    details_fragment: ppe_inspection_details_fragment,
    order_by: `{inspection_date: desc}`,
    getVariablesAndQueryConfig,
    uploadUpdate: ({id}) => ({
        new_name: `ppes/inspections/${id}/ppe-inspection-doc`,
        key: 'doc',
    }),
};

const path = 'ppe-inspections';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    ...args,
    details_fragment: ppe_inspection_details_fragment,
}));
