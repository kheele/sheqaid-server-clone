//<editor-fold desc="sendRelay">
global.sendRelay = async (args) => {
    if (!args) return null;

    let {headers, query, variables, operationName, auth} = args;

    if (!headers) {
        headers = {};
    }

    if (auth) {
        const {token, user_auth_id, user_access_type} = auth;
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        if (user_auth_id) {
            headers['X-Hasura-User-Id'] = user_auth_id;
        }
        if (user_access_type) {
            headers['X-Hasura-User-Access-Type'] = user_access_type;
        }
    }

    console.log('hasura relay headers:', headers);

    try {
        const result = await fetch(process.env.ENDPOINT_HASURA_RELAY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-hasura-access-key": process.env.HASURA_ADMIN_SECRET,
                "X-Hasura-Role": "admin",
                ...headers,
            },
            body: JSON.stringify({
                query,
                variables,
                operationName
            })
        });

        // console.log('result', result)

        try {
            const {errors, data} = await result.json();
            if (errors) {
                // handle those errors like a pro
                console.error(errors, query);
                return null;
            }

            // console.log('sendRelay res', data);

            return data;
        }catch (err) {
            console.log('result err', err)
            throw err;
        }
    }catch (err) {
        console.log('result err', err)
        throw err;
    }
};
//</editor-fold>

//<editor-fold desc="sendGraphQL">
global.sendGraphQL = async (args) => {
    if (!args) return null;
    let {headers, mutation, query, variables, operationName, multi_queries, count, token, auth} = args;

    if (!headers) {
        headers = {};
    }

    if (auth) {
        const {token, user_auth_id, user_access_type} = auth;
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        if (user_auth_id) {
            headers['X-Hasura-User-Id'] = user_auth_id;
        }
        if (user_access_type) {
            headers['X-Hasura-User-Access-Type'] = user_access_type;
        }
    }

    // console.log('hasura headers:', headers);

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
            console.log('errors', query);
            throw new Error(JSON.stringify(errors));
        }

        if (multi_queries) {
            if (!count) {
                // console.log('data', data)
                Object.keys(data).forEach(key => {
                    const list = data[key];
                    // console.log('data list', key, list)
                    if (isArray(list)) {
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

//<editor-fold desc="listRelay">
global.listRelay = async ({query, operationName, variables}) => {
    const query_res = await sendRelay({
        query,
        operationName,
        variables,
    });
    if (!query_res) {
        return;
    }

    const key = Object.keys(query_res)[0];
    const connection = query_res[key];
    // console.log('connection', connection)
    const {edges = []} = connection;
    const nodes = edges.map(({cursor, node}) => {
        node = convertMutations(node);
        if (node.id) {
            return {data: node, id: node.id, cursor};
        } else {
            return node;
        }
    });
    // console.log("onCompleted nodes", nodes);
    return nodes;
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

//<editor-fold desc="getRelayOne">
global.getRelayOne = async ({query, operationName, variables, multi_queries = false}) => {
    const query_res = await sendRelay({
        query,
        operationName,
        variables,
    });
    // console.log('query_res1', query_res)
    if (!query_res) {
        return;
    }

    if (multi_queries) {
        Object.keys(query_res).forEach(key => {
            const connection = query_res[key];
            const {edges = []} = connection;
            const nodes = edges.map(({cursor, node}) => {
                node = convertMutations(node);
                if (node.id) {
                    return {data: node, id: node.id, cursor};
                } else {
                    return node;
                }
            });

            query_res[key] = nodes;
        });
        // console.log(query_res)
        return query_res;
    } else {
        const key = Object.keys(query_res)[0];
        const connection = query_res[key];
        const {edges = []} = connection;
        let [edge] = edges;
        let {node = null} = edge || {};
        if (node && node.id) {
            const id = convertIdToBigint(node.id);
            const data = {...node, id};
            node = {data, id};
        }
        return convertMutations(node);
    }
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
        if (res) {
            return isArray(res) ? res[0] : res;
        }
    });
};
//</editor-fold>

//<editor-fold desc="insertRelay">
global.insertRelay = async ({query, operationName, input, auth}) => {
    return await sendRelay({
        query,
        operationName,
        variables: {object: input},
        auth,
    });
};
//</editor-fold>

//<editor-fold desc="insertGraphQL">
global.insertGraphQL = async ({mutation, operationName, input, auth}) => {
    return await sendGraphQL({
        mutation,
        operationName,
        variables: {[isArray(input) ? "objects" : "object"]: input},
        auth,
    });
};
//</editor-fold>

//<editor-fold desc="updateRelay">
global.updateRelay = async ({mutation, operationName, id, attrs, auth}) => {
    if (attrs.id) {
        delete attrs.id;
    }
    return await sendRelay({
        query: mutation,
        operationName,
        variables: {
            id: {id},
            _set: attrs,
        },
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

// listGraphQL({
//     query: `
// 	    query listAllDocsQuery {
// 		    hr_employees_docs_work_permits(where:{doc:{_is_null: false}}) {
// 			    id
//                 employee{
//                     id
//                 }
// 			    doc
// 			}
// 		}
// 	`,
//     operationName: "listAllDocsQuery",
// }).then(async res => {
//     await Promise.all(res.filter(v => !v.data.doc.dlUrls).map(async ({id, data: {employee, doc}}) => {
//         const new_name = `employees/${employee.id}/docs/licenses/${id}/License-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`;
//         return await uploadFilesUpdate({
//             id,
//             doc,
//             new_name,
//             onUpdate: async ({id, ...attrs}) => {
//                 delete attrs.id;
//
//                 console.log('attrs', attrs);
//
//                 // await updateRelay({
//                 //     mutation: `
//                 //         mutation updateAssetDocMutation($id: asset_docs_pk_columns_input!, $_set: asset_docs_set_input!) {
//                 //           update_asset_docs_by_pk(pk_columns: $id, _set: $_set) {
//                 //             id
//                 //           }
//                 //         }
//                 //     `,
//                 //     operationName: "updateAssetDocMutation",
//                 //     id,
//                 //     attrs,
//                 // });
//             },
//         });
//     }));
// });
