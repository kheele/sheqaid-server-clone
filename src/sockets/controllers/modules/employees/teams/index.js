const findByIdImpl = require("./findByIdImpl");
const listImpl = require("./listImpl");

eventManager.on("teams/findById", findByIdImpl);

eventManager.on("teams/listByLogged", listImpl);

