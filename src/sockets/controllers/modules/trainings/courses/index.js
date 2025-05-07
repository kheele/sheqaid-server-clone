const findByIdImpl = require('./findByIdImpl');
const listByLoggedImpl = require("../../listByLoggedImpl");
const exportExcelImpl = require("../../exportExcelImpl");
const {training_course_details_fragment, getVariablesAndQueryConfig} = require("./commons");
const {createCourse} = require("./create");

const args = {
	name: 'Courses',
	tbl: 'sheq_training_courses',
	details_fragment: training_course_details_fragment,
	order_by: `{name: asc}`,
	getVariablesAndQueryConfig,
};

const path = `trainings/courses`;

eventManager.on(`${path}/create`, createCourse);

eventManager.on(`${path}/findById`, findByIdImpl);

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));

// eventManager.on(`${path}/export-excel`, exportExcelImpl({
// 	currDir: __dirname,
// 	name: "TrainingCourses",
// 	listImpl,
// 	mapRow: (item, idx) => {
// 		let {
// 			id,
// 			data: {
// 				created_at,
// 				removed,
// 				company, client, project, site,
//
// 				status,
// 				//1
// 				name,
// 				job_position_list,
// 				sector_list,
// 				frequency,
// 				provider,
// 				//2
// 				unit_standard,
// 				unit_standard_desc,
// 			}
// 		} = item;
//
// 		client = client || company;
//
// 		return {
// 			idx: idx + 1,
// 			id,
//
// 			project: project && project.name,
// 			site: site && site.name,
//
// 			name,
//
// 			job_position_list: job_position_list ? job_position_list.map(v => v.job_position.name).join(', ') : "",
// 			sector_list: sector_list ? sector_list.map(v => v.sector.name).join(', ') : "",
//
// 			provider,
// 			frequency,
//
// 			unit_standard,
// 			unit_standard_desc,
// 			status: removed ? "Inactive" : "Active",
// 		};
// 	},
// }));
