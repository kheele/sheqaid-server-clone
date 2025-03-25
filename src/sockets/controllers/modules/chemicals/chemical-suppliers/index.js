const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {chemical_supplier_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const exportExcelImpl = require("../../exportExcelImpl");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");

const args = {
	name: "ChemicalSupplier",
	tbl: "sheq_chemical_suppliers",
	details_fragment,
	order_by: "order_by: {manufacturer: asc}",
	getVariablesAndQueryConfig,
	//doc
};

const path = "chemicals/suppliers";

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));

eventManager.on(`${path}/export-excel`, exportExcelImpl({
	currDir: __dirname,
	name: "Chemical-Suppliers",
	listImpl: listImpl({
		...args,
		details_fragment,
		order_by: "order_by: {manufacturer: asc}",
		getVariablesAndQueryConfig,
	}),
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
				// company, client, project, site,
				manufacturer,
				address,
				phone,
				email,
				fax,
				website,

				product,
				sds,
			}
		} = item;
		
		// client = client || company;
		
		return {
			idx: idx + 1,
			
			// project: project && project.name,
			// site: site && site.name,

			manufacturer,
			address,
			phone,
			email,
			fax,
			website,

			product: product && product.name,
			sds: sds && sds.name,
			
			// status,
		};
	},
}));
