const mime = require('mime');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const Excel = require('exceljs');

const createExcelFileSheets = async (data) => {
	if (!data) {
		return null;
	}

	const {folder, fileName, sheets = []} = data;

	const date = new Date();
	const dir = path.join(os.homedir(), "Documents", "SHEQAid", folder, Dates.formatDate(date));

	// Make sure the output directory is there.
	fs.ensureDirSync(dir);
	const options = {
		filename: path.join(dir, fileName),
		useStyles: true,
		useSharedStrings: true
	};

	const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
	workbook.creator = 'SHEQ Aid';
	workbook.lastModifiedBy = 'SHEQ Aid';
	workbook.created = date;
	workbook.modified = date;
	workbook.lastPrinted = date;
//    workbook.properties.date1904 = true;
//    workbook.calcProperties.fullCalcOnLoad = true;

	sheets.forEach((sheet) => {
		const {sheetName, columns, rows} = sheet;
		const worksheet = workbook.addWorksheet(sheetName, {properties: {tabColor: {argb: 'FFC0000'}}});
		worksheet.columns = columns;
		const header = worksheet.getRow(1);
		header.fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: {argb: 'cccccc'}
		};

		const lastCell = header.getCell(columns.length - 1);
		// worksheet.autoFilter = `A1:${lastCell.address}`;

		rows.forEach((row, n) => {
//                if (row.addImage) {
//                    const image = row.addImage();
//                    const imageId = workbook.addImage(image.file);
//                    const col = columns.find(col => col.key === image.col);
//                    const colIdx = columns.indexOf(col);
//                    worksheet.addImage(imageId, {
//                        tl: {col: colIdx, row: n},
//                        ext: {width: 100, height: 100}
//                    });
//                    console.log('image', image, col, colIdx, n)
////                    worksheet.addRow(row).commit();
//                } else {
			worksheet.addRow(row).commit();
//                }
		});

		worksheet.commit();
	});

	await workbook.commit();

	const {filename} = options;
	//read then file then delete it
	const base64 = fs.readFileSync(filename, {encoding: 'base64'});
	const dataUri = `data:${mime.getType(filename)};base64,${base64}`;
	deleteTmpFile(filename);

	// console.log('filename', filename, `data:${mime.getType(filename)};`)

	return dataUri;
};
exports.createExcelFileSheets = createExcelFileSheets;

const createExcelFile = async (data) => {
	if (!data) {
		return null;
	}

	const {folder, fileName, sheetName, columns, rows} = data;

//     const date = new Date();
//     const dir = path.join(os.homedir(), "Documents", "SHEQAid", folder, fileName, Dates.formatDate(date));
//
//     // Make sure the output directory is there.
//     fs.ensureDirSync(dir);
//     const options = {
//         filename: path.join(dir, fileName),
//         useStyles: true,
//         useSharedStrings: true
//     };
//
//     const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
//     workbook.creator = 'SHEQ Aid';
//     workbook.lastModifiedBy = 'SHEQ Aid';
//     workbook.created = new Date();
//     workbook.modified = new Date();
//     workbook.lastPrinted = new Date();
// //    workbook.properties.date1904 = true;
// //    workbook.calcProperties.fullCalcOnLoad = true;

//     const worksheet = workbook.addWorksheet(sheetName, {properties: {tabColor: {argb: 'FFC0000'}}});
//     worksheet.columns = columns;
//     const header = worksheet.getRow(1);
//     header.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: {argb: 'cccccc'}
//     };
//
//     const lastCell = header.getCell(columns.length - 1);
//     worksheet.autoFilter = `A1:${lastCell.address}`;
//
//     rows.forEach((row, n) => {
// //                if (row.addImage) {
// //                    const image = row.addImage();
// //                    const imageId = workbook.addImage(image.file);
// //                    const col = columns.find(col => col.key === image.col);
// //                    const colIdx = columns.indexOf(col);
// //                    worksheet.addImage(imageId, {
// //                        tl: {col: colIdx, row: n},
// //                        ext: {width: 100, height: 100}
// //                    });
// //                    console.log('image', image, col, colIdx, n)
// ////                    worksheet.addRow(row).commit();
// //                } else {
//         worksheet.addRow(row).commit();
// //                }
//     });
//
//     worksheet.commit();

	return createExcelFileSheets({folder, fileName, sheets: [{sheetName, columns, rows}]});

	// await workbook.commit();
	//
	// const {filename} = options;
	// //read then file then delete it
	// const base64 = fs.readFileSync(filename, {encoding: 'base64'});
	// const dataUri = `data:${mime.getType(filename)};base64,${base64}`;
	// deleteTmpFile(filename);
	//
	// return dataUri;
};
exports.createExcelFile = createExcelFile;

