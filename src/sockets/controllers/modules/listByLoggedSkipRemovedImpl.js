const listByLoggedImpl = require('./listByLoggedImpl');

//<editor-fold desc="listImpl">
module.exports = (config) => {
    return listByLoggedImpl({...config, skipRemoved: true});
}
//</editor-fold>
