eventManager.on("graphql/v1beta1/relay", async (socket, data = {}) => {
    // console.log('data', data)
    const {request, handshake} = socket;
    // const {auth} = handshake;
    const {session} = request;
    const {auth_id} = session.decodedIdToken || {};
    // console.log('v1beta1/relay auth', auth);

    let {query, variables, token} = data;

    let headers = {};
    console.log('v1beta1/relay auth_id', auth_id);
    if (auth_id) {
        // const currentUser = await admin.auth().getUser(auth_id);
        // console.log("relay variables", currentUser, auth_id, variables)
        // if (currentUser) {
        // 	const token = await currentUser.getIdToken(true);
        // 	headers.Authorization = `Bearer ${token}`;
        // 	headers["X-Hasura-User-Id"] = currentUser.uid;
        // 	headers["X-Hasura-Role"] = "user";
        // }

        headers["X-Hasura-User-Id"] = auth_id;
        headers["X-Hasura-Role"] = "user";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (variables && "headers" in variables) {
        headers = {...headers, ...variables.headers};
        // eslint-disable-next-line no-param-reassign
        delete variables.headers;
    }

    return await fetch(process.env.ENDPOINT_HASURA_RELAY, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-hasura-access-key": process.env.HASURA_ADMIN_SECRET,
            ...headers,
        },
        body: JSON.stringify({query, variables}),
    }).
    then(res => res.json()).
    catch(err => {
        console.error("response err", err, 'query', query)
        throw err;
    });
});

eventManager.on("graphql/v1/graphql", async (socket, data = {}) => {
    // console.log('data', data)
    const {auth_id} = socket.request.session.decodedIdToken || {};

    const {mutation, query, variables, operationName, multi_queries, count, token} = data;

    let headers = {};
    console.log('v1/graphql', auth_id);
    if (auth_id) {
        // const currentUser = await admin.auth().getUser(auth_id);
        // console.log("graphql variables", currentUser, auth_id, variables)
        // if (currentUser) {
        // const token = await currentUser.getIdToken(true);
        // headers.Authorization = `Bearer ${token}`;
        // headers["X-Hasura-User-Id"] = currentUser.uid;
        // }

        headers["X-Hasura-User-Id"] = auth_id;
        headers["X-Hasura-Role"] = "user";

        if (variables && "headers" in variables) {
            headers = {...headers, ...variables.headers};
            // eslint-disable-next-line no-param-reassign
            delete variables.headers;
        }
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    data.headers = headers;

    return sendGraphQL(data);
});

eventManager.on("graphql/api/rest/views", async (socket, path) => {
    // console.log('data', path)
    const {auth_id} = socket.request.session.decodedIdToken || {};

    let headers = {};

    if (auth_id) {
        // const currentUser = await admin.auth().getUser(auth_id);
        // console.log("relay variables", currentUser, auth_id)
        // if (currentUser) {
        // const token = await currentUser.getIdToken(true);
        // headers.Authorization = `Bearer ${token}`;
        // 	headers["X-Hasura-User-Id"] = currentUser.uid;
        // 	headers["X-Hasura-Role"] = "user";
        // }

        headers["X-Hasura-User-Id"] = auth_id;
        headers["X-Hasura-Role"] = "user";
    }

    return fetch(`${process.env.ENDPOINT_HASURA_REST}/${path}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-hasura-access-key": process.env.HASURA_ADMIN_SECRET,
            ...headers,
        },
    }).then(res => {
        try {
            return res.json();
        } catch (err) {
            console.error(err);
            console.error(res.text());
            throw err;
        }
    }).catch(err => {
        console.log("response err", err.message)
        throw err;
    });
});
//216
