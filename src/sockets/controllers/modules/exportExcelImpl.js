const {JsExcelTemplate} = require("../../../libs/JsExcelTemplate");
const path = require("path");

//<editor-fold desc="exportExcelImpl">
module.exports = (config) => {
    return async (socket, data) => {
        if (!data) return;

        const {
            currDir,
            name,
            mapRow,
            listImpl,
        } = config;

        console.log('exportExcel', data);

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
            list: id_list,
        } = data;

        const list = await listImpl(socket, {id_list});
        const rows = list.map(mapRow).map((item, idx) => ({idx, ...item}));

        template.set('date', date);

        template.set('company', _client ? _client.name || _client.data.name : "ANY");
        template.set('project', _project ? _project.name || _project.data.name : "ANY");
        template.set('site', _site ? _site.name || _site.data.name : "ANY");

        template.set("rows", rows);

        const buffer = await template.toBuffer();
        const base64 = buffer.toString('base64');
        return `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    };
}
//</editor-fold>
