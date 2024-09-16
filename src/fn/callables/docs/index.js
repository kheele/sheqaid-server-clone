const express = require('express');
const router = express.Router();

const {
	createDoc,
	editDoc,
	editDocTitle,
	updateDocUpload,
	removeDoc,
	viewDoc,
	wordPreviewUrl,
	excelPreviewUrl,
	pptPreviewUrl,
} = require('./api.js');

/**
 * Endpoint to create a new document.
 *
 * @route POST /create
 * @param {Object} req.body - The request body containing the title of the document.
 * @returns {Promise<void>} - Returns a JSON response with the result of the createDoc operation.
 */
router.post('/create', async (req, res) => {
	const data = await createDoc(req.body);
	res.json(data);
});

/**
 * Endpoint to edit an existing document.
 *
 * @route POST /edit
 * @param {Object} req.body - The request body containing the path of the document to edit.
 * @returns {Promise<void>} - Returns a JSON response with the result of the editDoc operation.
 */
router.post('/edit', async (req, res) => {
	const data = await editDoc(req.body);
	res.json(data);
});

/**
 * Endpoint to update the title of an existing document.
 *
 * @route POST /edit-title
 * @param {Object} req.body - The request body containing the fileId and the new title of the document.
 * @returns {Promise<void>} - Returns a JSON response with the result of the editDocTitle operation.
 */
router.post('/edit-title', async (req, res) => {
	const data = await editDocTitle(req.body);
	res.json(data);
});

/**
 * Endpoint to update a document with a new file upload.
 *
 * @route POST /update-upload
 * @param {Object} req.body - The request body containing the fileId, gcsUri, and type of the file to upload.
 * @returns {Promise<void>} - Returns a JSON response with the result of the updateDocUpload operation.
 */
router.post('/update-upload', async (req, res) => {
	const data = await updateDocUpload(req.body);
	res.json(data);
});

/**
 * Endpoint to remove a document from Google Drive.
 *
 * @route POST /remove
 * @param {Object} req.body - The request body containing the ID of the document to remove.
 * @returns {Promise<void>} - Returns a JSON response with the result of the removeDoc operation.
 */
router.post('/remove', async (req, res) => {
	const data = await removeDoc(req.body);
	res.json(data);
});

/**
 * Endpoint to view a document from Google Drive.
 *
 * @route POST /view
 * @param {Object} req.body - The request body containing the path of the document to view.
 * @returns {Promise<void>} - Returns a JSON response with the result of the viewDoc operation.
 */
router.post('/view', async (req, res) => {
	const data = await viewDoc(req.body);
	res.json(data);
});

/**
 * Endpoint to generate a preview URL for a Word document.
 *
 * @route POST /word-preview-url
 * @param {Object} req.body - The request body containing the data URL of the Word document.
 * @returns {Promise<void>} - Returns a JSON response with the result of the wordPreviewUrl operation.
 */
router.post('/word-preview-url', async (req, res) => {
	const data = await wordPreviewUrl(req.body);
	res.json(data);
});

/**
 * Endpoint to generate a preview URL for an Excel document.
 *
 * @route POST /excel-preview-url
 * @param {Object} req.body - The request body containing the data URL of the Excel document.
 * @returns {Promise<void>} - Returns a JSON response with the result of the excelPreviewUrl operation.
 */
router.post('/excel-preview-url', async (req, res) => {
	const data = await excelPreviewUrl(req.body);
	res.json(data);
});

/**
 * Endpoint to generate a preview URL for a PowerPoint document.
 *
 * @route POST /ppt-preview-url
 * @param {Object} req.body - The request body containing the data URL of the PowerPoint document.
 * @returns {Promise<void>} - Returns a JSON response with the result of the pptPreviewUrl operation.
 */
router.post('/ppt-preview-url', async (req, res) => {
	const data = await pptPreviewUrl(req.body);
	res.json(data);
});

module.exports = router;

