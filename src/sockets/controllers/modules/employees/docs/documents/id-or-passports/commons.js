const {employee_basic_personal_details_fragment, orgs_fragment} = require("../../../../../../../graphql/Fragments");

//<editor-fold desc="inc_fragment">
exports.inc_fragment = ({removed, inc_employee = false,}) => {
    return (socket, data) => `
        id
        created_at
        expiry_date
        type
        desc
        doc
        is_default
        removed
        
        employee{
            ${inc_employee ? `
                ${employee_basic_personal_details_fragment}
                ${removed !== undefined ? `
                    id_or_passport_list:document_list(where: {removed: {_eq: ${removed}}, type: {_eq: "ID/Passport"}}){
                        id
                        expiry_date
                    }` : ``
                }
            ` : `
                id
            `}
            ${orgs_fragment}
        }
    `;
};
//</editor-fold>
