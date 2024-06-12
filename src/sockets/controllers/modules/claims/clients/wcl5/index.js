const findByIdImpl = require('./findByIdImpl');

eventManager.on("claims/clients/wcl5/findById", findByIdImpl);