const findByIdImpl = require('../../findByIdImpl');
const {
    ppe_requisition_details_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");

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

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    ...args,
    details_fragment: ppe_requisition_details_fragment,
}));
