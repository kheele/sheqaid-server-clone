const findByIdImpl = require('../../modules/findByIdImpl');
const {details_fragment_plugins: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const {listAllPlugins} = require("./query_plugins");

const args = {
	name: "Plugins",
	tbl: "default_manager_plugin",
	details_fragment,
	skipRemoved: true,
	orgs_fragment: null,
};

eventManager.on("plugins/findById", findByIdImpl({
	...args,
}));

eventManager.on("plugins/list", listAllPlugins);
//
