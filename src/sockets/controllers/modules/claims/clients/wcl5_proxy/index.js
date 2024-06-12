const findByIdImpl = require('./findByIdImpl');

eventManager.on("claims/clients/wcl5-proxy/findById", findByIdImpl);