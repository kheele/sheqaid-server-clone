const {employee_basic_personal_details_fragment, orgs_fragment} = require("../../../../../../graphql/Fragments");

//<editor-fold desc="inc_fragment">
exports.inc_fragment = ({removed, inc_employee = false,}) => {
    return (socket, data) => `
        id
        created_at
        removed
        follow_up_date
        annexture_3
        fitness_option
        restrictions
        doc
        annexture3_doc
        expiry_date
        expiry_updated
        
        employee{
            ${inc_employee ? `
                ${employee_basic_personal_details_fragment}
                ${removed !== undefined ? `
                    medical_list(where: {removed: {_eq: ${removed}}}){
                        id
                        expiry_date
                    }` : ``
    }
            ` : `
                id
            `}
        }
        ${orgs_fragment}
    `;
};
//</editor-fold>
