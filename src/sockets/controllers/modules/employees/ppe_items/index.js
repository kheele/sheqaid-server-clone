const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {
	ppe_item_details_fragment,
	ppe_item_one_details_fragment,
	getVariablesAndQueryConfig,
} = require("./commons");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");

const args = {
	name: "PPEItems",
	tbl: "ppe_items",
	details_fragment: ppe_item_one_details_fragment,
	uploadUpdate: ({id}) => ({
		new_name: `ppes/ppe-items/${id}/ppe-item-doc`,
		key: 'profile_pic',
	}),
};

const path = 'ppe-items';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listImpl({
	...args,
	details_fragment: ppe_item_details_fragment,
	order_by: "order_by: {ppe_type:{name: asc}}",
	getVariablesAndQueryConfig,
}));
