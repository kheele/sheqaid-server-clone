const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const Authorization = req.get("Authorization");
    const XHasuraRole = req.get("X-Hasura-Role");
    const XHasuraUserId = req.get("X-Hasura-User-Id");
    console.log({Authorization, XHasuraRole, XHasuraUserId})
    // console.log('req.body', req.body)

    const headers = {};
    if(XHasuraRole) {
        headers["X-Hasura-Role"] = XHasuraRole;
    }
    if(XHasuraUserId) {
        headers["X-Hasura-User-Id"] = XHasuraUserId;
    }
    if(Authorization) {
        headers["Authorization"] = Authorization;
    }

    return fetch(process.env.ENDPOINT_HASURA_RELAY, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-hasura-access-key": process.env.HASURA_ADMIN_SECRET,
            ...headers,
        },
        body: JSON.stringify(req.body),
    }).then(res => res.json()).then(data => {
        // console.log("response data", data)
        res.json(data);
    }).catch(err => {
        console.log("response err", err.message)
        res.json(err);
    });
});

module.exports = router;
