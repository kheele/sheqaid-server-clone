const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('./listImpl');
const {asset_basic_details_fragment} = require("../commons");
const {orgs_fragment} = require("../../../../../graphql/Fragments");
const exportExcelImpl = require("../../exportExcelImpl");

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

eventManager.on("assets/docs/findById", findByIdImpl({
	name: "AssetDoc", tbl: "asset_docs", details_fragment,
}));

eventManager.on("assets/docs/listByLogged", listImpl);

eventManager.on("assets/docs/export-excel", exportExcelImpl({
	currDir: __dirname,
	name: "Assets-Documents",
	listImpl,
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
					asset_detail:{
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
