const findByIdImpl = require('./findByIdImpl');

eventManager.on("claims/clients/wcl4/findById", findByIdImpl);