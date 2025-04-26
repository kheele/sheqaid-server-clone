// <editor-fold defaultstate="collapsed" desc="sendSignableDocSubmitterLinkByEmail">
const findByIdImpl = require("../../../../../sockets/controllers/modules/findByIdImpl");
const {
    signable_doc_template_details_fragment: details_fragment,
} = require("../../../../../sockets/controllers/default/doc-signing-settings/templates/commons");
const {
    employee_basic_personal_details_fragment,
    user_personal_details_fragment
} = require("../../../../../graphql/Fragments");
const {
    findByIdTemplate,
    findByIdSubmitter,
    findByDocusealIdSubmitter,
    findByDocusealIdSubmission
} = require("./funs_find");

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

        if (!doc_template.to_submit) {
            return;
        }

        EmailUtils.send({
            from: '"SHEQIntel" <no-reply@sheqsolve.com>',
            to: employee.email,
            subject: 'SHEQIntel - You are invited to submit a form',
            html: `
            <p>This is an automated email from SHEQIntel.<br />Please do not reply to this email.</p>
            
            <p>You have been invited to submit the <b>${doc_template.name}</b> form.</p>            
            <p><a href="https://bun-server.cloud.sheqintel.com/signable-docs/sign.html?s=${slug}&role=${role}">Please click this link to submit a form</a></p>            
            
            <p>If you didn't request this, you can ignore this email or let us know.</p>
            <p>Best Regards<br/>SHEQIntel</p>
        `
        });
    }
};

exports.sendSubmissionCompletedEmail = async (submitterItem) => {
    if (submitterItem) {
        console.log('submitterItem', submitterItem);

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
                doc_template: {
                    name,
                },
                employee,
            },
        } = submitterItem;

        if (!doc_template.to_submit) {
            return;
        }

        const {
            // data: {
            // employee,
            company,
            client,
            project,
            site,
            // },
        } = doc_template;

        console.log('item2 doc_template', doc_template);

        const getSettings = (users, settings_list) => {
            if (settings_list && settings_list.isNotEmpty()) {
                users.push(...settings_list.map(({settings_user}) => settings_user));
            }
        };

        const users = [];
        if (company) {
            const {id, name, settings_list} = company;
            getSettings(users, settings_list);
        }
        if (client) {
            const {id, name, settings_list} = client;
            getSettings(users, settings_list);
        }
        if (project) {
            const {id, name, settings_list} = project;
            getSettings(users, settings_list);
        }
        if (site) {
            const {id, name, settings_list} = site;
            getSettings(users, settings_list);
        }

        const onSendEmails = async ({email, is_owning}) => {
            if(is_owning) {
                    await EmailUtils.send({
                    from: '"SHEQIntel" <no-reply@sheqsolve.com>',
                    to: email,
                    subject: `Your ${name} form submission`,
                    html: "<h3><b>Hi there</b></h3>\n" +
                        "<p>\n" +
                        "I hope this message finds you well.<br/>\n" +
                        "Please check the copy of your <b>" + name + "</b> submission by clicking the link below:\n" +
                        "</p>\n" +
                        "<p>\n" +
                        // "<a href='https://docuseal.co/submissions/" + submission.docuseal_id + "'>View Submission</a>\n" +
                        "<a href='https://bun-server.cloud.sheqintel.com/signable-docs/view-submission.html?s=" + slug + "&id=" + submission.docuseal_id + "'>View Submission</a>\n" +
                        "</p>\n\n" +

                        "<p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n\n" +
                        "<p>Thank you for using the SHEQIntel system.</p>\n\n" +
                        "<p>\n" +
                        "Best Regards<br/>\n" +
                        "SHEQ Aid\n" +
                        "</p>\n"
                });
            } else {
                await EmailUtils.send({
                    from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
                    to: email,
                    subject: `${name} has been completed by ${email}`,
                    html: "<h3><b>Hi there</b></h3>\n" +
                        "<p>\n" +
                        "I hope this message finds you well.<br/>\n" +
                        name + " form has been completed by " + email + ".\n" +
                        "</p>\n\n" +
                        "<p>\n" +
                        // "<a href='https://docuseal.co/submissions/" + submission.docuseal_id + "'>View Submission</a>\n" +
                        "<a href='https://bun-server.cloud.sheqintel.com/signable-docs/view-submission.html?s=" + slug + "&id=" + submission.docuseal_id + "'>View Submission</a>\n" +
                        "</p>\n\n" +

                        "<p>If you have any questions or concerns, please do not hesitate to contact us.</p>\n\n" +
                        "<p>Thank you for using the SHEQ Aid system.</p>\n\n" +
                        "<p>\n" +
                        "Best Regards<br/>\n" +
                        "SHEQ Aid\n" +
                        "</p>\n"
                });
            }
        };

        const list = users.map(async ({id, fname, lname, username: email}) => {
            return await onSendEmails({email});
        });

        if (employee.email) {
            const {fname, lname, email} = employee;
            list.push(onSendEmails({email, is_owning: true}));
        }

        try {
            await Promise.all(list);
        } catch (err) {
            console.log('sent err', err);
        }
    }
};
// </editor-fold>
