const listImpl = require("../sockets/controllers/modules/listImpl");

exports.run = async (data) => {
    let {
        name,
        tbl,
        key,
    } = data;

    key = key || 'doc';

    const list = listImpl({
        name,
        tbl,
        skipRemoved: true,
        details_fragment: `
            id
            employee_id
            ${key}
        `,
        order_by: `
            order_by: {id: asc}
        `,
        orgs_fragment: null,
    });

    const run = (n) => {
        list(null, {
            limit: 1,
            offset: 0 + n,
        }).then(async res => {
            await Promise.all(res.filter(({data: {[key]: doc}}) => !!doc && doc.buffer).map(async item => {
                const {id, data: {employee_id, [key]: doc}} = item;
                // let path = Object.getValueByPath(doc, paths);
                // if (!path || !path.buffer) return;
                console.log(id, doc.contentType, !!doc.buffer);
                // let path = doc.path && doc.path.path && doc.path.path.path && doc.path.path.path.path;
                // delete doc.path;
                // console.log(id, doc.isPDF, isString(path));
                // let buffer;
                // if (path.buffer) {
                //     buffer = path.buffer;
                // } else {
                //     buffer = Buffer.from(path);
                // }

                // doc.buffer = buffer;
                // doc.contentType = doc.isPDF ? 'application/pdf' : path.split(';')[0].split(':')[1];

                // console.log(id, !!buffer, doc.contentType);

                // return;

                const new_name = data.new_name({employee_id, id});
                return await uploadFilesUpdate({
                    id,
                    doc,
                    key,
                    new_name,
                    onUpdate: async ({id, ...attrs}) => {
                        delete attrs.id;

                        await updateRelay({
                            mutation: `
                                mutation updateEmployeeDocMutation($id: ${tbl}_pk_columns_input!, $_set: ${tbl}_set_input!) {
                                  update_${tbl}_by_pk(pk_columns: $id, _set: $_set) {
                                    id
                                  }
                                }
						    `,
                            operationName: "updateEmployeeDocMutation",
                            id,
                            attrs,
                        });
                    }
                });
            })).then(res => {
                if(!isArray(res)) {
                    console.log('res done', res);
                }
                run(n + 1);
            });
        });
    };
    run(1);
    // run(1, 'path.path.path');
};

// setTimeout(automate.run, 5000);

async function urlToBase64DataUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }
        const buffer = await response.buffer();
        const base64 = buffer.toString('base64');
        const mimeType = response.headers.get('content-type');
        const dataUrl = `data:${mimeType};base64,${base64}`;
        return dataUrl;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example usage
// const url = 'https://storage.googleapis.com/sheqsolve.appspot.com/assets/489/208/photos/doc.PNG';
// urlToBase64DataUrl(url).then((dataUrl) => {
// 	console.log('Base64 Data URL:', dataUrl);
// });

// fetch(
//     'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyA-s7Ue49oUq6A9S0eqbeFsQ5BAJnDjQsU',
//     {
//     method: 'POST',
//     body: JSON.stringify({
//         contents:[{parts:[{text:"create excel analytics: [[user: 'bas', admin: yes]]"}]}]
//     }),
// }).then(res => res.text()).then(res => {
//     console.log(res);
// });