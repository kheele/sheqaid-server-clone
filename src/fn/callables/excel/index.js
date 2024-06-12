const express = require('express');
const router = express.Router();

const {
    createExcelFileSheets,
    createExcelFile,
    onReadAsJson,
} = require('./api.js');

router.post('/createExcelFileSheets', async (req, res) => {
    await authorize();

    const data = await createExcelFileSheets(req.body);
    res.json(data);
});

router.post('/createExcelFile', async (req, res) => {
    await authorize();

    const data = await createExcelFile(req.body);
    res.json(data);
});

router.post('/onReadAsJson', async (req, res) => {
    await authorize();

    const data = await onReadAsJson(req.body);
    res.json(data);
});

module.exports = router;

