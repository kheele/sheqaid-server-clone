const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const exportExcelImpl = require("../../exportExcelImpl");

eventManager.on("trainings/toolbox-talks/findById", findByIdImpl);

eventManager.on("trainings/toolbox-talks/listByLogged", listImpl);

eventManager.on("trainings/toolbox-talks/export-excel", exportExcelImpl({
	currDir: __dirname,
	name: "TrainingToolboxTalks",
	listImpl,
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				created_at,
				removed,
				company, client, project, site,
				//1
				subject,
				subject_category,
				training_frequency,
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
			
			
			subject,
			subject_category,
			training_frequency,
			
			// institution_conducting_training,
			//
			// trainer: ,
			// trainer_job_position: ,
			//
			// date: ,
			// time_from,
			// time_to,
			
			status: removed ? "Inactive" : "Active",
		};
	},
}));
