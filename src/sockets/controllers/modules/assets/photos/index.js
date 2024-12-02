const upsertImpl = require("../../upsertImpl");

const details_fragment = `
  id
  doc
  is_default
  asset_id
  asset{
    id
  }
`;

const args = {
	name: "AssetPhoto",
	tbl: "asset_photos",
	details_fragment,
	orgs_fragment: null,
	uploadUpdate: ({id, data:{asset_id}}) => ({
		new_name: `assets/${asset_id}/photos/documents/${id}/doc`,
		key: 'doc',
	}),
};

const path = 'assets/photos';

eventManager.on(`${path}/upsert`, upsertImpl(args));
