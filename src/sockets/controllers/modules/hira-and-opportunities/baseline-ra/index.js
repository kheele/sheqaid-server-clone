const findByIdImpl = require('../../findByIdImpl');
const listImpl = require('../../listImpl');
const {hira_baseline_ra_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const exportExcelImpl = require("../../exportExcelImpl");
const updateImpl = require("../../updateImpl");
const createImpl = require("../../createImpl");
const listByLoggedImpl = require("../../listByLoggedImpl");

const args = {
	name: "BaselineRiskAssessments",
	tbl: "hira_baseline_ra",
	details_fragment,
	order_by: "order_by: {activity: asc}",
	getVariablesAndQueryConfig,
};

const path = 'hira-and-opportunities/baseline-ra';

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl(args));

eventManager.on(`${path}/export-excel`, exportExcelImpl({
	currDir: __dirname,
	name: "BaselineRA",
	listImpl: listImpl({
		...args,
		details_fragment,
		order_by: "order_by: {activity: asc}",
		getVariablesAndQueryConfig,
	}),
	mapRow: (item, idx) => {
		let {
			id,
			data: {
				created_at,
				removed,
				company, client, project, site,
				//1
				activity,
				expiry_date,
				risk_tolerance,
				list,
			}
		} = item;
		
		client = client || company;
		
		return {
			idx: idx + 1,
			id,
			
			project: project && project.name,
			site: site && site.name,
			
			activity,
			expiry_date: Dates.formatDateSQL(expiry_date),
			risk_tolerance,
			status: removed ? "Inactive" : "Active",
		};
	},
}));

eventManager.on(`${path}/createPDF`, async (socket, data) => {
	if(!data) return;
	
	// const {
	// 	user, user: {data: {client: my_client, project: my_project, site: my_site}},
	// 	company: {id: company_id},
	// 	client_id, project_id, site_id
	// } = loggedUser;
	
	const fn = listImpl({
		...args,
		details_fragment,
		order_by: "order_by: {activity: asc}",
		getVariablesAndQueryConfig,
	});
	
	const list = await fn(socket, data);
	
	return await onCreatePDFImpl(path.join(__dirname + "/pdf/report-ra-baseline.ejs"), {
		list
	}, "landscape");
});
//
function onCreatePDFImpl(template, data, orientation = "portrait") {
	return new Promise((resolve, reject) => {
		ejs.renderFile(template, data, (err, data) => {
			if (err) {
                   console.log('err.message1', err.message)
				reject(new Error('unknown', err.message));
			} else {
				const options = {
					"format": 'A4',
					"orientation": orientation
				};
				pdf.create(data, options).toStream((err, stream) => {
					if (err) {
                           console.log('err.message2', err.message)
						reject(new Error('unknown', err.message));
					} else {
						const chunks = [];
						stream.on('data', chunk => {
							chunks.push(chunk);
						});
						stream.on('end', () => {
							const result = Buffer.concat(chunks);
							const base64 = result.toString('base64');
							const datauri = 'data:application/pdf;base64,' + base64;
							resolve(datauri);
						});
					}
				});
			}
		});
	});
}
