const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');

eventManager.on("contractors/library/findById", findByIdImpl);

eventManager.on("contractors/library/listByLogged", listImpl);
