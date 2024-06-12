const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();
const DEFAULT_BUCKET = 'sheqsolve.appspot.com';
const bucket = storage.bucket(DEFAULT_BUCKET);

class DriveUtils {

	static async createDocFromHTML(drive, name, text) {
		const fileMetadata = {
			name: name || "Untitled",
			mimeType: "application/vnd.google-apps.document",
//            mimeType: 'text/html'
		};
//        const file = new Blob([text], {type: 'text/html'});
		return drive.files.create({
			resource: fileMetadata,
			media: {
				mimeType: 'text/html',
				body: text
			},
			hasThumbnail: false,
			copyRequiresWriterPermission: true,
			writersCanShare: false,
			capabilities: {
				canChangeCopyRequiresWriterPermission: false,
				canChangeViewersCanCopyContent: false,
				canComment: true,
				canCopy: false,
				canDelete: false,
				canDownload: false,
				canEdit: true,
				canModifyContent: true,
				canModifyContentRestriction: false,
				canRename: true,
				canShare: false,
				canTrash: false
			}
		}).then(res => {
			console.log('createDocFromHTML', JSON.stringify(res.data))
			return DriveUtils.shareDriveFile(drive, res.data);
		});
	}

	static async createDocFromUrl(drive, name, url) {
		const res = await fetch(url);
		const fileMetadata = {
			name: name || "Untitled",
			mimeType: "application/vnd.google-apps.document"
		};
		return drive.files.create({
			resource: fileMetadata,
			media: {
				body: res.blob()
			},
			hasThumbnail: false,
			copyRequiresWriterPermission: true,
			writersCanShare: false,
			capabilities: {
				canChangeCopyRequiresWriterPermission: false,
				canChangeViewersCanCopyContent: false,
				canComment: true,
				canCopy: false,
				canDelete: false,
				canDownload: false,
				canEdit: true,
				canModifyContent: true,
				canModifyContentRestriction: false,
				canRename: true,
				canShare: false,
				canTrash: false
			}
		}).then(res => {
			console.log('createDocFromUrl', JSON.stringify(res.data))
			return DriveUtils.shareDriveFile(drive, res.data);
		});
	}

	static async createDoc(drive, name) {
		const fileMetadata = {
			name: name || "Untitled",
			mimeType: "application/vnd.google-apps.document"
		};
		return drive.files.create({
			resource: fileMetadata,
			hasThumbnail: false,
			copyRequiresWriterPermission: true,
			writersCanShare: false,
			capabilities: {
				canChangeCopyRequiresWriterPermission: false,
				canChangeViewersCanCopyContent: false,
				canComment: true,
				canCopy: false,
				canDelete: false,
				canDownload: false,
				canEdit: true,
				canModifyContent: true,
				canModifyContentRestriction: false,
				canRename: true,
				canShare: false,
				canTrash: false
			}
		}).then(res => {
			console.log('createDoc', JSON.stringify(res.data))
			return DriveUtils.shareDriveFile(drive, res.data);
		});
	}

	static async updateDoc(drive, fileId, remoteFile) {
		if ('gcsUri' in remoteFile) {
			let remoteFileName = getFilename(remoteFile);
			remoteFile = await bucket.file(remoteFileName);
		}
		return drive.files.update({
			fileId,
			media: {
				body: remoteFile.createReadStream()
			},
			fields: 'id'
		}).then(res => {
			console.log('updateDoc', fileId, JSON.stringify(res.data))
			return fileId;
		});
	}

	static async updateDocAndDeleteRemote(drive, fileId, remoteFile) {
		return DriveUtils.updateDoc(drive, fileId, remoteFile).then(fileId => {
			return remoteFile.delete().then(() => {
				console.log('updateDocAndDeleteRemote', fileId)
				return fileId;
			});
		});
	}

	static async updateDocTitle(drive, fileId, title) {
		const fileMetadata = {
			name: title
		};
		return drive.files.update({
			fileId,
			resource: fileMetadata,
			fields: 'id'
		}).then(res => {
			console.log('updateDocTitle', fileId, JSON.stringify(res.data))
			return fileId;
		});
	}

	static async updateDocFirestoreId(drive, fileId, id) {
		return drive.files.update({
			fileId,
			body: {
				appProperties: {
					id
				}
			},
			fields: 'id'
		}).then(res => {
			console.log('updateDocFirestoreId', fileId, JSON.stringify(res.data))
			return fileId;
		});
	}

