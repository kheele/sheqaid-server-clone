
global.execWhen = (test, max) => {
    return new Promise((resolve, reject) => {
        const exec = async (n) => {
            let res = test();
            if (res instanceof Promise) {
                try {
                    res = await res;
                } catch (ex) {
                    if(max && n === max-1) {
                        reject(ex);
                        return;
                    }
                    setImmediate(() => exec(n+1));
                    return;
                }
            }
            if (res) {
                resolve(res);
            } else {
                if(max && n === max-1) {
                    reject();
                    return;
                }
                setImmediate(() => exec(n+1));
            }
        };
        exec(0);
    });
};

global.whenFileReady = async (socket, res, findById, key = 'doc') => {
    if(!res) return;

    return execWhen(async () => {
        const item = await findById(socket, res.id);
        if(item) {
            const {id, data: {[key]: doc}} = item;
            if(doc && doc.dlUrls) {
                return item;
            }
        }
    });
};

global.onDriver = () => {
    return authorize().then(auth => google.drive({auth, version: 'v3'}));
};

global.getTriggeredEventsData = (body, name) => {
    // await authorize();

    if (!body || !body.data || !body.data.table) {
        return;
    }

    const {
        table: {
            table_name,
            schema,
            old_item,
            new_item,
        }
    } = body.data;

    if(Array.isArray(name)) {
        if (schema !== "public" || !name.contains(table_name) || !new_item) {
            return;
        }
    } else {
        if (schema !== "public" || table_name !== name || !new_item) {
            return;
        }
    }

    return {table_name, old_item, new_item};
};
