const findByIdImpl = require('../../findByIdImpl');
const listByLoggedImpl = require('../../listByLoggedImpl');
const {chemical_hazchem_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const exportExcelImpl = require("../../exportExcelImpl");
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");

const args = {
	name: "ChemicalHazchemSheet",
	tbl: "sheq_chemical_hazchem_sheets",
	details_fragment,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
};

const path = "chemicals/hazchem-sheets";

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));

// eventManager.on(`${path}/export-excel`, exportExcelImpl({
// 	currDir: __dirname,
// 	name: "Hazchem-Sheets",
// 	listImpl: listImpl({
// 		...args,
// 		details_fragment,
// 		order_by: "order_by: {name: asc}",
// 		getVariablesAndQueryConfig,
// 	}),
// 	mapRow: (item, idx) => {
// 		let {
// 			id,
// 			data: {
// 				created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
// 				company, client, project, site,
// 				//1 done
// 				name,
// 				physical_state,
// 				type,
// 				product,
// 				sds,
// 				//3
// 				active_ingredient_list,
// 				//4
// 				hazard_identification_physical_list,
// 				hazard_identification_reproductive_list,
// 				hazard_identification_biological_list,
// 				//5
// 				first_aid_procedure_splashes_in_eyes_list,
// 				first_aid_procedure_contact_with_skin_list,
// 				first_aid_procedure_mouth_contact_or_eaten_list,
// 				first_aid_procedure_fumes_breathed_in_list,
// 				//6
// 				emergency_action_for_spills_small_list,
// 				emergency_action_for_spills_large_list,
// 				//7
// 				disposal_used_container_list,
// 				disposal_unused_product_list,
// 				//8
// 				contacts_emergency_name,
// 				contacts_emergency_num,
// 				contacts_manufacturer_name,
// 				contacts_manufacturer_num,
// 				//9
// 				doc,
// 				//10
// 				precaution_photo_list,
// 			}
// 		} = item;
//
// 		client = client || company;
//
// 		return {
// 			idx: idx + 1,
//
// 			project: project && project.name,
// 			site: site && site.name,
//
// 			name,
// 			physical_state,
// 			type,
// 			product,
// 			sds,
// 			active_ingredient_list: (active_ingredient_list || []).map(({value}) => value).join(', '),
// 			hazard_identification_physical_list: (hazard_identification_physical_list || []).map(({value}) => value).join(', '),
// 			hazard_identification_reproductive_list:  (hazard_identification_reproductive_list || []).map(({value}) => value).join(', '),
// 			hazard_identification_biological_list:  (hazard_identification_biological_list || []).map(({value}) => value).join(', '),
// 			first_aid_procedure_splashes_in_eyes_list:  (first_aid_procedure_splashes_in_eyes_list || []).map(({value}) => value).join(', '),
// 			first_aid_procedure_contact_with_skin_list: (first_aid_procedure_contact_with_skin_list || []).map(({value}) => value).join(', '),
// 			first_aid_procedure_mouth_contact_or_eaten_list: (first_aid_procedure_mouth_contact_or_eaten_list || []).map(({value}) => value).join(', '),
// 			first_aid_procedure_fumes_breathed_in_list: (first_aid_procedure_fumes_breathed_in_list || []).map(({value}) => value).join(', '),
// 			emergency_action_for_spills_small_list: (emergency_action_for_spills_small_list || []).map(({value}) => value).join(', '),
// 			emergency_action_for_spills_large_list: (emergency_action_for_spills_large_list || []).map(({value}) => value).join(', '),
// 			disposal_used_container_list: (disposal_used_container_list || []).map(({value}) => value).join(', '),
// 			disposal_unused_product_list: (disposal_unused_product_list || []).map(({value}) => value).join(', '),
// 			precaution_photo_list: (precaution_photo_list || []).map(({doc}) => doc.dlUrls).join(', '),
// 			contacts_emergency_name,
// 			contacts_emergency_num,
// 			contacts_manufacturer_name,
// 			contacts_manufacturer_num,
// 			doc: doc && doc.dlUrls[0],
//
// 			status,
// 		};
// 	},
// }));
