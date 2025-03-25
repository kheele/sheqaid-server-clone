const express = require('express');
const router = express.Router();

router.get('/test1', async (req, res) => {

    res.send("test1");
});

module.exports = router;