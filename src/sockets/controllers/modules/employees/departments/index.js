const findByIdImpl = require("./findByIdImpl");
const findByClientIdAndNameImpl = require("./findByClientIdAndNameImpl");
const listImpl = require("./listImpl");

eventManager.on("departments/findById", findByIdImpl);

eventManager.on("departments/findByClientIdAndName", findByClientIdAndNameImpl);

eventManager.on("departments/listByLogged", listImpl);
