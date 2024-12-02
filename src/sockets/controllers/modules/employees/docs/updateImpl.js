const findByIdImpl = require("./findByIdImpl");
const updateImpl = require("../../updateImpl");

//<editor-fold desc="updateImpl">
module.exports = (
    {
        name,
        tbl,
        details_fragment,
        orgs_fragment,
        uploadUpdate,
    }
) => {
    return async (socket, attrs) => {
        console.log('updateImpl:', attrs);
        const { id } = attrs;
        delete attrs.id;

        const auth = socket ? await socket.getAuth() : null;

        const findById = findByIdImpl({
            name,
            tbl,
            details_fragment,
            orgs_fragment,
        })

        const item = await findById(socket, id);
        if (!item) return;

        if (uploadUpdate && isFunction(uploadUpdate)) {
            const { new_name, key } = uploadUpdate(item);
            const docKey = key || 'doc';
            let { [docKey]: doc } = attrs;

            if (doc) {
                await uploadFilesUpdate({
                    id,
                    doc,
                    new_name,
                    onUpdate: async ({ id, ...attrsUpdate }) => {
                        attrs[docKey] = attrsUpdate[docKey];
                    }
                });
            }
        }

        const res = await updateGraphQL({
            mutation: `
                mutation update${name}Mutation($id: ${tbl}_pk_columns_input!, $_set: ${tbl}_set_input!) {
                    update_${tbl}_by_pk(pk_columns: $id, _set: $_set) {
                        id
                    }
                }
            `,
            operationName: `update${name}Mutation`,
            id,
            attrs,
            auth,
        });

        if (res) {
            return findById(socket, res.id);
        }
    };
};

module.exports = (
    {
        name,
        tbl,
        details_fragment,
        orgs_fragment,
        uploadUpdate,
    }
) => {
    return async (socket, attrs) => {
        const {
            id,
            doc,
            job_profile_doc,
        } = attrs;

        const has_doc = doc && !doc.dlUrls;
        const has_job_profile_doc = name === "Contract" && (job_profile_doc && !job_profile_doc.dlUrls);
        if (has_doc || has_job_profile_doc) {
            const item = await findByIdEmployeeFn(id);
            if (!item) return;
            const {employee} = item.data;

            const updoad = async ({key, doc, name}) => {
                const path = `employees/${employee.id}/docs/${plural}/${id}`;
                const gcsUri = await workers.emit("files/upload", {
                    file: doc,
                    path,
                    name,
                });
                console.log("gcsUri", gcsUri);
                attrs[key] = gcsUri;
            };

            const promises = [];
            if (has_doc) {
                const __name = `${name}-doc-${Dates.formatTimestamp(new Date())}`;
                promises.push(updoad({
                    key: "doc",
                    doc,
                    name: __name,
                }));
            }
            if (has_job_profile_doc) {
                const __name = `${name}-job-profile-${Dates.formatTimestamp(new Date())}`;
                promises.push(updoad({
                    key: "job_profile_doc",
                    doc: job_profile_doc,
                    name: __name,
                }));
            }

            await Promise.all(promises);
        }

        return updateImpl({
            name,
            tbl,
            details_fragment,
            orgs_fragment,
            uploadUpdate,
        });
    };
};
//</editor-fold>
