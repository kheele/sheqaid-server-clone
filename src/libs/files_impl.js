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

const {ENDPOINT_FILE_UPLOADER} = process.env;

exports.createFaceUrl = (uid) => `faces/${uid}/face.png`;

//<editor-fold desc="uploadFile">
const createBuffer = (datauri_or_buffer) => {
    if (typeof datauri_or_buffer === 'string') {
        const parts = datauri_or_buffer.split(',');
        const base64 = parts[1];
        return Buffer.from(base64, 'base64');
    } else {
        return Buffer.from(datauri_or_buffer);
    }
};

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

global.uploadFile = async (doc, filePath) => {
    if(doc.buffer) {
        // console.log('doc.buffer', doc.buffer);
        try{
            doc.buffer = Buffer.from(doc.buffer.data);
        } catch (err) {
            doc.buffer = Buffer.from(doc.buffer);
        }
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

    const new_name = `docs-office-preview/excel`;
    return uploadFile(dataUrl, new_name);
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

    const {buffer} = doc;
    if (buffer) {
        key = key || 'doc';

        attrs[key] = await uploadFile(doc, new_name);
    }

    if (Object.keys(attrs).isNotEmpty()) {
        await onUpdate({id, ...attrs});
    }
};
//</editor-fold>
