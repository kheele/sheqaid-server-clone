const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/x86_64-pc-windows-msvc/:version', async (req, res) => {
    const { version } = req.params;
    const updateFilePath = path.join(__dirname, 'platforms/x86_64-pc-windows-msvc/versions', `${version}.json`);
    res.sendFile(updateFilePath);
});

router.get('/platforms/x86_64-pc-windows-msvc/releases/:version', async (req, res) => {
    const { version } = req.params;
    const name = `SHEQAid_${version}_x64_en-US.msi`;
    const updateFilePath = path.join(__dirname, 'platforms/x86_64-pc-windows-msvc/releases', name);
    // res.download(updateFilePath, name, (err) => {
    //     console.log('err', err)
    // });
    res.attachment(name);
    res.sendFile(updateFilePath);
});

router.get('/platforms/x86_64-pc-windows-msvc/releases/:version/sig', async (req, res) => {
    const { version } = req.params;
    const name = `SHEQAid_${version}_x64_en-US.msi.sig`;
    const updateFilePath = path.join(__dirname, 'platforms/x86_64-pc-windows-msvc/releases', name);
    // res.download(updateFilePath, name, (err) => {
    //     console.log('err', err)
    // });
    res.attachment(name);
    res.sendFile(updateFilePath);
});

module.exports = router;