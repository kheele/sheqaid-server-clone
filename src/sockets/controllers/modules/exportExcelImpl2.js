const {JsExcelTemplate} = require("../../../libs/JsExcelTemplate");
const path = require("path");
const listByLoggedImpl = require("./listByLoggedImpl");

//<editor-fold desc="exportExcelImpl">
module.exports = (config) => {
    return async (socket, data) => {
        if (!data) return;

        const {
            currDir,
            name,
            mapRow,
        } = config;

        console.log('exportExcel', data);

        const filename = `${name}.xlsx`;
        const filepath = path.join(currDir, `xlsx/${filename}`)
        const template = await JsExcelTemplate.fromFile(filepath);

        const {
            date,
            //
            client: _client, project: _project, site: _site,
            //
            department,
            job_position,
            supervisor,
        } = data;

        const listByLogged = listByLoggedImpl(config);

        const list = await listByLogged(socket, data);
        const rows = list.map(mapRow).map((item, idx) => ({idx, ...item}));

        template.set('date', date);

        template.set('company', _client ? _client.name || _client.data.name : "ANY");
        template.set('project', _project ? _project.name || _project.data.name : "ANY");
        template.set('site', _site ? _site.name || _site.data.name : "ANY");
        template.set('department', department ? department.name || department.data.name : "ANY");

        template.set("rows", rows);

        const buffer = await template.toBuffer();
        const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        return await excelPreviewUrl({buffer, contentType, filename});
    };
}
//</editor-fold>
