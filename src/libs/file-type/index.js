// exports.fileTypeFromBuffer = (data) => {
//     return socketConvertBinary.emit('emit', {
//         path: 'convert',
//         data,
//     }).catch(err => {
//         console.error('fileTypeFromBuffer', err)
//         throw err;
//     });
// };

const os = require('os');

let mod;
try {
    if (os.platform() === 'win32') {
        mod = require('./win32');
    } else {
        mod = require('file-type');
    }
} catch (err) {
    mod = {};
    console.error(`Can't load .node module`, err);
}

module.exports = mod;
