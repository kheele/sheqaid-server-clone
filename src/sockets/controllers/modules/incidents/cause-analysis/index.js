const findByIdImpl = require('./findByIdImpl');
const findByIdRootImpl = require('./findByIdRootImpl');
const findByIdImmediateImpl = require('./findByIdImmediateImpl');
const findByIdCauseImpl = require('./findByIdCauseImpl');

eventManager.on("incidents/cause-analysis/findById", findByIdImpl);
eventManager.on("incidents/cause-analysis/root/findById", findByIdRootImpl);
eventManager.on("incidents/cause-analysis/immediate/findById", findByIdImmediateImpl);
eventManager.on("incidents/cause-analysis/cause/findById", findByIdCauseImpl);
