const findByIdDashboardImpl = require("./findByIdDashboardImpl");

eventManager.on("dashboard", findByIdDashboardImpl);
