const express = require('express');
const router = express.Router();

const accounts = require("./accounts");
const biometric = require("./biometric");
const send = require("./send");
const get = require("./get");
const excel = require("./excel");
const thumbnail_generator = require("./thumbnail-generator");
const docs = require("./docs");

const sharepoint = require("./sharepoint");
const triggeredEvents = require("./triggered-events");
const scheduledEvents = require("./scheduled-events");

router.use('/accounts', accounts);
router.use('/biometric', biometric);
router.use('/send', send);
router.use('/get', express.text({type: '*/*', limit: "200mb"}), get);
// router.use('/get', express.text({type: '*/*', limit: "200mb"}), get);
router.use('/excel', excel);
router.use('/thumbnail-generator', thumbnail_generator);
router.use('/docs', docs);

router.use('/sharepoint', sharepoint);
router.use('/triggered-events', triggeredEvents);
router.use('/scheduled-events', scheduledEvents);

router.post('/sendEmail', async (req, res) => {
    await authorize();

    // const data = await EmailUtils.send(req.body);
    // res.json(data);
    EmailUtils.send(req.body);
    res.json(true);
    console.log('/sendEmail res')
});

module.exports = router;
