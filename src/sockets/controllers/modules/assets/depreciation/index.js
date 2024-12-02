const findByIdImpl = require('../../findByIdImpl');
const createImpl = require("../../createImpl");
const upsertImpl = require("../../upsertImpl");

const args = {
	name: "AssetDepreciation",
	tbl: "asset_depreciation",
	details_fragment: `
		id
		depreciation_method
		asset_cost
		salvage_value
		depreciation_years
		depreciation_factor
		partial_year_depreciation
	`,
	orgs_fragment: null,
};

const path = 'assets/depreciation';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/upsert`, upsertImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));
