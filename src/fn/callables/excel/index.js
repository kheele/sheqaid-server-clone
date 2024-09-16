const express = require('express');
const router = express.Router();

const {
    createExcelFileSheets,
    createExcelFile,
    onReadAsJson,
} = require('./api.js');

/**
 * @route POST /createExcelFileSheets
 * @desc Creates an Excel file with multiple sheets based on the provided data.
 * @param {Object} req.body - The data to create the Excel file.
 * @param {string} req.body.folder - The folder path where the file will be saved.
 * @param {string} req.body.fileName - The name of the Excel file to create.
 * @param {Array<Object>} req.body.sheets - An array of sheet objects to include in the file.
 * @param {string} req.body.sheets.sheetName - The name of the sheet.
 * @param {Array<Object>} req.body.sheets.columns - The columns configuration for the sheet.
 * @param {Array<Array>} req.body.sheets.rows - The rows data for the sheet.
 * @returns {Object} - A JSON object containing the data URI of the created Excel file.
 */
router.post('/createExcelFileSheets', async (req, res) => {
    await authorize();

    const data = await createExcelFileSheets(req.body);
    res.json(data);
});

/**
 * @route POST /createExcelFile
 * @desc Creates an Excel file with a single sheet based on the provided data.
 * @param {Object} req.body - The data to create the Excel file.
 * @param {string} req.body.folder - The folder path where the file will be saved.
 * @param {string} req.body.fileName - The name of the Excel file to create.
 * @param {string} req.body.sheetName - The name of the sheet.
 * @param {Array<Object>} req.body.columns - The columns configuration for the sheet.
 * @param {Array<Array>} req.body.rows - The rows data for the sheet.
 * @returns {Object} - A JSON object containing the data URI of the created Excel file.
 */
router.post('/createExcelFile', async (req, res) => {
    await authorize();

    const data = await createExcelFile(req.body);
    res.json(data);
});

/**
 * @route POST /onReadAsJson
 * @desc Reads an Excel file from a base64 encoded data URL and converts it to JSON format.
 * @param {Object} req.body - The data to read and convert.
 * @param {string} req.body.path - The base64 encoded data URL of the Excel file.
 * @param {Array<Object>} req.body.validHeaderNames - An array of valid header names for validation.
 * @returns {Object} - A JSON object containing the converted JSON data or validation errors.
 */
router.post('/onReadAsJson', async (req, res) => {
    await authorize();

    const data = await onReadAsJson(req.body);
    res.json(data);
});

module.exports = router;

