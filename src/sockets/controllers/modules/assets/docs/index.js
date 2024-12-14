const findByIdImpl = require('../../findByIdImpl');
const listByLoggedImpl = require("../../listByLoggedImpl");
const {asset_basic_details_fragment} = require("../commons");
const {orgs_fragment} = require("../../../../../graphql/Fragments");
const exportExcelImpl = require("../../exportExcelImpl");
const createImpl = require('../../createImpl');
const upsertImpl = require("../../upsertImpl");
const {getVariablesAndQueryConfig} = require("./commons");

const details_fragment = `
  id
  created_at
  date
  expiry
  removed
  title
  desc
  type
  doc
  
  asset_id
  asset{
    ${asset_basic_details_fragment}
    doc_list(where: {removed: {_eq: false}}){
      id
      expiry
    }
    ${orgs_fragment}
  }
`;

//<editor-fold desc="doc_inc_fragment">
const doc_inc_fragment = `
    id
    created_at
    date
    expiry
    removed
    title
    desc
    type
    doc
    asset{
        id
        ${orgs_fragment}
    }
`;
//</editor-fold>

const args = {
    name: "AssetDoc",
    tbl: "asset_docs",
    details_fragment,
    orgs_fragment: null,
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
    where: ({data, filters}) => {
        const {
            view = 'Asset',
            written_off: removed = false,
        } = data;

        const {filter, filterAsset} = filters;

        if (view === 'Asset') {
            return `
                doc_list_aggregate: {
                    count: {
                      predicate: {_gt: 0},
                      filter: {removed: {_eq: ${removed}}${filter}}
                    }
                  }, 
                  doc_list: {removed: {_eq: ${removed}}${filter}}
                  ${filterAsset}
            `;
        }

        return `
            removed: {_eq: ${removed}},
                  ${filter},
                  ${filterAsset}
            `;
    },
    orgs_fragment: null,
    details_fragment: (socket, data) => {
        const {
            view = 'Asset',
            mon, mon2, mon3,
            written_off: removed = false,
        } = data;
        if (view === 'Asset') {
            return `
                ${asset_basic_details_fragment}
                doc_list(where: {removed: {_eq: ${removed}}}, order_by: {expiry: desc_nulls_last}){
                  ${doc_inc_fragment}
                }
                doc_list_no_expiry_aggregate:doc_list_aggregate(where: {
                  removed: {_eq: ${removed}}, expiry: {_is_null: true}
                }){
                  aggregate{
                    count
                  }
                }
                doc_list_expired_aggregate:doc_list_aggregate(where: {
                  removed: {_eq: ${removed}}, expiry: {_lte: "now()"}
                }){
                  aggregate{
                    count
                  }
                }
                doc_list_mon_expiry_aggregate:doc_list_aggregate(where: {
                  removed: {_eq: ${removed}}, expiry: {_gt: "now()", _lte: "${mon}"}
                }){
                  aggregate{
                    count
                  }
                }
                doc_list_2mon_expiry_aggregate:doc_list_aggregate(where: {
                  removed: {_eq: ${removed}}, expiry: {_gt: "${mon}", _lte: "${mon2}"}
                }){
                  aggregate{
                    count
                  }
                }
                doc_list_3mon_expiry_aggregate:doc_list_aggregate(where: {
                  removed: {_eq: ${removed}}, expiry: {_gt: "${mon2}", _lte: "${mon3}"}
                }){
                  aggregate{
                    count
                  }
                }
                doc_list_4mon_expiry_aggregate:doc_list_aggregate(where: {
                  removed: {_eq: ${removed}}, expiry: {_gt: "${mon3}"}
                }){
                  aggregate{
                    count
                  }
                }
                ${orgs_fragment}
            `;
        }

        return `
            id
            created_at
            date
            expiry
            removed
            title
            desc
            type
            doc
            
            asset{
              ${asset_basic_details_fragment}
              doc_list(where: {removed: {_eq: ${removed}}}){
                id
                expiry
              }
              ${orgs_fragment}
            }
        `;
    },
    order_by: data => {
        const {
            view = 'Asset',
        } = data;
        if (view === 'Asset') {
            return "order_by: {asset_detail:{name: asc}}";
        }

        return "order_by: {asset: {asset_detail:{name: asc}}}";
    },
    getVariablesAndQueryConfig,
}));

eventManager.on(`${path}/export-excel`, exportExcelImpl({
    currDir: __dirname,
    name: "Assets-Documents",
    listImpl: listByLoggedImpl({
        name: 'AssetDocs',
        tbl: 'asset_docs',
        orgs_fragment: null,
        details_fragment: (socket, data) => {
            const {
                written_off: removed = false,
            } = data;

            return `
                id
                created_at
                date
                expiry
                removed
                title
                desc
                type
                doc
                
                asset{
                  ${asset_basic_details_fragment}
                  doc_list(where: {removed: {_eq: ${removed}}}){
                    id
                    expiry
                  }
                  ${orgs_fragment}
                }
            `;
        },
        order_by: "order_by: {asset: {asset_detail:{name: asc}}},",
    }),
    mapRow: (item, idx) => {
        let {
            id,
            data: {
                created_at,
                date,
                expiry,
                title,
                type,
                doc_version_list,
                //
                asset: {
                    project,
                    site,
                    //
                    doc_list,
                    status,
                    written_off,
                    responsible_person,
                    asset_detail: {
                        asset_type,
                        name,
                        manufacturer,
                        reg_num,
                        serial_num,
                    }
                }
            }
        } = item;

        // client = client || company;

        return {
            idx: idx + 1,

            project: project && project.name,
            site: site && site.name,

            id,
            asset_type,
            name,
            manufacturer,
            responsible_person: responsible_person && responsible_person.full_name,
            reg_num,
            serial_num,
            date: Dates.formatDateSQL(date),
            expiry_date: Dates.formatDateSQL(expiry),
            // doc: doc && doc.dlUrls ? doc.dlUrls[0] : '',
            //
            title,
            type,

            status: written_off ? "Inactive" : "Active",
        };
    },
}));
