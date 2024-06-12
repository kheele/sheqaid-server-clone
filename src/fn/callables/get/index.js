const express = require('express');
const router = express.Router();

router.post('/getUserUidByUsername/:access_type', express.text({type: '*/*', limit: "200mb"}), async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        const data = await getUserUidByUsername(req.body, access_type);
        res.json(data);
    } else {
        res.json();
    }
});

router.post('/getUserUidByEmail/:access_type', express.text({type: '*/*', limit: "200mb"}), async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        const data = await getUserUidByEmail(req.body, access_type);
        res.json(data);
    } else {
        res.json();
    }
});

router.post('/getUserUidByPhone', express.text({type: '*/*', limit: "200mb"}), async (req, res) => {
    const {access_type} = req.params;
    if (isValidAccessType(access_type)) {
        const data = await getUserUidByPhone(req.body, access_type);
        res.json(data);
    } else {
        res.json();
    }
});

module.exports = router;

