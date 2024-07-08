eventManager.on("graphql/v1beta1/relay", async (socket, data = {}) => {
    console.log('graphql/v1beta1/relay data', data)
    let {query, variables, token} = data;

    let auth = await socket.getAuth(token);

    let headers = {};
    console.log('v1beta1/relay auth', auth);
    if (auth) {
        const {token, user_auth_id, user_access_type} = auth;
        if(token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        if(user_auth_id) {
            headers['X-Hasura-User-Id'] = user_auth_id;
        }
        if(user_access_type) {
            headers['X-Hasura-User-Access-Type'] = user_access_type;
        }
        headers["X-Hasura-Role"] = "user";
    }

    // if (token) {
    //     headers.Authorization = `Bearer ${token}`;
    // }

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
    const {mutation, query, variables, operationName, multi_queries, count, token} = data;

    data.auth = await socket.getAuth(token);
    console.log('v1/graphql auth', data.auth);

    let headers = {};
    if (variables && "headers" in variables) {
        headers = {...headers, ...(variables.headers || {})};
        // eslint-disable-next-line no-param-reassign
        delete variables.headers;
    }

    // if (token) {
    //     headers.Authorization = `Bearer ${token}`;
    // }

    data.headers = headers;

    return sendGraphQL(data);
});
