const {employee_basic_personal_details_fragment, orgs_fragment} = require("../../../../../../graphql/Fragments");

//<editor-fold desc="inc_fragment">
exports.inc_fragment = ({removed, inc_employee = false, }) => {
    return (socket, data) => `
        id
        created_at
        removed
        accreditation_num
        certificate_num
        competency_type
        type
        doc
        issued_date
        expiry_date
        expiry_updated
        training{
            id
            course{
                id
                name
            }
        }
        employee{
            ${inc_employee ? `
                ${employee_basic_personal_details_fragment}
                ${removed !== undefined ? `
                    competency_list(where: {removed: {_eq: ${removed}}}){
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
