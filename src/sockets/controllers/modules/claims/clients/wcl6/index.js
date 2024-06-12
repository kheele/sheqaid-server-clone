const findByIdImpl = require('./findByIdImpl');

eventManager.on("claims/clients/wcl6/findById", findByIdImpl);