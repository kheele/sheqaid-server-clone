const {employee_basic_personal_details_fragment, orgs_fragment, personal_details_other_fragment} = require("../../../../../../graphql/Fragments");
const {signable_doc_template_details_fragment} = require("../../../../general/doc-signing-settings/templates/commons");

//<editor-fold desc="inc_fragment">
exports.inc_fragment = ({removed, inc_employee = false, }) => `
    id
    created_at
    removed    
    type
    details
    employee_comments
    notes
    doc
    date
    expiry_date
    expiry_updated
    
    witness_list{
        id
        witness{
            ${employee_basic_personal_details_fragment}
        }
        witness_external{
            ${personal_details_other_fragment}
        }
    }
    issued_by{
        ${employee_basic_personal_details_fragment}
    }
    employee{
        ${inc_employee ? `
            ${employee_basic_personal_details_fragment}
            ${removed !== undefined ? `
                warning_list(where: {removed: {_eq: ${removed}}}){
                    id
                    expiry_date
                }` : ``
            }
        ` : `
            id
        `}
    }
    signable_doc_template_list{
        ${signable_doc_template_details_fragment}
    }
    ${orgs_fragment}
`;
//</editor-fold>
