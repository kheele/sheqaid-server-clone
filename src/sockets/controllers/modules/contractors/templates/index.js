const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("contractors/questionnaires/findByIdTemplate", findByIdImpl);

eventManager.on("contractors/questionnaires/listTemplatesByLogged", listImpl);
