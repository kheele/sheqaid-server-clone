const findByIdImpl = require('./findByIdImpl');

eventManager.on("claims/clients/wcl2/findById", findByIdImpl);