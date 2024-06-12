require('./sds');
require('./products');
require('./hazchem');

const findByIdDashboardImpl = require("./findByIdDashboardImpl");

eventManager.on("chemicals/dashboard", findByIdDashboardImpl);
