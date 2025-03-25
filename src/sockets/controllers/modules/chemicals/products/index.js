const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {chemical_product_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const exportExcelImpl = require("../../exportExcelImpl");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");

const args = {
	name: "ChemicalInventoryProduct",
	tbl: "sheq_chemical_products",
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
};

const path = "chemicals/products";

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));

eventManager.on(`${path}/export-excel`, exportExcelImpl({
	currDir: __dirname,
	name: "Chemical-Products",
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
				//1
				
				name,
				common_names,
				chemical_name,
				empirical_formula,
				un_num,
				cas_num,
				concentration,
				category,
				physical_state,
				type,
				application_or_use,
				supplier_list,
				emergency_phone_nums,
				//2
				location_where_product_is_used,
				process_where_product_is_used,
				is_stable,
				is_cool_well_ventilated_area,
				heat_sparks_static_flames,
				spillage_control,
				other_special_info,
				//3
				compatible_with_list,
				incompatible_with_list,
				//4
				risk_level,
				//5
				is_combustible,
				is_flammable,
				flammability_combustibility_class,
				//6
				fire_fighting_foam,
				fire_fighting_dcp,
				fire_fighting_co2,
				fire_fighting_sand,
				fire_fighting_water,
				fire_fighting_other,
				//7
				is_hazardous,
				hazard_class_list,
				//8
				has_sds,
				sds,
				sds_doc,
				sds_date,
				//9
				has_hazchem_sheet,
				hazchem_sheet,
				hazchem_sheet_doc,
				hazchem_sheet_date,
				//10
				has_risk_assessment,
				risk_assessment_doc,
				risk_assessment_date,
				//11
				ppe_list,
				//12
				action_or_comments,
				//13
				chemical_stock_list
			}
		} = item;
		
		client = client || company;
		
		return {
			idx: idx + 1,
			
			project: project && project.name,
			site: site && site.name,
			
			id,
			//
			
			name,
			common_names,
			empirical_formula,
			un_num,
			cas_num,
			concentration,
			category,
			physical_state,
			emergency_phone_nums,
			location_where_product_is_used,
			process_where_product_is_used,
			is_stable,
			is_cool_well_ventilated_area,
			heat_sparks_static_flames,
			spillage_control,
			other_special_info,
			compatible_with_list,
			incompatible_with_list,
			risk_level,
			is_combustible,
			is_flammable,
			flammability_combustibility_class,
			fire_fighting_foam,
			fire_fighting_dcp,
			fire_fighting_co2,
			fire_fighting_sand,
			fire_fighting_water,
			fire_fighting_other,
			is_hazardous,
			
			has_sds,
			sds,
			sds_doc,
			sds_date: Dates.formatDateSQL(sds_date),
			has_hazchem_sheet,
			hazchem_sheet,
			hazchem_sheet_doc,
			hazchem_sheet_date:Dates.formatDateSQL(hazchem_sheet_date),
			has_risk_assessment,
			risk_assessment_doc,
			risk_assessment_date:Dates.formatDateSQL(risk_assessment_date),
			action_or_comments,
			
			chemical_stock_list: (chemical_stock_list || []).filter(v => !!v).map((
				{is_clearly_labeled, storage_location, unit, qty, date_received, expiry_date}
			) => is_clearly_labeled).join(','),
			supplier_list: (supplier_list || []).map(({manufacturer, email, phone, fax, website, address,}) => manufacturer).join(', '),
			
			ppe_list: (ppe_list || []).filter(v => v && (v.id || (v.ppe && v.ppe.id))).map(v =>v),
			
			//
			status,
		};
	},
}));
