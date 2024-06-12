const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("inspections/findByIdTemplate", findByIdImpl);

eventManager.on("inspections/listTemplatesByLogged", listImpl);
