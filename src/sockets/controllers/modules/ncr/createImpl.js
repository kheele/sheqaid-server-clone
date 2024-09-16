const findByIdImpl = require("./findByIdImpl");

//<editor-fold desc="createImpl">
module.exports = async (socket, input) => {
    const {
        source,
        selected_source_id,
        selected_source_item_id,
        formData: {
            //0
            site,
            project,
            client,
            //1
            type,
            priority,
            allocation,
            //2
            desc, process,
            //3
            due_date,
            responsible_party_list,
            assigned_job_position_list,
            assigned_person_list,
            assigned_user_list,
            approving_person_list,
            //4
            document_list, document_proof_list,
            //5
            comments, remarks,
            //6
            progress_list,
            //7
            status_acceptance, status_progress, result, completed_date, additional_notes,
        },
    } = input;

    const sources = {
        "Site Audit": "selected_source_site_id",
        'Compliance Audit': "selected_source_compliance_audit_id",
        'Inspection': "selected_source_inspection_id",
        'Incident Investigation': "selected_source_incident_id",
    };

    const sourceItems = {
        // "Site Audit": "selected_source_site_id",
        'Compliance Audit': "selected_source_item_compliance_audit_finding_id",
        'Inspection': "selected_source_item_inspection_ques_id",
        'Incident Investigation': "selected_source_item_incident_id",
    };

    const data = {
        //0
        site_id: site && site.id,
        project_id: project && project.id,
        client_id: client && client.id,
        //1
        type,
        priority,
        allocation,
        source,
        [sources[source]]: selected_source_id,
        //2
        desc,
        process,
        //3
        due_date: Dates.formatTimestampSQL(due_date),
        responsible_party_list: {
            data: [
                ...(responsible_party_list || []).map(({value}) => ({value})),
            ],
        },
        assigned_job_position_list: {
            data: [
                ...(assigned_job_position_list || []).map(({job_position: {id: job_position_id}}) => ({job_position_id})),
            ],
        },
        assigned_person_list: {
            data: [
                ...(assigned_person_list || []).map(({other_person: employee_other, employee}) => {
                    if(employee_other && !employee_other.id) {
                        socket.injectCreate(employee_other);
                        const {job_position} = employee_other;
                        if(job_position) {
                            delete employee_other.job_position;
                            employee_other.job_position_id = job_position.id;
                        }
                    }
                    return {
                        employee_id: employee && employee.id,
                        employee_other_id: employee_other && employee_other.id,
                        employee_other: employee_other && !employee_other.id && {data: employee_other},
                    };
                }),
            ],
        },
        assigned_user_list: {
            data: [
                ...(assigned_user_list || []).map(({user: {id: user_id}}) => ({user_id})),
            ],
        },
        approving_person_list: {
            data: [
                ...(approving_person_list || []).map(({employee: {id: employee_id}}) => ({employee_id})),
            ]
        },
        //4
        document_list: {
            data: [
                ...(document_list || []).map(({doc}) => ({
                    type: 'Document Incident',
                    doc,
                })),
                ...(document_proof_list || []).map(({doc}) => ({
                    type: 'Document Proof',
                    doc,
                })),
            ],
        },
        //5
        comments,
        remarks,
        //6
        progress_list: {
            data: (progress_list || []).map(({date, ...others}) => ({
                ...others,
                date: Dates.formatTimestampSQL(date),
            })),
        },
        //7
        status_acceptance,
        status_progress,
        result,
        completed_date: Dates.formatTimestampSQL(completed_date),
        additional_notes
    };

    if ([sourceItems[source]] && selected_source_item_id) {
        data[[sourceItems[source]]] = selected_source_item_id;
    }

    socket.injectCreate(data);

    console.log('saving data', data);

    const document_list_doc = document_list && document_list.anyMatch(v => !!v.doc);
    console.log('saving data document_list_doc', document_list_doc);

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
        input: data,
        operationName: "insertNCRMutation",
    });

    if (res) {
        console.log('saving data document_list_doc res 1', res);
        if (document_list_doc) {
            console.log('saving data document_list_doc res 2', document_list_doc);
            return execWhen(async () => {
                const item = await findByIdImpl(socket, res.id);
                if (item) {
                    const {data: {document_list}} = item;
                    console.log('saving data document_list res 3', document_list && document_list.noneMatch(v => !v.doc.dlUrls));
                    if (document_list && document_list.noneMatch(v => !v.doc.dlUrls)) {
                        return item;
                    }
                }
            }).then(item => {
                console.log('saving data document_list_doc res item done', !!item);
                return item;
            });
        }
        return findByIdImpl(socket, res.id);
    }
}
//</editor-fold>
