const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("safety-files/findByIdTemplate", findByIdImpl);

eventManager.on("safety-files/listTemplatesByLogged", listImpl);
