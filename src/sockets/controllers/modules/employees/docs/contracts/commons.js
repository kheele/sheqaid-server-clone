const {employee_basic_personal_details_fragment, orgs_fragment} = require("../../../../../../graphql/Fragments");
const {signable_doc_template_details_fragment} = require("../../../../general/doc-signing-settings/templates/commons");

//<editor-fold desc="inc_fragment">
exports.inc_fragment = ({removed, inc_employee = false, }) => `
    id
    created_at
    doc
    job_profile_doc
    expiry_updated
    removed
    contract_details{
        id
        contract_type
        daily_working_hours
        end_of_trial_period
        end_time
        expiry_date
        notes
        start_date
        start_time
    }
    salary_info{
        id
        deductible_list{
            id
            created_at
            text
            value
        }
        payment_type
        salary
        salary_interval
        wage
    }
    
    employee{
        ${inc_employee ? `
            ${employee_basic_personal_details_fragment}
            ${removed !== undefined ? `
                contract_list(where: {removed: {_eq: ${removed}}}){
                    id
                    contract_details{
                        expiry_date
                        end_of_trial_period
                    }
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
