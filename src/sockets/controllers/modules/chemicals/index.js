require('./sds');
require('./products');
require('./hazchem');
require('./chemical-suppliers');

const findByIdDashboardImpl = require("./findByIdDashboardImpl");

eventManager.on("chemicals/dashboard", findByIdDashboardImpl);
