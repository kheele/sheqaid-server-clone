const findByIdImpl = require('../../findByIdImpl');
const upsertImpl = require("../../upsertImpl");

const args = {
	name: "AssetPurchaseInfo",
	tbl: "asset_purchase_info",
	details_fragment: `
	  id
	  acquisition_date
	  vendor
	  acquisition_value
	  warranty_expiry
	  reference_num
	  warranty_certificate
	`,
	orgs_fragment: null,
};

const path = 'assets/purchase-info';

eventManager.on(`${path}/upsert`, upsertImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));
