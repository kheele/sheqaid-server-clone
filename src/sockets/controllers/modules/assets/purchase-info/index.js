const findByIdImpl = require('../../findByIdImpl');

const details_fragment = `
  id
  acquisition_date
  vendor
  acquisition_value
  warranty_expiry
  reference_num
  warranty_certificate
`;

eventManager.on("assets/purchase-info/findById", findByIdImpl({
	name: "AssetPurchaseInfo", tbl: "asset_purchase_info", details_fragment,
}));
