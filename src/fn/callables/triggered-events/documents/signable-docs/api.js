// <editor-fold defaultstate="collapsed" desc="sendSignableDocSubmitterLinkByEmail">
const findByIdImpl = require("../../../../../sockets/controllers/modules/findByIdImpl");
const {
    signable_doc_template_details_fragment: details_fragment,
} = require("../../../../../sockets/controllers/general/doc-signing-settings/templates/commons");
const {
    employee_basic_personal_details_fragment,
    user_personal_details_fragment
} = require("../../../../../graphql/Fragments");
const {
    findByIdTemplate,
    findByIdSubmitter,
    findByDocusealIdTemplate,
    findByDocusealIdSubmitter,
    findByDocusealIdSubmission
} = require("./funs_find");
const {createSubmission} = require("./funs_create");
const {updateSubmitter, updateSubmission} = require("./funs_update");
const {sendSubmissionCompletedEmail} = require("./sendEmails");

exports.sendSignableDocSubmitterLinkByEmail = async (body) => {
    const data = getTriggeredEventsData(body, "signable_doc_template_employee_submitters");
    if (!data) {
        return;
    }

    const {new_item} = data;
    let {
        id,
        completed_at,
        doc_template_id,
        employee_id,
        external_id,
        is_owning,
        opened_at,
        role,
        sent_at,
        slug,
        status,
        submission_id,
        uuid,
    } = new_item;

    console.log('sendSubmitterLinkByEmail', new_item)

    const item = await findByIdSubmitter(id);
    if (item) {
        const {
            data: {
                completed_at,
                external_id,
                is_owning,
                opened_at,
                role,
                sent_at,
                slug,
                status,
                uuid,
                submission,
                doc_template,
                employee,
            },
        } = item;


        if (!doc_template.to_submit || !employee.email) {
            return;
        }

        EmailUtils.send({
            from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
            to: employee.email,
            subject: 'SHEQ Aid - You are invited to submit a form',
            html: `
            <p>This is an automated email from SHEQ Aid.<br />Please do not reply to this email.</p>
            
            <p>You have been invited to submit the <b>${doc_template.name}</b> form.</p>            
            <p><a href="https://bun-server.cloud.sheqaid.com/signable-docs/sign.html?s=${slug}&role=${role}">Please click this link to submit a form</a></p>            
            
            <p>If you didn't request this, you can ignore this email or let us know.</p>
            <p>Best Regards<br/>SHEQ Aid</p>
        `
        });
    }
};

