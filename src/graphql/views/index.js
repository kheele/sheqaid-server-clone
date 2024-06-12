const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
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

    const {body: path} = req;

    return fetch(`${process.env.ENDPOINT_HASURA_REST}/${path}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-hasura-access-key": process.env.HASURA_ADMIN_SECRET,
            ...headers,
        },
    }).then(res => res.json()).then(data => {
        // console.log("response data", data)
        res.json(data);
    }).catch(err => {
        console.log("response err", err.message)
        res.end(err);
    });
});

module.exports = router;