	static async removeDoc(drive, fileId) {
		return drive.files.delete({
			fileId,
			fields: 'id'
		}).then(res => {
			console.log('removeDoc', fileId)
			return fileId;
		}).catch(err => {
			return err;
		});
	}

	static async shareDriveFile(drive, driveFile) {
		console.log("shareDriveFile", driveFile.id);
		return drive.permissions.create({
			resource: {
				'role': 'writer',
				'type': 'anyone',
//                        'type': 'domain',
//                        'domain': "sheqsolve.web.app"
			},
			fileId: driveFile.id,
			sendNotificationEmail: false,
			fields: 'id'
		}).then(res => {
			return driveFile;
		});
	}

	//link to cloud storage
	static async getDriveFileByPath(drive, remoteFilePath) {
		let remoteFileName = getFilename(remoteFilePath);
		remoteFileName = remoteFileName.replace(".pdf", "").replace(".docx", "").replace(".doc", "");
		console.log("getDriveFileByPath 1", remoteFileName);
		return drive.files.list({
			maxResults: 1,
			q: `appProperties has {key='remoteFileName' and value='${remoteFileName}'}`,
			fields: 'files(id, name)'
		}).then(res => {
			const files = res.data.files;
			if (files.length > 0) {
				return files[0];
			} else {
				return DriveUtils.saveRemotePathToDrive(drive, remoteFilePath);
			}
		}).then(driveFile => {
			console.log('getDriveFileByPath 2', JSON.stringify(driveFile))
			return DriveUtils.shareDriveFile(drive, driveFile);
		});
	}

	static async saveRemotePathToDrive(drive, remotePath) {
		let remoteFileName = getFilename(remotePath);
		const remoteFile = await bucket.file(remoteFileName);
		remoteFileName = remoteFileName.replace(".pdf", "").replace(".docx", "").replace(".doc", "");

		const name = remoteFile.name.split('\\').pop().split('/').pop();

		console.log("saveRemotePathToDrive", remoteFile.name, name);
		const fileMetadata = {
			name,
//            mimeType: "application/vnd.google-apps.document",
			appProperties: {
				remoteFileName
			}
		};
		return drive.files.create({
			resource: fileMetadata,
			media: {
				body: remoteFile.createReadStream()
			},
			fields: 'id'
		}).then(res => {
			return DriveUtils.getDriveFileByPath(drive, remotePath);
		});
	}

	static async updateRemotePathToDrive(drive, fileId, remotePath, type) {
		let remoteFileName = getFilename(remotePath);
		const remoteFile = await bucket.file(remoteFileName);
//        remoteFileName = remoteFileName.replace(".pdf", "").replace(".docx", "").replace(".doc", "");

		const media = {
			body: remoteFile.createReadStream()
		};

		const mimes = {
			google: 'application/vnd.google-apps.document',
			pdf: 'application/pdf',
			word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		};
		
		console.log('type', type, remoteFileName);
		
		if (type) {
			if(type === 'Type') {
				type = "google";
			} else {
				remoteFileName = remoteFileName.toLowerCase()
				if(remoteFileName.contains(".pdf")) {
					type = "pdf";
				} else if(remoteFileName.contains(".doc") || remoteFileName.contains(".docx")) {
					type = "word";
				} else if(remoteFileName.contains(".xls") || remoteFileName.contains(".xlsx")) {
					type = "excel";
				} else {
					type = "google";//TODO: add other formats
				}
			}
			media.mimeType = mimes[type];
		}

       console.log('updateRemotePathToDrive 2', fileId, media.mimeType);

		return drive.files.update({
			fileId,
//            resource: fileMetadata,
			media,
			fields: 'id'
		}).then(res => {
			console.log('updateRemotePathToDrive success', fileId, JSON.stringify(res.data))
			return fileId;
		}).catch(err => {
			console.log('updateRemotePathToDrive err', fileId, JSON.stringify(err))
			throw err;
		});
	}

	static async downloadAsPDF(drive, fileId) {
		const res = await drive.files.export({fileId, mimeType: "application/pdf"});

		return res;
	}

	//watch file then save it to remote storage
}

function getFilename(gcsUri) {
	if (typeof gcsUri === 'object' && gcsUri.gcsUri) {
		gcsUri = gcsUri.gcsUri;
	}
	if (typeof gcsUri === 'string') {
		return gcsUri.replace("gs://" + DEFAULT_BUCKET + "/", "");
	}
}

module.exports = DriveUtils;
