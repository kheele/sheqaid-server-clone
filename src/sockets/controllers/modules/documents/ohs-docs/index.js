const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const deleteImpl = require("../../deleteImpl");
const findByIdImpl = require("../../findByIdImpl");
const listImpl = require('../../listImpl');
const {ohs_docs_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
	name: "OHSDocs",
	tbl: "ohs_documents",
	details_fragment,
	orgs_fragment: null,
	uploadUpdate: ({id}) => ({
		new_name: `documents/ohs-docs/${id}/doc`,
		key: 'doc',
	}),
};

const path = "documents/ohs-docs/";

eventManager.on(`${path}create`, createImpl(args));

eventManager.on(`${path}update`, updateImpl(args));

eventManager.on(`${path}delete`, deleteImpl(args));

eventManager.on(`${path}findById`, findByIdImpl(args));

eventManager.on("documents/ohs-docs/listAll", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {title: asc}",
	getVariablesAndQueryConfig,
}));
//
