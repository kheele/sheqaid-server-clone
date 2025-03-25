require('./employer-details');
require('./wcl2');
require('./wcl4');
require('./wcl5');
require('./wcl5_proxy');
require('./wcl6');
require('./annexture_1');

const findByIdImpl = require('../../findByIdImpl');
const listByLoggedImpl = require('../../listByLoggedImpl');
const {coida_claims_fragment: details_fragment} = require("./commons");
const {createClientClaim} = require("./create");
const {updateClientClaim} = require("./update");
const {getVariablesAndQueryConfig} = require("./commons");

const args = {
    name: "ClaimsClient",
    tbl: "coida_claims",
    order_by: "order_by: {accident_date: desc}",
    details_fragment,
    getVariablesAndQueryConfig,
};

const path = 'claims/clients';

eventManager.on(`${path}/create`, createClientClaim);

eventManager.on(`${path}/update`, updateClientClaim);

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));

// eventManager.on("claims/clients/dashboard", findByIdDashboardImpl);
//
