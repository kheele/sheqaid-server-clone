const findByIdImpl = require('../../findByIdImpl');
const {
    ppe_daily_compliance_details_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");

const args = {
    name: "PPEDailyCompliance",
    tbl: "ppe_daily_compliance",
    details_fragment: ppe_daily_compliance_details_fragment,
    order_by: `{date: desc}`,
    getVariablesAndQueryConfig,
};

const path = 'ppe-compliance/daily';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    ...args,
    details_fragment: ppe_daily_compliance_details_fragment,
}));
