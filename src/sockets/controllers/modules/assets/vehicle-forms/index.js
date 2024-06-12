// const findByIdImpl = require('./findByIdImpl');
const listALVByLogged = require('./listALVByLogged');
const listRLVByLogged = require('./listRLVByLogged');
const listNCOByLogged = require('./listNCOByLogged');
const findByIdDashboardImpl = require('./findByIdDashboardImpl');

// eventManager.on("vehicle-forms/findById", findByIdImpl);

eventManager.on("vehicle-forms/listALVByLogged", listALVByLogged);
eventManager.on("vehicle-forms/listRLVByLogged", listRLVByLogged);
eventManager.on("vehicle-forms/listNCOByLogged", listNCOByLogged);

eventManager.on("vehicle-forms/dashboard", findByIdDashboardImpl);
