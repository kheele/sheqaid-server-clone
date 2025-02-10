const findByIdImpl = require('../../modules/findByIdImpl');
const {details_fragment_modules: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const {listAllModules} = require("./query_modules");

const args = {
	name: "Modules",
	tbl: "default_manager_plugin",
	details_fragment,
	skipRemoved: true,
	orgs_fragment: null,
};

eventManager.on("modules/findById", findByIdImpl({
	...args,
}));

// eventManager.on("modules/list", listModules);
//
