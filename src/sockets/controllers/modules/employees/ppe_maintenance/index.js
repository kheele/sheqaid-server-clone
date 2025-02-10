const findByIdImpl = require('../../findByIdImpl');
const {
    ppe_maintenance_details_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");

const args = {
    name: "PPEMaintenances",
    tbl: "ppe_maintenance",
    details_fragment: ppe_maintenance_details_fragment,
    order_by: `{maintenance_date: desc}`,
    getVariablesAndQueryConfig,
};

const path = 'ppe-maintenances';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));
