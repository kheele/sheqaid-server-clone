const listImpl = require('../../modules/listImpl');
const findByIdImpl = require('../../modules/findByIdImpl');
const {getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "Plugins",
	tbl: "default_manager_plugin",
	details_fragment: `
		id
        app
        desc
        key
        status
        title
        module_list(order_by: [{sort: asc}]) {
            id
            borderColor
            desc
            discount
            faIconLeft
            faIconRight
            has_update
            hover
            key
            price
            sort
            status
            svgIconLeft
            svgIconRight
            title
            plugin {
              key
            }
        }
	`,
	orgs_fragment: null,
};

eventManager.on("plugins/findById", findByIdImpl({
	...args,
}));

eventManager.on("plugins/list", listImpl({
	...args,
	order_by: "order_by: {title: asc}",
	getVariablesAndQueryConfig,
}));
//