exports.onSignableDocSubmissionEvent = async (body) => {
    if (!body) {
        return;
    }

    console.log('onSignableDocSubmissionCompleted body', body)

    const {event_type, timestamp, data} = body || {};
    console.log('onSignableDocSubmissionEvent event_type', event_type)
    console.log('onSignableDocSubmissionEvent', !!data)

    if (event_type === "submission.created") {
        let {
            id: docusealSubmissionId,
            created_at,
            updated_at,
            slug,
            status,
            template: {
                id: template_id,
                external_id
            },
            submitters,
        } = data;
        external_id = parseInt(external_id);
        const template = await findByIdTemplate(external_id);
        // const newSubmissionItem = await createSubmission(data);
        await loadSubmission(template, docusealSubmissionId);

        return;
    }

    if (['form.viewed', 'form.started', 'form.completed'].includes(event_type) && data) {
        const {
            id: docusealSubmitterId,
            submission_id: docusealSubmissionId,
            template: {
                id: docusealTemplateId
            },
        } = data;

        // const {rows: submitterRows} = await db.query('SELECT * FROM submitters WHERE external_id = $1', [docusealSubmitterId]);
        // const submitter = submitterRows[0];
        const submitter = await findByDocusealIdSubmitter(docusealSubmitterId);

        // const {rows: templateRows} = await db.query('SELECT * FROM templates WHERE external_id = $1', [docusealTemplateId]);
        // const template = templateRows[0];
        const template = await findByDocusealIdTemplate(docusealTemplateId);

        if (submitter) {
            const {
                opened_at, completed_at, status,
            } = data;

            // await db.query('UPDATE submitters SET opened_at = $1, completed_at = $2, status = $3 WHERE external_id = $4', [data.opened_at, data.completed_at, data.status, docusealSubmitterId]);
            await updateSubmitter({
                id: submitter.id,
                opened_at,
                completed_at,
                status,
            });
        } else if (template) {
            await loadSubmission(template, docusealSubmissionId)
        }
    }

    if (event_type === "form.viewed" || event_type === "form.started" || event_type === "form.completed") {
        let {
            id: submitter_id,
            submission_id,
            email,

            opened_at,
            created_at,
            updated_at,
            completed_at,
            slug,
            status, //opened/completed
            role,
            submission_url,
            template: {
                id: template_id,
                external_id
            },
            submission: {
                // id: submission_id,
                created_at: submission_created_at,
                status: submission_status,// "completed",
                url,
            },
        } = data;

        if(['form.viewed', 'form.completed'].includes(event_type)) {
            const submitterItem = await findByDocusealIdSubmitter(submitter_id);
            if (submitterItem) {
                await updateSubmitter({
                    id: submitterItem.id,
                    opened_at,
                    completed_at,
                    status: status && status.toTitleCase(),
                });
                if (event_type === "form.viewed") {
                    return;
                }

                const {data: {submission}} = submitterItem;
                await updateSubmission({
                    id: submission.id,
                    created_at,
                    updated_at,
                    status: status && status.toTitleCase(),
                });

                await sendSubmissionCompletedEmail(submitterItem);
            } else {
                const templateItem = await findByIdTemplate(external_id);
                const {
                    data: {
                        employee_submitter_list
                    }
                } = templateItem;

                const submissionItem = await findByDocusealIdSubmission(submission_id);

                const promises = employee_submitter_list.filter(v => v.role === role).map(async ({id}) => {
                    return await updateSubmitter({
                        id,
                        submission_id: submissionItem.id,
                        docuseal_id: submitter_id,
                        opened_at,
                        status: status && status.toTitleCase(),
                    });
                });

                await Promise.all(promises);
                return;
            }
        }

        if (event_type === "form.started") {
            const templateItem = await findByIdTemplate(external_id);
            const {
                data: {
                    employee_submitter_list
                }
            } = templateItem;

            console.log('templateItem', role, templateItem)

            const submissionItem = await findByDocusealIdSubmission(submission_id);

            if(submissionItem) {
                const promises = employee_submitter_list.filter(v => v.role === role).map(async ({id}) => {
                    return await updateSubmitter({
                        id,
                        submission_id: submissionItem.id,
                        docuseal_id: submitter_id,
                        opened_at,
                        status: status && status.toTitleCase(),
                    });
                });

                await Promise.all(promises);
            }
            return;
        }
    }
};
// </editor-fold>

const loadAllSubmissions = async (templateId, externalTemplateId) => {
    return await fetch(`${process.env.DOCUSEAL_API_URL}/submissions`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': process.env.DOCUSEAL_API_KEY,
        }
    }).then((response) => response.json())
        .then(async (responseData) => {
            console.log('loadAllSubmissions responseData', responseData)
            // responseData.data.forEach(async (submission) => {
            //     const {rows: submissionRows} = await db.query('SELECT * FROM submissions WHERE external_id = $1', [submission.id]);
            //     let submissionId = submissionRows[0]?.id
            //
            //     if (submissionRows.length === 0) {
            //         const {rows: submissionRows} = await db.query('INSERT INTO submissions (template_id, external_id) VALUES ($1, $2) RETURNING id', [templateId, submission.id])
            //
            //         submissionId = submissionRows[0]?.id
            //     }
            //
            //     submission.submitters.forEach(async (submitter) => {
            //         const {rows: submitterRows} = await db.query('SELECT * FROM submitters WHERE external_id = $1', [submitter.id]);
            //
            //         if (submitterRows.length === 0) {
            //             await db.query('INSERT INTO submitters (submission_id, external_id, uuid, app_id, email, slug, sent_at, opened_at, completed_at, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [submissionId, submitter.id.toString(), submitter.uuid, submitter.external_id, submitter.email, submitter.slug, submitter.sent_at, submitter.opened_at, submitter.completed_at, submitter.status]);
            //         }
            //     });
            // });
        }).catch((error) => {
            console.error('Error:', error);
        })
}

