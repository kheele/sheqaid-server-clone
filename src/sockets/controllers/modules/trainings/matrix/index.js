const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const exportExcelImpl = require("../../exportExcelImpl");

eventManager.on("trainings/matrix/findById", findByIdImpl);

eventManager.on("trainings/matrix/listByLogged", listImpl);

eventManager.on("trainings/matrix/export-excel", exportExcelImpl({
	currDir: __dirname,
	name: "TrainingMatrices",
	listImpl,
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				created_at,
				removed,
				company, client, project, site,
				//1
				
				status,
				cost,
				institution_conducting_training,
				trainer,
				trainer_external,
				trainer_job_position,
				job_category_list,
				job_position_list,
				sector_list,
				course,
				requirement_legal,
				requirement,
				max_participants_per_course,
				training_standard,
				training_frequency,
				provider_requirement,
				certificate_expiration,
				
				competency_evaluation,
				unit_standard,
				unit_standard_desc,
				credits,
				nqf_level,
				
				training_plan_list,
				
				date_range,
				
			}
		} = item;
		
		client = client || company;
		
		return {
			idx: idx + 1,
			id,
			
			project: project && project.name,
			site: site && site.name,
			
			course: course && course.name,
			trainer: (trainer || trainer_external) && (trainer || trainer_external).full_name,
			trainer_job_position: trainer_job_position && ` (${trainer_job_position.name})`,
			institution_conducting_training,
			
			job_category_list: job_category_list ? job_category_list.map(v => v.job_category.name).join(', ') : "",
			job_position_list: job_position_list ? job_position_list.map(v => v.job_position.name).join(', ') : "",
			sector_list: sector_list ? sector_list.map(v => v.sector.name).join(', ') : "",
			
			requirement_legal,
			requirement,
			provider_requirement,
			max_participants_per_course,
			training_standard,
			training_frequency,
			competency_evaluation,
			unit_standard,
			unit_standard_desc,
			credits,
			nqf_level,
			date_range_start: date_range && Dates.formatDateSQL(date_range.start),
			date_range_end: date_range && Dates.formatDateSQL(date_range.end),
			
			status,
			activeness: removed ? "Inactive" : "Active",
		};
	},
}));
