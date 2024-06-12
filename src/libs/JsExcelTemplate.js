const ExcelJS = require('exceljs');
const {default: JsExcelTemplateBase} = require("js-excel-template");
const path = require("path");

class JsExcelTemplate extends JsExcelTemplateBase {

    constructor() {
        super();
    }

    applyMissingValuesColor() {
        // const redFill = {
        //     type: 'pattern',
        //     pattern: 'solid',
        //     fgColor: { argb: 'FFFF0000' },
        //     bgColor: { argb: 'FFFFFFFF' }
        // };
        //
        // this.workbook.eachSheet((sheet) => {
        //     sheet.eachRow((row, rowNumber) => {
        //         row.eachCell((cell) => {
        //             // const {value} = cell;
        //             // if (value === '-') {
        //             //     cell.fill = redFill;
        //             //     cell.font = { color: { argb: 'FFFFFFFF' } };
        //             // } else {
        //             //     cell.fill = { type: 'none' };
        //             // }
        //         });
        //     });
        // });
    }

    static merge() {
        const template = new JsExcelTemplate()
        template.workbook = new ExcelJS.Workbook();
        return template
    }

    static async fromArrayBuffer(buffer) {
        const template = new JsExcelTemplate()
        await template.workbook.xlsx.load(buffer)
        return template
    }

    static async fromFile(filepath) {
        const template = new JsExcelTemplate()
        await template.workbook.xlsx.readFile(filepath)
        return template
    }

}

exports.JsExcelTemplate = JsExcelTemplate;