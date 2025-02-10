const findByIdImpl = require('../../findByIdImpl');
const {
    ppe_size_details_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");

const args = {
    name: "PPESizes",
    tbl: "ppe_sizes",
    details_fragment: ppe_size_details_fragment,
    order_by: `{name: asc}`,
    getVariablesAndQueryConfig,
};

const path = 'ppe-sizes';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));
