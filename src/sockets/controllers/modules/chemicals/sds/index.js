const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {chemical_sds_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const exportExcelImpl = require("../../exportExcelImpl");

const args = {
	name: "ChemicalSDS",
	tbl: "sheq_chemical_sds",
	details_fragment,
};

eventManager.on("chemicals/sds/findById", findByIdImpl(args));

eventManager.on("chemicals/sds/listByLogged", listImpl({
	...args,
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));

eventManager.on("chemicals/sds/export-excel", exportExcelImpl({
	currDir: __dirname,
	name: "Safety-Datasheets",
	listImpl: listImpl({
		...args,
		details_fragment,
		order_by: "order_by: {name: asc}",
		getVariablesAndQueryConfig,
	}),
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
				company, client, project, site,
				
				product,
				
				name,
				
				common_names,
				
				chemical_name,
				
				empirical_formula,
				
				un_num,
				
				category,
				
				date_identified,
				
				application_or_use,
				
				supplier_list,
				emergency_phone_nums,
				risk_level,
				more_product_info,
				composition_or_information_on_ingredients,
				hazards_identification,
				first_aid_measures_and_precautions,
				firefighting_measures,
				accidental_release_measures,
				handling_and_storage_requirements,
				exposure_controls_or_personal_protection,
				physical_and_chemical_properties,
				stability_and_reactivity,
				toxicological_info,
				ecological_info,
				disposal_considerations,
				transport_info,
				regulatory_info,
				other_info,
				doc
			}
		} = item;
		
		client = client || company;
		
		return {
			idx: idx + 1,
			
			project: project && project.name,
			site: site && site.name,
			
			product,
			name,
			common_names,
			chemical_name,
			empirical_formula,
			un_num,
			category,
			date_identified:Dates.formatDateSQL(date_identified),
			application_or_use,
			supplier_list: (supplier_list || []).map(({manufacturer}) => manufacturer).join(', '),
			emergency_phone_nums,
			risk_level,
			more_product_info,
			composition_or_information_on_ingredients,
			hazards_identification,
			first_aid_measures_and_precautions,
			firefighting_measures,
			accidental_release_measures,
			handling_and_storage_requirements,
			exposure_controls_or_personal_protection,
			physical_and_chemical_properties,
			stability_and_reactivity,
			toxicological_info,
			ecological_info,
			disposal_considerations,
			transport_info,
			regulatory_info,
			other_info,
			doc: doc && doc.dlUrls[0],
			
			status,
		};
	},
}));