exports.onReadAsJson = async (data) => {
	if (!data) {
		return null;
	}

	const {path, validHeaderNames} = data;

//    console.log('path', path)
	const base64 = path.split(',')[1];
//    console.log('base64', base64)
	const buffer = Buffer.from(base64, 'base64');//data_url
//    console.log('buffer', buffer)
	const workbook = new Excel.Workbook();
	let rows = await workbook.xlsx.load(buffer).then(async () => {
		const worksheet = workbook.model.sheets[0];
//                console.log('workbook', workbook)
//                console.log('worksheet', worksheet)
		return worksheet.rows;
	});

	rows = rows.filter(({cells}) => 'value' in cells[0]).map(({number, cells}) => {
		const row = {};
		cells.forEach((cell) => {//{address, type, value, hyperlink, text}
			let {address, type, value, hyperlink} = cell;
			// console.log('cell', cell)
			if (hyperlink) {
				hyperlink = hyperlink.replace('mailto:', '');
			}
			row[address] = {address, type, value: value || hyperlink};
		});
		return row;
	});

	const cols = rows.slice(0, 1)[0];

	const errors = getExcelHeaderErrors(cols, validHeaderNames);
	if (!errors.isEmpty()) {
		return {errors};
	}

	rows = rows.slice(1);

	// console.log('onReadAsJson', rows)

	return convertExcelToJson(cols, rows, validHeaderNames);
};

const deleteTmpFile = (tempFile) => {
	fs.stat(tempFile, (err, stats) => {
		if (err) {
			return console.error(err);
		}
		fs.unlink(tempFile, (err) => {
			if (err)
				return console.error(err);
		});
	});
};

const convertExcelToJson = (cols, rows, validHeaderNames) => {
	createExcelHeaderColsKeys(cols, validHeaderNames);
	const colsKeys = Object.keys(cols).filter(k => {
		return !!cols[k].key;
	});

	const getRowVal = row => {
		const res = {};
		const keys = Object.keys(row);
		for (let n = 0; n < colsKeys.length; n++) {//{A1: {key: ?, address: "A1", type: 3, value: "Company Number"}}
			const colKey = colsKeys[n];//A1
			const {type, key} = cols[colKey];//{key: ?, address: "A1", type: 3, value: "Company Number"}

			// console.log('type', type)//

			const rowKey = keys.find(k => k.charAt(0) === colKey.charAt(0));
			if(key === 'document_list') {
				// console.log('type', type, key, keys, colKey)
			}
			if (rowKey) {
				const {value: row_value} = row[rowKey];//{address: "A2", type: 3, value: ""}
				if (key === 'email') {
					// console.log(rowKey, row_value, row[rowKey], row)
				}
				if (isString(row_value)) {
					res[key] = row_value.toTitleCase();
				} else {
					res[key] = row_value;
				}
//                        console.log(colKey, key, rowKey, row_value)
			}
		}
		return res;
	};

	return rows.map(getRowVal);
};

const createExcelHeaderColsKeys = (cols, validHeaderNames) => {
	const colsKeys = Object.keys(cols);

	for (let n = 0; n < validHeaderNames.length; n++) {
		const validHeaderName = validHeaderNames[n];
		let {key: headerKey, value: headerValues, required} = validHeaderName;
		if(!isArray(headerValues)) {
			headerValues = [headerValues];
		}

		const colFoundKey = colsKeys.find(key => {
			const colsVal = cols[key];
			return headerValues.anyMatch(v => {
				return colsVal.value && colsVal.value.toLowerCase() === v.toLowerCase();
			});
		});
		if (colFoundKey) {
			const colsVal = cols[colFoundKey];
			colsVal.key = headerKey;
		}
	}
};

const getExcelHeaderErrors = (cols, validHeaderNames) => {
	const colsKeys = Object.keys(cols);

	let errors = [];
	for (let n = 0; n < validHeaderNames.length; n++) {
		const validHeaderName = validHeaderNames[n];
		let {key: headerKey, value: headerValues, required} = validHeaderName;
		if(!isArray(headerValues)) {
			headerValues = [headerValues];
		}

		const colFoundKey = colsKeys.find(key => {
			const colsVal = cols[key];
			return headerValues.anyMatch(v => {
				return colsVal.value && colsVal.value.toLowerCase() === v.toLowerCase();
			});
		});
		if (!colFoundKey && required) {
			errors.push(validHeaderName);
		}
	}

	return errors;
};