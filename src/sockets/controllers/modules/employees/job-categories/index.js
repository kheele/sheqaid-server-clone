const findByIdImpl = require("./findByIdImpl");
const listImpl = require("./listImpl");

eventManager.on("job-categories/findById", findByIdImpl);

eventManager.on("job-categories/listByLogged", listImpl);

