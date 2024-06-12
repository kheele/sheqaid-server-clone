const {JsExcelTemplate} = require("../../../libs/JsExcelTemplate");
const path = require("path");

//<editor-fold desc="exportExcelImpl">
module.exports = (
	{
		currDir,
		name,
		mapRow,
		findByIdImpl,
	}
) => {
	return async (socket, data) => {
		if(!data) return;
		
		console.log('exportExcelOne', data);
		
		const filename = path.join(currDir, `xlsx/${name}.xlsx`)
		const template = await JsExcelTemplate.fromFile(filename);
		
		const {
			date,
			//
			client: _client, project: _project, site: _site,
			//
			department,
			job_position,
			supervisor,
			//
			id,
		} = data;
		
		const item = await findByIdImpl(socket, id);
		const attrs = mapRow(item);
		
		template.set('id', id);
		template.set('date', date);
		
		template.set('company', _client ? _client.name || _client.data.name : "ANY");
		template.set('project', _project ? _project.name || _project.data.name : "ANY");
		template.set('site', _site ? _site.name || _site.data.name : "ANY");
		
		Object.keys(attrs).forEach(key => {
			const val = attrs[key];
			if((key === "client" || key === "project" || key === "site") && !val) {
				return;
			}
			template.set(key, val);
		});
		
		const buffer = await template.toBuffer();
		const base64 = buffer.toString('base64');
		return `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
	};
}
//</editor-fold>
