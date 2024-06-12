const mime = require('mime');

eventManager.on("ms-docs-preview/upload", async (socket, file) => {
	if (!file) return;

	console.log('ms-docs-preview/upload', file)

	const { contentType } = file;

	const fn = isFileType(contentType, ['doc', 'docx']) ?
		wordPreviewUrl : isFileType(contentType, ['xsl', 'xslx']) ?
			excelPreviewUrl : isFileType(contentType, ['ppt', 'pptx']) ?
				pptPreviewUrl :
				null;
	if (fn) {
		const res = await fn(file);
		if (res) {
			res.dlUrls[0] = `https://storage.googleapis.com/${res.gcsUri.split('gs://')[1]}`;
			return res;
		}
	}
});

function isFileType(contentType, exts) {
	if (!contentType || !exts || !isArray(exts))
		return false;
	return exts.map(ext => ext.startsWith('.') ? ext : ('.' + ext)).anyMatch(ext => {
		return mime.getExtension(contentType) === ext.substring(1) || mime.getType(ext) === contentType;
	});
}