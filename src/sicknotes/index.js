const express = require('express');
const router = express.Router();

const items = require('./items');

router.get('/verify/index/:uuid', (req, res) => {
    const { uuid } = req.params;

    const item = items.find(item => item.uuid === uuid);

    res.json(item);
});
router.post('/verify/index/:uuid', (req, res) => {
    const { uuid } = req.params;
    const { body: pin } = req;

    const item = items.find(item => item.uuid === uuid && item.pin === pin);

    res.json(item);
});
// router.post('/sicknotes/login', (req, res) => {
//     const {pin} = req.body;
//     res.json();
// });

module.exports = router;