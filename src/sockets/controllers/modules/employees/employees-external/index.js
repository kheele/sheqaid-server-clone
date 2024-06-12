const findByIdImpl = require("./findByIdImpl");

eventManager.on("employees-external/findById", findByIdImpl);
