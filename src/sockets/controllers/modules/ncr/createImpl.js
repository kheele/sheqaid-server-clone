const findByIdImpl = require("./findByIdImpl");

//<editor-fold desc="createImpl">
module.exports = async (socket, input) => {
    const {
        //0
        site_id,
        project_id,
        client_id,
        //1
        type,
        priority,
        allocation,
        source,
        //2
        desc,
        process,
        //3
        due_date,
        responsible_person_id,
        responsible_party_list,
        assigned_job_position_list,
        assigned_person_list,
        assigned_person_other_list,
        approving_person_id,
        //4
        document_list,
        //5
        comments,
        remarks,
        //6
        progress_list,
        //7
        status_acceptance,
        status,
        result,
        completed_date,
        additional_notes
    } = input;
    
    // let document_list_doc;
    // if (document_list && document_list.data && document_list.data.anyMatch(v => !!v.doc)) {
    //     document_list_doc = true;
    //     delete input.document_list;
    // }
    
    if(assigned_person_other_list) {
        input.assigned_person_list = {
            data: [...(assigned_person_list && assigned_person_list.data || []), ...assigned_person_other_list.data],
        };
        delete input.assigned_person_other_list;
    }

    const res = await insertGraphQL({
		mutation: `
			mutation insertNCRMutation($object: sheq_non_conformances_insert_input!) {
                insert_sheq_non_conformances_one(
                    object: $object
                ) {
                    id
                }
            }
		`,
		input,
		operationName: "insertNCRMutation",
	});

    if(res) {
        // if (res) {
            // if (document_list_doc) {
                // const id = convertIdToBigint(res.id);
                // const updateAttrs = {};
                //
                // const updoad = async ({key, doc, name}) => {
                //     const path = `employees/${id}/docs`;
                //     const gcsUri = await workers.emit("files/upload", {
                //         file: doc,
                //         path,
                //         name,
                //     });
                //     console.log("gcsUri", gcsUri);
                //     if (key) {
                //         updateAttrs[key] = gcsUri;
                //     } else {
                //         return gcsUri;
                //     }
                // };

                // const promises = [];
                // promises.push(Promise.all(document_list.data.map(async (v, n) => {
                //     const name = `document-${n}-${Dates.formatTimestamp(new Date())}`;
                //     const gcsUri = await updoad({
                //         doc: v.doc,
                //         name,
                //     });
                //     v.doc = gcsUri;
                //     return v;
                // })).then(list => {
                //     updateAttrs.document_list = {data: list};
                // }));
                //
                // await Promise.all(promises);
                //
                // return updateNCR({id, ...updateAttrs});
            // }
        // }
        return findByIdImpl(socket, res.id);
    }
}
//</editor-fold>
