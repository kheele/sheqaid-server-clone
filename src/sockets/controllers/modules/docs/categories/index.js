const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {document_category_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "DocumentCategory",
	tbl: "default_document_categories",
	details_fragment,
};

eventManager.on("documents/categories/findById", findByIdImpl(args));

eventManager.on("documents/categories/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));
//
