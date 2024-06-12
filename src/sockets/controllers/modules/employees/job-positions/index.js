const findByIdImpl = require("./findByIdImpl");
const findByClientIdAndNameImpl = require("./findByClientIdAndNameImpl");
const listImpl = require("./listImpl");

eventManager.on("job-positions/findById", findByIdImpl);

eventManager.on("job-positions/findByClientIdAndName", findByClientIdAndNameImpl);

eventManager.on("job-positions/listByLogged", listImpl);
