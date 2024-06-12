const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const exportExcelImpl = require("../../exportExcelImpl");

eventManager.on("trainings/register/findById", findByIdImpl);

eventManager.on("trainings/register/listByLogged", listImpl);

eventManager.on("trainings/register/export-excel", exportExcelImpl({
	currDir: __dirname,
	name: "TrainingRegisters",
	listImpl,
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				created_at,
				removed,
				company, client, project, site,
				//1
				training,
				trainer,
				trainer_external,
				institution_conducting_training,
				time_or_duration,
				time_from,
				time_to,
				date,
				list_proof,
				employee_list,
			}
		} = item;
		
		client = client || company;
		
		let {course, training_plan_list, job_position_list} = training || {};
		const trainer_job_position = trainer && trainer.job_position && trainer.job_position.name || trainer_external && trainer_external.job_position && trainer_external.job_position.name || "";
		
		return {
			idx: idx + 1,
			id,
			
			project: project && project.name,
			site: site && site.name,
			
			course: course && course.name,
			job_position_list: (job_position_list || []).map(({job_position:{id, name}}) => name).join(', '),
			trainer: trainer && trainer.full_name || trainer_external && trainer_external.full_name || "",
			trainer_job_position: trainer_job_position ? `(${trainer_job_position})` : "",
			institution_conducting_training,
			time_from: time_from && time_from.substring(0, 5),
			time_to: time_to && time_to.substring(0, 5),
			duration: time_or_duration,
			year: date ? Dates.formatYearMonth(date).substring(0, 4) : "",
			date: Dates.formatDate(date),
			// list_proof,
			employee_list: employee_list ? employee_list.length : 'Uploaded',
			attendance_rate: training_plan_list.isNotEmpty() ? (
				employee_list ? (employee_list.length / training_plan_list.length * 100).toFixed(0) + '%' : ''
			) : '',
			
			status: removed ? "Inactive" : "Active",
		};
	},
}));
