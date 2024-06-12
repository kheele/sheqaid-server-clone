require('./templates');

const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("job-observations/findById", findByIdImpl);

eventManager.on("job-observations/listByLogged", listImpl);
