// <editor-fold defaultstate="collapsed" desc="createDoc">
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
exports.removeDoc = async (id) => {
	if (!id) return;

	return authorize().then(auth => {
		const drive = google.drive({auth, version: 'v3'});
		return DriveUtils.removeDoc(drive, id);//fileId
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="viewDoc">
exports.viewDoc = async (path) => {
	if (!path) return;

	return authorize().then(auth => {
		const drive = google.drive({auth, version: 'v3'});
		return DriveUtils.getDriveFileByPath(drive, path);//fileId
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="wordPreviewUrl">
exports.wordPreviewUrl = async (dataUrl) => {
	if (!dataUrl) return;

	return authorize().then(auth => {
		return wordPreviewUrl(dataUrl);
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="excelPreviewUrl">
exports.excelPreviewUrl = async (dataUrl) => {
	if (!dataUrl) return;

	return authorize().then(auth => {
		return excelPreviewUrl(dataUrl);
	});
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="pptPreviewUrl">
exports.pptPreviewUrl = async (dataUrl) => {
	if (!dataUrl) return;

	return authorize().then(auth => {
		return pptPreviewUrl(dataUrl);
	});
};
// </editor-fold>
