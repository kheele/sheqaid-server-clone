require('./wcl2');
require('./wcl4');
require('./wcl5');
require('./wcl5_proxy');
require('./wcl6');
require('./annexture_1');

const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
// const findByIdDashboardImpl = require('./findByIdDashboardImpl');

eventManager.on("claims/clients/findById", findByIdImpl);

eventManager.on("claims/clients/listByLogged", listImpl);

// eventManager.on("claims/clients/dashboard", findByIdDashboardImpl);
//