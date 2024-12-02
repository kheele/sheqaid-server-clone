const findByIdImpl = require('../../findByIdImpl');
const createImpl = require("../../createImpl");
const upsertImpl = require("../../upsertImpl");

const args = {
    name: "AssetDetails",
    tbl: "asset_details",
    details_fragment: `
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
	`,
    orgs_fragment: null,
};

const path = 'assets/details';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/upsert`, upsertImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));
