const findByIdImpl = require('../../findByIdImpl');

const details_fragment = `
  id
  owning_company
  name
  asset_type
  desc
  manufacturer
  model
  reg_num
  serial_num
  location
  toolkit
  condition
  barcode
  qr_code
  notes
`;

eventManager.on("assets/details/findById", findByIdImpl({
	name: "AssetDetails",
	tbl: "asset_details",
	details_fragment,
	orgs_fragment: null,
}));
