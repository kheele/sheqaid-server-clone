const findByIdImpl = require("../../../../../sockets/controllers/modules/findByIdImpl");
const findImpl = require("../../../../../sockets/controllers/modules/findImpl");
const {
    signable_doc_template_details_fragment: details_fragment,
} = require("../../../../../sockets/controllers/general/doc-signing-settings/templates/commons");
const {
    employee_basic_personal_details_fragment,
    user_personal_details_fragment
} = require("../../../../../graphql/Fragments");

const details_fragment_submitter = `
            id
            completed_at
            external_id
            is_owning
            opened_at
            role
            sent_at
            slug
            status
            uuid
            submission{
                id
                docuseal_id
            }
            doc_template{
                id
                name
                is_employee_owning
                to_submit
                company{
                    id
                    name
                    settings_list(
                        where: {
                            settings_category: {key: {_eq: "Employee Signable Documents Viewers"}},
                            client_id: {_is_null: true}
                        }
                    ){
                        settings_user{
                            ${user_personal_details_fragment}
                        }
                    }
                }
                client{
                    id
                    name
                    settings_list(
                        where: {
                            settings_category: {key: {_eq: "Employee Signable Documents Viewers"}},
                            project_id: {_is_null: true}
                        }
                    ){
                        settings_user{
                            ${user_personal_details_fragment}
                        }
                    }
                }
                project{
                    id
                    name
                    settings_list(
                        where: {
                            settings_category: {key: {_eq: "Employee Signable Documents Viewers"}},
                            site_id: {_is_null: true}
                        }
                    ){
                        settings_user{
                            ${user_personal_details_fragment}
                        }
                    }
                }
                site{
                    id
                    name
                    settings_list(
                        where: {
                            settings_category: {key: {_eq: "Employee Signable Documents Viewers"}}
                        }
                    ){
                        settings_user{
                            ${user_personal_details_fragment}
                        }
                    }
                }
            }
            employee{
                ${employee_basic_personal_details_fragment}
            }
        `;

exports.findByDocusealIdSubmission = async (id) => {
    id = parseInt(id, 10);
    const find = findImpl({
        name: "SignableDocSubmission",
        tbl: "signable_doc_template_employee_submissions",
        details_fragment: `
            id
        `,
        skipRemoved: true,
        where: (data) => {
            return `
                docuseal_id: {_eq: ${id}}
            `;
        },
        orgs_fragment: null,
    });
    return find(null, {id});
};

exports.findByIdSubmitter = async (id) => {
    id = parseInt(id, 10);
    const findById = findByIdImpl({
        name: "SignableDocSubmitter",
        tbl: "signable_doc_template_employee_submitters",
        details_fragment: details_fragment_submitter,
        orgs_fragment: null,
    });
    return findById(null, id);
};

exports.findByDocusealIdSubmitter = async (id) => {
    id = parseInt(id, 10);
    const find = findImpl({
        name: "SignableDocSubmitter",
        tbl: "signable_doc_template_employee_submitters",
        details_fragment: details_fragment_submitter,
        skipRemoved: true,
        where: (data) => {
            return `
                docuseal_id: {_eq: ${id}}
            `;
        },
        orgs_fragment: null,
    });
    return find(null, {id});
};

exports.findByDocusealIdTemplate = async (id) => {
    id = parseInt(id, 10);
    const find = findImpl({
        name: "SignableDocTemplate",
        tbl: "signable_doc_templates",
        details_fragment: `
            id
            employee_submitter_list{
                id
                role
                external_id
                docuseal_id
                employee{
                    id
                }
            }
        `,
        skipRemoved: true,
        where: (data) => {
            return `
                to_submit: {_eq: true},
                external_id: {_eq: ${id}},
            `;
        },
        orgs_fragment: null,
    });
    return find(null, {id});
};

exports.findByIdTemplate = async (id) => {
    id = parseInt(id, 10);
    const find = findImpl({
        name: "SignableDocTemplate",
        tbl: "signable_doc_templates",
        details_fragment: `
            id
            employee_submitter_list{
                id
                role
                external_id
                docuseal_id
                employee{
                    id
                }
            }
        `,
        skipRemoved: true,
        where: (data) => {
            return `
                #id: {_eq: ${id}},
                doc_template_id: {_eq: ${id}},
            `;
        },
        orgs_fragment: null,
    });
    return find(null, {id});
};