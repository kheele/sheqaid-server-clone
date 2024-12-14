const updateImpl = require("../../../../../sockets/controllers/modules/updateImpl");
const {findByIdTemplate} = require("./funs_find");

exports.updateSubmitter = async (attrs) => {
    // let {
    //     id,
    //     created_at,
    //     updated_at,
    //     slug,
    //     status,
    //     template: {
    //         id: template_id,
    //         external_id
    //     },
    //     submitters,
    // } = attrs;

    const update = updateImpl({
        name: "SignableDocSubmitter",
        tbl: "signable_doc_template_employee_submitters",
        details_fragment: `
                id
                external_id
                doc_template{
                    id
                }
                employee{
                    id
                }
                submission{
                    id
                }
            `,
        orgs_fragment: null,
    });

    return update(null, attrs);
};

exports.updateSubmission = async (attrs) => {
    const update = updateImpl({
        name: "SignableDocSubmission",
        tbl: "signable_doc_template_employee_submissions",
        details_fragment: `
                id
                external_id
                status
                doc_template{
                    id
                }
            `,
        orgs_fragment: null,
    });

    return update(null, attrs);
};