const {orgs_fragment, asset_basic_details_fragment} = require("../../../../../graphql/Fragments");
const {getVariablesAndQueryConfig} = require('./commons');
const {audit_details_fragment} = require("../../audits/commons");

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

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		view = 'Asset',
		mon, mon2, mon3,
		expiry_date = 'ALL',
		date_range,
		date,
		removed = false,
		//
		id_list,
		//
		type,
		title,
		asset_id,
		responsible_person_list,
		//
		name,
		reg_num,
		serial_num,
		model,
		manufacturer,
		location,
		asset_type,
		condition,
		status,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		client_filter,
		orgs_filter = [],
	} = data;
	
	const {filter, filterAsset} = getVariablesAndQueryConfig({
		orgs_filter,
		//
		view,
		mon, mon2, mon3,
		expiry_date,
		date_range,
		date,
		//
		type,
		title,
		asset_id,
		responsible_person_list,
		//
		name,
		reg_num,
		serial_num,
		model,
		manufacturer,
		location,
		asset_type,
		condition,
		status,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	if (!id_list && view === 'Asset') {
		//<editor-fold desc="ByGroup">
		return listGraphQL({
			query: `
                query listAllByGroupAssetDocByLoggedQuery {
                  assets(
                    where: {
                      doc_list_aggregate: {
                        count: {
                          predicate: {_gt: 0},
                          filter: {removed: {_eq: ${removed}}${filter}}
                        }
                      }, 
                      doc_list: {removed: {_eq: ${removed}}${filter}}
                      ${filterAsset}
                    }
                    order_by: {asset_detail:{name: asc}},
                    offset: ${offset},
                    ${limit > 0 ? `,limit: ${limit}` : ''}
                  ) {
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
                  }
                }
            `,
		});
		//</editor-fold>
	} else {
		if (id_list) {
			return listGraphQL({
				query: `
				query listByIdsByEachAssetDocByLoggedQuery {
	        asset_docs(
	          where: {
	            id: {_in: [${id_list.join(',')}]}
	          },
            order_by: {asset: {asset_detail:{name: asc}}},
	        ) {
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
	        }
	      }
			`,
				operationName: "listByIdsByEachAssetDocByLoggedQuery",
			});
		} else {
			//<editor-fold desc="ByEach">
			return listGraphQL({
				query: `
                query listAllByEachAssetDocByLoggedQuery {
                  asset_docs(
                    where: {
                      removed: {_eq: ${removed}},
                      ${filter},
                      ${filterAsset}
                    },
                    order_by: {asset: {asset_detail:{name: asc}}},
                    offset: ${offset},
                    ${limit > 0 ? `,limit: ${limit}` : ''}
                  ) {
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
                  }
                }
            `,
				operationName: "listAllByEachAssetDocByLoggedQuery",
			});
			//</editor-fold>
		}
	}
}
//</editor-fold>
