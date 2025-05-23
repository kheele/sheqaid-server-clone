// <editor-fold defaultstate="collapsed" desc="imports">
// const { fileTypeFromBuffer } = require('./file-type');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const os = require('os');
const mime = require('mime');
const {Readable} = require('stream');
// const faceapi = require('face-api.js');
// const canvas = require('canvas');
// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
// const {Canvas, Image, ImageData} = canvas;
// faceapi.env.monkeyPatch({Canvas, Image, ImageData});
// </editor-fold>

exports.createFaceUrl = (uid) => `faces/${uid}/face.png`;

const getContentType = (datauri_or_buffer) => {
    // if (typeof datauri_or_buffer === 'string') {
    const parts = datauri_or_buffer.split(',');
    return parts[0].replace('data:', '').split(';')[0];
    // } else {
    // 	try {
    // 		const res = await fileTypeFromBuffer(datauri_or_buffer);
    // 		return res.contentType;
    // 	} catch (err) {
    // 		console.log('getContentType err', err);
    // 	}
    // }
};

function isBuffer(buffer) {
    try {
        return !!Buffer.from(buffer.data);
    } catch (err) {
        try {
            return !!Buffer.from(buffer);
        } catch (err) {
            return false;
        }
    }
}

function extractFileBuffer(buffer) {
    if (buffer && typeof buffer === 'object') {
        if (isBuffer(buffer)) {
            return buffer;
        }

        const keys = Object.keys(buffer);
        for (let n = 0; n < keys.length; n++) {
            const key = keys[n];
            console.log(key);
            let result = extractFileBuffer(buffer[key]);
            if (result) return result;
        }
    }
    return null;
}

//<editor-fold desc="uploadFile">
global.uploadFile = async (doc, filePath) => {
    if (doc.buffer || (doc.path && doc.path.buffer)) {
        if (doc.path && doc.path.buffer) {
            doc.buffer = doc.path;
        }

        doc.buffer = extractFileBuffer(doc.buffer);
    }

    console.log('uploadFile doc.buffer', typeof doc.buffer, doc.buffer instanceof Buffer);

    return socketFileUploader.emit('emit', {
        path: 'uploadFile',
        data: [doc, filePath],
    }).then(res => {
        console.log('uploadFile res', res);
        return res;
    });
};
// global.uploadFile = async (doc, filePath) => {
//     const contentType = isString(doc) ? getContentType(doc) : doc.contentType;
//     const filename = doc.filename;
//
//     let file;
//     if (isString(doc)) {
//         file = doc;
//     } else {
//         if (doc.buffer || (doc.path && doc.path.buffer)) {
//             if (doc.path && doc.path.buffer) {
//                 doc.buffer = doc.path;
//             }
//
//             doc.buffer = extractFileBuffer(doc.buffer);
//         }
//
//         try {
//             file = Buffer.from(doc.buffer.data);
//         } catch (err) {
//             file = Buffer.from(doc.buffer);
//         }
//     }
//
//     const ext = mime.getExtension(contentType);
//     console.log('uploadFile', filename, ext, contentType);
//
//     const options = {
//         resumable: false,
//         metadata: {
//             contentType,
//         }
//     };
//
//     const newName = `${filePath}/${filename || `${new Date().getTime()}-doc.${ext}`}`;
//
//     const storageBucket = adminStorage.bucket(DEFAULT_BUCKET);
//     let bucketFile = await storageBucket.file(newName);
//     return bucketFile.save(file, options).then(async () => {
//         const gcsUri = "gs://" + DEFAULT_BUCKET + "/" + newName;
//         const dlUrls = await bucketFile.getSignedUrl({
//             action: 'read',
//             expires: '03-17-2099',
//         });
//         return {gcsUri, dlUrls};
//     });
// };
//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="loadFaceModels">
exports.loadFaceModels = () => {
    return Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromDisk('./models'),
        faceapi.nets.faceLandmark68Net.loadFromDisk('./models'),
        //detectors
        faceapi.nets.ssdMobilenetv1.loadFromDisk('./models'),
        faceapi.nets.tinyFaceDetector.loadFromDisk('./models'),
        faceapi.nets.mtcnn.loadFromDisk('./models'),
        //others
        //        faceapi.nets.faceLandmark.loadFromDisk('./models'),
        //        faceapi.nets.faceLandmarkTinyModel.loadFromDisk('./models'),
        //        faceapi.nets.faceRecognition.loadFromDisk('./models'),
        //        faceapi.nets.faceExpression.loadFromDisk('./models')

        //        faceapi.nets.faceRecognitionNet.loadFromDisk('./models'),
        //        faceapi.nets.faceLandmark68Net.loadFromDisk('./models'),
        //        faceapi.nets.ssdMobilenetv1.loadFromDisk('./models')
    ]);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="loadImage">
exports.loadImage = async (bucketFile, uid) => {
    const tempFile = path.join(os.tmpdir(), `faces-${uid}-face.png`);
    await new Promise((resolve, reject) => {
        bucketFile.createReadStream().on('error', (err) => {
            reject(err);
        }).on('response', (res) => {
            // Server connected and responded with the specified status and headers.
        }).on('end', () => {
            // The file is fully downloaded.
            resolve();
        }).pipe(fs.createWriteStream(tempFile));
    });

    const userImage = await canvas.loadImage(tempFile);
    return userImage;
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="deleteTmpImage">
exports.deleteTmpImage = (uid) => {
    const tempFile = path.join(os.tmpdir(), `faces-${uid}-face.png`);
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
// </editor-fold>

//<editor-fold desc="wordPreviewUrl">
global.wordPreviewUrl = async (dataUrl) => {
    // console.log('wordPreviewUrl', dataUrl)
    if (!dataUrl)
        throw new Error('No source file supplied.');

    const new_name = `docs-office-preview/docx`;
    return uploadFile(dataUrl, new_name);
};
//</editor-fold>

//<editor-fold desc="excelPreviewUrl">
global.excelPreviewUrl = async (dataUrl) => {
    // console.log('excelPreviewUrl', dataUrl)
    if (!dataUrl)
        throw new Error('No source file supplied.');

    const filePath = `docs-office-preview/excel`;
    return uploadFile(dataUrl, filePath);
};
//</editor-fold>

//<editor-fold desc="pptPreviewUrl">
global.pptPreviewUrl = async (dataUrl) => {
    // console.log('pptPreviewUrl', dataUrl)
    if (!dataUrl)
        throw new Error('No source file supplied.');

    const new_name = `docs-office-preview/ppt`;
    return uploadFile(dataUrl, new_name);
};
//</editor-fold>

//<editor-fold desc="uploadFilesUpdate">
global.uploadFilesUpdate = async ({id, doc, key, new_name, onUpdate}) => {
    if (!doc || !new_name) {
        return;
    }

    const attrs = {};

    // console.log('uploadFilesUpdate', doc);

    const {path, buffer} = doc;
    if (buffer || path) {
        if (path) {
            delete doc.path;
            if (path.buffer) {
                doc = path;
            } else if (isString(path)) {
                doc.buffer = Buffer.from(path);
                doc.contentType = path.split(';')[0].split(':')[1];
            }
        }
        key = key || 'doc';

        attrs[key] = await uploadFile(doc, new_name);
    }

    if (Object.keys(attrs).isNotEmpty() && onUpdate) {
        return await onUpdate({id, ...attrs});
    }
};
//</editor-fold>
