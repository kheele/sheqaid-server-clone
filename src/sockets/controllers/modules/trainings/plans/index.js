const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("trainings/plans/findById", findByIdImpl);

eventManager.on("trainings/plans/listByLogged", listImpl);
//