const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('./listImpl');

const {hira_swp_details_fragment: details_fragment} = require('./commons');
const exportExcelImpl = require("../../exportExcelImpl");

eventManager.on("hira-and-opportunities/swp/findById", findByIdImpl({
	name: "WSWP", tbl: "hira_swp", details_fragment,
}));

eventManager.on("hira-and-opportunities/swp/listByLogged", listImpl);

eventManager.on("hira-and-opportunities/swp/export-excel", exportExcelImpl({
	currDir: __dirname,
	name: "WSWP",
	listImpl,
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				created_at,
				removed,
				company, client, project, site,
				//1 done
				category,
				work_task,
				date_created,
				location,
				department,
				person_approving_procedure,
				expiry,
				sign_sheet_notes,
				//2
				doc,
				//3
				potential_hazard_and_possible_cause_list,
				//4
				ppe_required_list,
				//5
				steps_to_perform_task_list,
				//6
				notes,
				//7
				training_requirement_list,
				//8
				sign_sheet_employee_list,
			}
		} = item;
		
		client = client || company;
		
		return {
			idx: idx + 1,
			id,
			
			project: project && project.name,
			site: site && site.name,
			
			category,
			work_task,
			date_created: Dates.formatDateSQL(date_created),
			location,
			department: department && department.name,
			person_approving_procedure: person_approving_procedure && person_approving_procedure.full_name,
			expiry: Dates.formatDateSQL(expiry),
			sign_sheet_notes,
			doc: doc && doc.dlUrls && doc.dlUrls[0],
			potential_hazard_and_possible_cause_list: (potential_hazard_and_possible_cause_list || []).map(({cause, hazard, rating}) => `(${cause}: ${hazard})`).join(', '),
			ppe_required_list: (ppe_required_list || []).map(({ppe}) => ppe.name).join(', '),
			steps_to_perform_task_list: (steps_to_perform_task_list || []).map(({text}) => text).join(', '),
			notes,
			training_requirement_list: (training_requirement_list || []).map(({text}) => text).join(', '),
			sign_sheet_employee_list: (sign_sheet_employee_list || []).map(({employee}) => employee.full_name).join(', '),
			status: removed ? "Inactive" : "Active",
		};
	},
}));
