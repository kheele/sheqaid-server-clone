const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("job-observations/findByIdTemplate", findByIdImpl);

eventManager.on("job-observations/listTemplatesByLogged", listImpl);
