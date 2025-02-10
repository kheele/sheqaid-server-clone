
//<editor-fold desc="sendGraphQL">
global.sendGraphQL = async (args) => {
    if (!args) return null;
    let {headers, mutation, query, variables, operationName, multi_queries, count, token, auth} = args;

    if (!headers) {
        headers = {};
    }

    if(auth) {
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
    }

    console.log('hasura headers:', headers);

    if (mutation) {
        return fetch(process.env.ENDPOINT_HASURA_GRAPHQL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-hasura-access-key": process.env.HASURA_ADMIN_SECRET,
                "X-Hasura-Role": "admin",
                ...headers,
            },
            body: JSON.stringify({query: mutation, operationName, variables}),
        }).then(res => {
            try {
                return res.json();
            } catch (err) {
                console.error(err);
                console.error(res.text());
                throw err;
            }
        }).then(res => {
            // console.log(res); // { data: ... }

            const {errors, data} = res;

            if (errors) {
                console.log('errors', mutation);
                throw new Error(JSON.stringify(errors));
            }

            const key = Object.keys(data)[0];
            const item = data[key];
            if (item) {
                const node = convertMutations(item);
                // console.log("onCompleted node", node);
                if (node.id) {
                    return {data: node, id: node.id};
                } else {
                    return node;
                }
            }
        }).catch(err => {
            // console.error("response err", err, 'query', query)
            throw err;
        });
    }

    return fetch(process.env.ENDPOINT_HASURA_GRAPHQL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-hasura-access-key": process.env.HASURA_ADMIN_SECRET,
            "X-Hasura-Role": "admin",
            ...headers,
        },
        body: JSON.stringify({query, variables}),
    }).then(res => {
        try {
            return res.json();
        } catch (err) {
            console.error(err);
            console.error(res.text());
            throw err;
        }
    }).then(res => {
        // console.log(process.env.ENDPOINT_HASURA_GRAPHQL, JSON.stringify(res)); // { data: ... }
        const {errors, data} = res;

        if (errors) {
            throw new Error(JSON.stringify(errors));
        }

        if (multi_queries) {
            if (!count) {
                // console.log('data', data)
                Object.keys(data).forEach(key => {
                    const list = data[key];
                    // console.log('data list', key, list)
                    if(isArray(list)) {
                        list.forEach(node => {
                            convertMutations(node);
                        });
                    } else {
                        convertMutations(list);
                    }
                });
                return data;
            }

            // console.log('data', data)

            const key = Object.keys(data)[0];
            const list = data[key];
            return list[0];
        } else {
            const key = Object.keys(data)[0];
            const list = data[key];
            // console.log('connection', connection)
            if (isArray(list)) {
                const nodes = list.map(node => {
                    node = convertMutations(node);
                    if (node.id) {
                        return {data: node, id: node.id};
                    } else {
                        return node;
                    }
                });
                // console.log("onCompleted nodes", nodes);
                return nodes;
            } else {
                const node = convertMutations(list);
                if (node.id) {
                    return {data: node, id: node.id};
                } else {
                    return node;
                }
            }
        }
    }).catch(err => {
        // console.error("response err", err, 'query', query)
        throw err;
    });
};
//</editor-fold>

//<editor-fold desc="listGraphQL">
global.listGraphQL = async ({query, operationName, variables}) => {
    return await sendGraphQL({
        query,
        operationName,
        variables,
    });
};
//</editor-fold>

//<editor-fold desc="getGraphQLOne">
global.getGraphQLOne = async ({query, operationName, variables, multi_queries = false, count = false}) => {
    return await sendGraphQL({
        query,
        operationName,
        variables,
        multi_queries,
        count,
    }).then(res => {
        // console.log('getGraphQLOne res', res);
        if(res) {
            return isArray(res) ? res[0] : res;
        }
    });
};
//</editor-fold>

//<editor-fold desc="insertGraphQL">
global.insertGraphQL = async ({mutation, operationName, input, auth}) => {
    return await sendGraphQL({
        mutation,
        operationName,
        variables: {[isArray(input)? "objects" : "object"]: input},
        auth,
    });
};
//</editor-fold>

//<editor-fold desc="updateGraphQL">
global.updateGraphQL = async ({mutation, operationName, id, attrs, auth}) => {
    if (attrs.id) {
        delete attrs.id;
    }
    return await sendGraphQL({
        mutation,
        operationName,
        variables: {
            id: {id},
            _set: attrs,
        },
        auth,
    });
};
//</editor-fold>

//<editor-fold desc="deleteGraphQL">
global.deleteGraphQL = async ({mutation, operationName, id, auth}) => {
    return await sendGraphQL({
        mutation,
        operationName,
        variables: {
            id
        },
        auth,
    });
};
//</editor-fold>
