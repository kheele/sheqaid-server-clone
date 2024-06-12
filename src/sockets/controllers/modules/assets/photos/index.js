const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('./listImpl');

const details_fragment = `
  id
  doc
  is_default
	asset_id
  asset{
    id
  }
`;

eventManager.on("assets/photos/findById", findByIdImpl({
	name: "AssetPhoto", tbl: "asset_photos", details_fragment,
}));

eventManager.on("assets/photos/listByLogged", listImpl);
