const {employee_basic_personal_details_fragment, orgs_fragment} = require("../../../../../../graphql/Fragments");

//<editor-fold desc="inc_fragment">
exports.inc_fragment = ({removed, inc_employee = false,}) => {
    return (socket, data) => `
        id
        created_at
        removed
        days_booked
        due_to
        status
        type
        employee_comments
        reason
        notes
        doc
        date_approved
        date
        expiry_date
        expiry_updated
        
        employee{
            ${inc_employee ? `
                ${employee_basic_personal_details_fragment}
                ${removed !== undefined ? `
                    leave_list(where: {removed: {_eq: ${removed}}}){
                        id
                        expiry_date
                    }` : ``
                }
            ` : `
                id
            `}
        }
        approver{
            ${employee_basic_personal_details_fragment}
        }
        
        ${orgs_fragment}
    `;
};
//</editor-fold>