const loadSubmissions = async (templateId, externalTemplateId) => {
    return await fetch(`${process.env.DOCUSEAL_API_URL}/submissions/?template_id=${externalTemplateId}&limit=100`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': process.env.DOCUSEAL_API_KEY,
        }
    }).then((response) => response.json())
        .then(async (responseData) => {
            console.log('loadSubmissions responseData', responseData)
            // responseData.data.forEach(async (submission) => {
            //     const {rows: submissionRows} = await db.query('SELECT * FROM submissions WHERE external_id = $1', [submission.id]);
            //     let submissionId = submissionRows[0]?.id
            //
            //     if (submissionRows.length === 0) {
            //         const {rows: submissionRows} = await db.query('INSERT INTO submissions (template_id, external_id) VALUES ($1, $2) RETURNING id', [templateId, submission.id])
            //
            //         submissionId = submissionRows[0]?.id
            //     }
            //
            //     submission.submitters.forEach(async (submitter) => {
            //         const {rows: submitterRows} = await db.query('SELECT * FROM submitters WHERE external_id = $1', [submitter.id]);
            //
            //         if (submitterRows.length === 0) {
            //             await db.query('INSERT INTO submitters (submission_id, external_id, uuid, app_id, email, slug, sent_at, opened_at, completed_at, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [submissionId, submitter.id.toString(), submitter.uuid, submitter.external_id, submitter.email, submitter.slug, submitter.sent_at, submitter.opened_at, submitter.completed_at, submitter.status]);
            //         }
            //     });
            // });
        }).catch((error) => {
            console.error('Error:', error);
        })
}

const loadSubmission = async (template, docusealSubmissionId) => {
    return fetch(`${process.env.DOCUSEAL_API_URL}/submissions/${docusealSubmissionId}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': process.env.DOCUSEAL_API_KEY,
        }
    }).then((response) => response.json())
        .then(async (submissionRes) => {
            console.log('loadSubmission submission', submissionRes);
            const submission = await findByDocusealIdSubmission(submissionRes.id);
            // const {rows: submissionRows} = await db.query('SELECT * FROM submissions WHERE external_id = $1', [submissionRes.id]);
            let submissionId = submission && submission.id;
            // let submissionId = submissionRows[0]?.id

            // if (submissionRows.length === 0) {
            if (!submission) {
                const newSubmissionItem = await createSubmission(submissionRes);
                //     const {rows: submissionRows} = await db.query('INSERT INTO submissions (template_id, external_id) VALUES ($1, $2) RETURNING id', [templateId, submissionRes.id])
                submissionId = newSubmissionItem && newSubmissionItem.id;
                //     submissionId = submissionRows[0]?.id
            }

            const promises = submissionRes.submitters.map(async (docusealSubmitter) => {
                const {
                    id: docusealSubmitterId,
                    uuid,
                    external_id,
                    email,
                    slug,
                    sent_at,
                    opened_at,
                    completed_at,
                    status,
                    role,
                } = docusealSubmitter;

                const submitter = await findByDocusealIdSubmitter(docusealSubmitterId);
                // const {rows: submitterRows} = await db.query('SELECT * FROM submitters WHERE external_id = $1', [docusealSubmitterId]);

                // if (submitterRows.length === 0) {
                if (!submitter) {
                    const {data:{employee_submitter_list}} = template;
                    const promises = employee_submitter_list.filter(v => v.role === role).map(async ({id}) => {
                        return await updateSubmitter({
                            id,
                            submission_id: submissionId,
                            docuseal_id: docusealSubmitterId,
                            sent_at,
                            opened_at,
                            completed_at,
                            external_id,
                            slug,
                            uuid,
                            status: status && status.toTitleCase(),
                        });
                    });

                    await Promise.all(promises);
                    // await db.query(
                    //     'INSERT INTO submitters (submission_id, external_id, uuid, app_id, email, slug, sent_at, opened_at, completed_at, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (external_id) DO UPDATE SET sent_at = $7, opened_at = $8, completed_at = $9, status = $10',
                    //     [
                    //         submissionId,
                    //         docusealSubmitterId.toString(),
                    //         docusealSubmitter.uuid,
                    //         docusealSubmitter.external_id,
                    //         docusealSubmitter.email,
                    //         docusealSubmitter.slug,
                    //         docusealSubmitter.sent_at,
                    //         docusealSubmitter.opened_at,
                    //         docusealSubmitter.completed_at,
                    //         docusealSubmitter.status
                    //     ]
                    // );
                } else {
                    return updateSubmitter({
                        id: submitter.id,
                        submission_id: submissionId,
                        docuseal_id: docusealSubmitterId,
                        opened_at,
                        status: status && status.toTitleCase(),
                    });
                }
            });

            await Promise.all(promises);
        }).catch((error) => {
            console.error('Error:', error);
        })
}

// loadAllSubmissions();
// loadSubmissions();
// loadSubmission();