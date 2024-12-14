// <editor-fold defaultstate="collapsed" desc="sendSignableDocSubmitterLinkByEmail">
const createImpl = require("../../../../../sockets/controllers/modules/createImpl");
const {findByIdTemplate} = require("./funs_find");
// </editor-fold>

exports.createSubmission = async (data) => {
    let {
        id: submission_id,
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

    const templateItem = await findByIdTemplate(external_id);

    const create = createImpl({
        name: "SignableDocSubmission",
        tbl: "signable_doc_template_employee_submissions",
        details_fragment: `
                id
                external_id
                doc_template{
                    id
                }
            `,
        orgs_fragment: null,
    });

    return create(null, {
        template_id: templateItem.id,
        external_id,
        docuseal_id: submission_id,
        created_at,
        updated_at,
        slug,
        status: status && status.toTitleCase(),
    });
};