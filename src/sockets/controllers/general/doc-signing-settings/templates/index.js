const jwt = require('jsonwebtoken');
const createImpl = require("../../../modules/createImpl");
const updateImpl = require("../../../modules/updateImpl");
const findImpl = require("../../../modules/findImpl");
const findByIdImpl = require("../../../modules/findByIdImpl");
const listImpl = require("../../../modules/listImpl");
const {signable_doc_template_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const {DOCUSEAL_API_URL, DOCUSEAL_API_KEY, DOCUSEAL_USER_EMAIL} = process.env;

const args = {
    name: "SignableDocTemplate",
    tbl: "signable_doc_templates",
    details_fragment,
    orgs_fragment: null,
    uploadUpdate: (id) => ({
    	new_name: `documents/signable-doc-templates/${id}/doc`,
    	key: 'doc',
    }),
    getVariablesAndQueryConfig,
};

const path = "doc-signing-settings/api/docuseal/templates";

eventManager.on(`${path}/listByLogged`, listImpl(args));

eventManager.on(`${path}/edit`, async (socket, data) => {
    const jwt = require('jsonwebtoken');
    const {id: templateId} = req.params;
    const {rows: templateRows} = await db.query('SELECT * FROM templates WHERE id = $1', [templateId]);

    if (templateRows.length === 0) {
        return res.status(404).json({error: 'Template not found'});
    }

    const token = jwt.sign({
        user_email: process.env.DOCUSEAL_USER_EMAIL,
        external_id: templateRows[0].id,
    }, process.env.DOCUSEAL_API_KEY)

    res.json({token});
});

eventManager.on(`${path}/findById`, findByIdImpl(args));
// eventManager.on(`${path}/findById`, async (socket, id) => {
    // const {id: templateId} = req.params;
    // const {rows: templateRows} = await db.query('SELECT * FROM templates WHERE id = $1', [templateId]);
    //
    // if (templateRows.length === 0) {
    //     return res.status(404).json({error: 'Template not found'});
    // }
    //
    // await loadSubmissions(templateId, templateRows[0].external_id)
    //
    // const {rows: submissionRows} = await db.query('SELECT * FROM submissions WHERE template_id = $1 ORDER BY id DESC ', [templateId]);
    //
    // if (submissionRows.length === 0) return res.json({template: templateRows[0] || {}, submissions: []});
    //
    // const {rows: submitterRows} = await db.query('SELECT * FROM submitters WHERE submission_id = ANY($1) ORDER BY id DESC', [submissionRows.map((submission) => submission.id)]);
    //
    // res.json({
    //     template: templateRows[0],
    //     submissions: submissionRows.map((submission) => {
    //         return {
    //             id: submission.id,
    //             submitters: submitterRows.filter((submitter) => submitter.submission_id === submission.id)
    //         }
    //     })
    // });
// });

eventManager.on(`${path}/create`, async (socket, input) => {
    const fn = createImpl(args);
    return fn.apply(this, [socket, input]).then(res => {
        if (!res) return;

        console.log(`${path}/create`, res);

        const {id, data, data: {name: templateName, doc}} = res;

        const token = jwt.sign({
            user_email: DOCUSEAL_USER_EMAIL,
            name: templateName,
            external_id: id,
            document_urls: [doc.dlUrls[0]],
        }, DOCUSEAL_API_KEY);

        return {
            template: data,
            token: token,
        };
    });
});
// eventManager.on(`${path}/create`, async (socket, data) => {
//     if (!data) return;
//
//     const {doc_name: templateName} = data;
//
//     const {rows: templateRows} = await db.query('INSERT INTO templates (name) VALUES ($1) RETURNING *', [templateName]);
//
//     const token = jwt.sign({
//         user_email: process.env.DOCUSEAL_USER_EMAIL,
//         name: templateName,
//         external_id: templateRows[0].id
//     }, process.env.DOCUSEAL_API_KEY)
//
//     return {
//         template: templateRows[0],
//         token: token
//     };
// });

eventManager.on(`${path}/update`, async (socket, _attrs) => {
    const {
        id: templateId,
        // template_id: templateId,
        external_id,
    } = _attrs;

    console.log(`${DOCUSEAL_API_URL}/templates/${external_id}`)
    return fetch(`${DOCUSEAL_API_URL}/templates/${external_id}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': DOCUSEAL_API_KEY,
        }
    }).then((res) => res.json()).then(async (data) => {
        const fn = updateImpl(args);

        const {
            id: external_id,
            name,
            slug,
            documents,
            submitters,
        } = data;

        const attrs = {
            id: templateId,
            external_id,
            name,
            slug,
            preview_image_url: documents && documents[0].preview_image_url,
            // submitters,
        };

        // const { rows: templateRows } = await db.query('UPDATE templates SET external_id = $1, name = $2, slug = $3, preview_image_url = $4, submitters = $5 WHERE id = $6 RETURNING *',
        // [data.id, data.name, data.slug, data.documents[0]?.preview_image_url, data.submitters.map(JSON.stringify), templateId]);
        return fn.apply(this, [socket, attrs]).then(res => {
            if (!res) return;

            const {id, data, data: {name: templateName, doc}} = res;
            return {
                template: data,
            };
        });
    });
});

eventManager.on(`${path}/findByModuleKey`, async (socket, input) => {
    const find = findImpl({
        ...args,
    });
    return find(socket, input).then(res => {
        console.log(`${path}/findByModuleKey1`, res);
        if (!res) return;

        console.log(`${path}/findByModuleKey`, res);

        // https://api.docuseal.co/s/${slug}

        // const {id, data, data: {name: templateName, doc}} = res;
        //
        // const token = jwt.sign({
        //     user_email: DOCUSEAL_USER_EMAIL,
        //     name: templateName,
        //     external_id: id,
        //     document_urls: [doc.dlUrls[0]],
        // }, DOCUSEAL_API_KEY);

        return res;
    });
});
