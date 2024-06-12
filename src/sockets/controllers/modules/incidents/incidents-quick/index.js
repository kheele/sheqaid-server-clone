const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const findByIdDashboardImpl = require('./findByIdDashboardImpl');
const exportExcelImpl = require("../../exportExcelImpl");

eventManager.on("incidents-quick/findById", findByIdImpl);

eventManager.on("incidents-quick/listByLogged", listImpl);

eventManager.on("incidents-quick/dashboard", findByIdDashboardImpl);

eventManager.on("incidents-quick/export-excel", exportExcelImpl({
	currDir: __dirname,
	name: "Quick-Incidents",
	listImpl,
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				created_at,
				//0
				company, client, project, site,
				//1
				exact_location,
				latitude,
				longitude,
				short_desc,
				incident_date,
				incident_time,
				date_reported,
				time_reported,
				time_shift,
			}
		} = item;
		
		client = client || company;
		
		return {
			idx: idx + 1,
			//0
			project: project && project.name,
			site: site && site.name,
			//1
			exact_location,
			latitude,
			longitude,
			short_desc,
			incident_date,
			incident_time,
			date_reported,
			time_reported,
			time_shift,
		};
	},
}));
