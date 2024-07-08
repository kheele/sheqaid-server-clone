const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');

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

const list = listImpl({
    name: "AssetPurchaseInfo",
    tbl: "asset_purchase_info",
    skipRemoved: true,
    details_fragment: `
		id
		warranty_certificate
	`,
    order_by: `
		order_by: {id: desc}
	`,
    orgs_fragment: null,
});

list(null, {limit: 0, offset: 0}).then(async res => {
    Promise.all(res.filter(v => !!v.data.warranty_certificate && !v.data.warranty_certificate.dlUrls).map(async item => {
        const {id, data: {warranty_certificate}} = item;
        const {path} = warranty_certificate;
        delete warranty_certificate.path;
        let buffer;
        // if (path.buffer) {
        //     buffer = path.buffer;
        // } else {
            buffer = Buffer.from(path);
        // }

        warranty_certificate.buffer = buffer;
        warranty_certificate.contentType = path.split(';')[0].split(':')[1];

        console.log(id, !!buffer, warranty_certificate.contentType);

        // return;

        const new_name = `assets/purchase-info/${id}/warranty-certificate`;
        return await uploadFilesUpdate({
            id, doc: warranty_certificate, new_name, key: "warranty_certificate", onUpdate: async ({id, ...attrs}) => {
                delete attrs.id;

                await updateRelay({
                    mutation: `
							mutation AssetPurchaseInfoMutation($id: asset_purchase_info_pk_columns_input!, $_set: asset_purchase_info_set_input!) {
							  update_asset_purchase_info_by_pk(pk_columns: $id, _set: $_set) {
								id
							  }
							}
						  `,
                    operationName: "AssetPurchaseInfoMutation",
                    id,
                    attrs,
                });
            }
        });
    })).then(res => {
        console.log('res done', res);
    });
});