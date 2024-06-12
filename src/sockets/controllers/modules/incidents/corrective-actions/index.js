const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const exportExcelImpl = require("../../exportExcelImpl");

eventManager.on("corrective-actions/findById", findByIdImpl);

eventManager.on("corrective-actions/listByLogged", listImpl);

eventManager.on("corrective-actions/export-excel", exportExcelImpl({
	currDir: __dirname,
	name: "Incident-Corrective-Actions",
	listImpl,
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				created_at,
				//0
				company, client, project, site,
				//1
				investigation: {
					cause_analysis: {
						immediate_analysis: {
							sub_standard_practices_or_unsafe_acts,
							sub_standard_practices_or_unsafe_conditions,
							custom_sub_standard_practices_or_unsafe_acts,//{text, type, corrective_action_list_job_factors, corrective_action_list_personal_factors, corrective_action_list_custom_job_factors, corrective_action_list_custom_personal_factors, }
							custom_sub_standard_practices_or_unsafe_conditions,
						},
						root_analysis
					},
				},
			}
		} = item;
		
		client = client || company;
		
		return {
			idx: idx + 1,
			
			project: project && project.name,
			site: site && site.name,
			
			due_date: Dates.formatDateSQL(due_date),
			investigation_details,
			investigation_findings_list: (investigation_findings_list || []).map(({text}) => text),
			investigation_findings_further_desc,
			document_list: (document_list || []).map(({text}) => text),
			consequence,
			likelihood,
			weather_condition_list: (weather_condition_list || []).map(({text}) => text),
			protective_equipment_worn_list: (protective_equipment_worn_list || []).map(({text}) => text),
			class_list: (class_list || []).map(({text}) => text),
			environment_list: (environment_list || []).map(({text}) => text),
			severity,
			estimated_costs_damages,
			estimated_costs_medical,
			estimated_costs_salaries_wages,
			estimated_costs_investigations,
			estimated_costs_others,
			
		};
	},
}));
