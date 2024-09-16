// <editor-fold defaultstate="collapsed" desc="createDoc">
/**
 * Creates a new document in Google Drive.
 *
 * @param {string} title - The title of the new document.
 * @returns {Promise<{data: string}> | null} - A promise that resolves to the file ID of the created document or null if the title is not provided.
 */
exports.createDoc = async (title) => {
	if (!title)
		return;

	return authorize().then(auth => {
		const drive = google.drive({auth, version: 'v3'});
		return DriveUtils.createDoc(drive, title).then(data => data && ({data}));//fileId
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="editDoc">
/**
 * Edits a document in Google Drive based on its path.
 *
 * @param {string} path - The path of the document to edit.
 * @returns {Promise<DriveUtils.File> | null} - A promise that resolves to the document file object or null if the path is not provided.
 */
exports.editDoc = async (path) => {
	if (!path)
		return;

	return authorize().then(auth => {
		console.log("Step 1: editFile", path);
		const drive = google.drive({auth, version: 'v3'});
//
//            drive.files.list({
////              q: "mimeType = 'application/msword'",
////              pageSize: 100,
//                fields: 'nextPageToken, files(id, name)',
//            }, (err, res) => {
//                if (err) {
//                    return console.log('The API returned an error: ' + err);
//                }
//                const files = res.data.files;
//                console.log('publishDriveFile files', JSON.stringify(files))
//                if (files.length) {
//                    files.forEach(f => {
//                        drive.files.delete({
//                            fileId: f.id,
//                            fields: 'nextPageToken, files(id, name)',
//                        }, (err, res) => {
//                            if (err) {
//                                return console.log('The API returned an error: ' + err);
//                            }
//                            console.log('publishDriveFile deleted', JSON.stringify(res.data))
//                        });
//                    });
//                } else {
//                    console.log('No files found.');
//                }
//            });
//            return null;
		return DriveUtils.getDriveFileByPath(drive, path);
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="editDocTitle">
/**
 * Updates the title of an existing document in Google Drive.
 *
 * @param {Object} body - The request body.
 * @param {string} body.fileId - The ID of the document to update.
 * @param {string} body.title - The new title for the document.
 * @returns {Promise<string> | null} - A promise that resolves to the file ID of the updated document or null if the fileId or title is not provided.
 */
exports.editDocTitle = async (body) => {
	if (!body) return;

	const {fileId, title} = body;
	if (!fileId || !title)
		return;

	return authorize().then(auth => {
		console.log("Step 1: editDocTitle", fileId, title);
		const drive = google.drive({auth, version: 'v3'});

		return DriveUtils.updateDocTitle(drive, fileId, title);//fileId
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="updateDocUpload">
/**
 * Updates the document with a new file upload from Google Cloud Storage.
 *
 * @param {Object} body - The request body.
 * @param {string} body.fileId - The ID of the document to update.
 * @param {string} body.gcsUri - The Google Cloud Storage URI of the new file.
 * @param {string} body.type - The type of the file being uploaded.
 * @returns {Promise<string> | null} - A promise that resolves to the file ID of the updated document or null if fileId, gcsUri, or type is not provided.
 */
exports.updateDocUpload = async (body) => {
	if (!body) return;

	const {fileId, gcsUri, type} = body;
	if (!fileId || !gcsUri || !type)
		return;

	return authorize().then(auth => {
		console.log("Step 1: updateDocUpload", fileId, gcsUri, type);
		const drive = google.drive({auth, version: 'v3'});
		return DriveUtils.updateRemotePathToDrive(drive, fileId, gcsUri, type);//fileId
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="removeDoc">
/**
 * Removes a document from Google Drive based on its ID.
 *
 * @param {string} id - The ID of the document to remove.
 * @returns {Promise<string> | null} - A promise that resolves to the file ID of the removed document or null if the ID is not provided.
 */
exports.removeDoc = async (id) => {
	if (!id) return;

	return authorize().then(auth => {
		const drive = google.drive({auth, version: 'v3'});
		return DriveUtils.removeDoc(drive, id);//fileId
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="viewDoc">
/**
 * Retrieves a document from Google Drive based on its path.
 *
 * @param {string} path - The path of the document to view.
 * @returns {Promise<DriveUtils.File> | null} - A promise that resolves to the document file object or null if the path is not provided.
 */
exports.viewDoc = async (path) => {
	if (!path) return;

	return authorize().then(auth => {
		const drive = google.drive({auth, version: 'v3'});
		return DriveUtils.getDriveFileByPath(drive, path);//fileId
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="wordPreviewUrl">
/**
 * Generates a preview URL for a Word document.
 *
 * @param {string} dataUrl - The data URL of the Word document.
 * @returns {Promise<string> | null} - A promise that resolves to the preview URL of the Word document or null if the dataUrl is not provided.
 */
exports.wordPreviewUrl = async (dataUrl) => {
	if (!dataUrl) return;

	return authorize().then(auth => {
		return wordPreviewUrl(dataUrl);
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="excelPreviewUrl">
/**
 * Generates a preview URL for an Excel document.
 *
 * @param {string} dataUrl - The data URL of the Excel document.
 * @returns {Promise<string> | null} - A promise that resolves to the preview URL of the Excel document or null if the dataUrl is not provided.
 */
exports.excelPreviewUrl = async (dataUrl) => {
	if (!dataUrl) return;

	return authorize().then(auth => {
		return excelPreviewUrl(dataUrl);
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="pptPreviewUrl">
/**
 * Generates a preview URL for a PowerPoint document.
 *
 * @param {string} dataUrl - The data URL of the PowerPoint document.
 * @returns {Promise<string> | null} - A promise that resolves to the preview URL of the PowerPoint document or null if the dataUrl is not provided.
 */
exports.pptPreviewUrl = async (dataUrl) => {
	if (!dataUrl) return;

	return authorize().then(auth => {
		return pptPreviewUrl(dataUrl);
	});
};
// </editor-fold>
