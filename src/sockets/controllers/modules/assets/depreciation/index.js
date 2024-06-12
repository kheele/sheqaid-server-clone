const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('./listImpl');

const details_fragment = `
	id
  depreciation_method
  asset_cost
  salvage_value
  depreciation_years
  depreciation_factor
  partial_year_depreciation
`;

eventManager.on("assets/depreciation/findById", findByIdImpl({
	name: "AssetDepreciation", tbl: "asset_depreciation", details_fragment,
}));

eventManager.on("assets/depreciation/listByLogged", listImpl);
