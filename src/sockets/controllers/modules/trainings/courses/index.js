const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const exportExcelImpl = require("../../exportExcelImpl");
const {
	hira_taskbased_ra_details_fragment: details_fragment,
	getVariablesAndQueryConfig
} = require("../../hira-and-opportunities/task-based-ra/commons");

eventManager.on("trainings/courses/findById", findByIdImpl);

eventManager.on("trainings/courses/listByLogged", listImpl);

eventManager.on("trainings/courses/export-excel", exportExcelImpl({
	currDir: __dirname,
	name: "TrainingCourses",
	listImpl,
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				created_at,
				removed,
				company, client, project, site,
				
				status,
				//1
				name,
				job_position_list,
				sector_list,
				frequency,
				provider,
				//2
				unit_standard,
				unit_standard_desc,
			}
		} = item;
		
		client = client || company;
		
		return {
			idx: idx + 1,
			id,
			
			project: project && project.name,
			site: site && site.name,
			
			name,
			
			job_position_list: job_position_list ? job_position_list.map(v => v.job_position.name).join(', ') : "",
			sector_list: sector_list ? sector_list.map(v => v.sector.name).join(', ') : "",
			
			provider,
			frequency,
			
			unit_standard,
			unit_standard_desc,
			status: removed ? "Inactive" : "Active",
		};
	},
}));
