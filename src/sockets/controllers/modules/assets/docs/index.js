const findByIdImpl = require('../../findByIdImpl');
const listByLoggedImpl = require("../../listByLoggedImpl");
const exportExcelImpl = require("../../exportExcelImpl2");
const createImpl = require('../../createImpl');
const upsertImpl = require("../../upsertImpl");
const {getVariablesAndQueryConfig, doc_inc_fragment, details_fragment, asset_doc_export_details_fragment,
    asset_doc_list_details_fragment
} = require("./commons");
const {mapExportRow, where} = require("./asset_docs_funs");

const args = {
    name: "AssetDocs",
    tbl: "asset_docs",
    details_fragment,
    orgs_fragment: null,
    getVariablesAndQueryConfig,
    uploadUpdate: ({id, data: {asset_id}}) => ({
        new_name: `assets/${asset_id}/docs/documents/${id}/doc`,
        key: 'doc',
    }),
};

const path = 'assets/docs';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/upsert`, upsertImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    name: 'AssetDocs',
    tbl: data => {
        const {
            view = 'Asset',
        } = data;
        console.log('view------------', view)
        if (view === 'Asset') {
            return `assets`;
        }

        return `asset_docs`;
    },
    where,
    orgs_fragment: null,
    details_fragment: asset_doc_list_details_fragment,
    order_by: data => {
        const {
            view = 'Asset',
        } = data;
        if (view === 'Asset') {
            return "order_by: {asset_detail:{name: asc}}";
        }

        return "order_by: {asset: {asset_detail:{name: asc}}}";
    },
}));

eventManager.on(`${path}/export-excel`, exportExcelImpl({
    ...args,
    currDir: __dirname,
    name: "Assets-Documents",
    details_fragment: asset_doc_export_details_fragment,
    order_by: "order_by: {asset: {asset_detail:{name: asc}}},",
    mapRow: mapExportRow,
}));
