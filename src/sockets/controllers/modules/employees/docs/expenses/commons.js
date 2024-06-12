const {employee_basic_personal_details_fragment, orgs_fragment} = require("../../../../../../graphql/Fragments");

//<editor-fold desc="inc_fragment">
exports.inc_fragment = ({removed, inc_employee = false, }) => `
    id
    created_at
    removed
    category
    date
    amount
    status
		currency_country{
			id
			name
			currency
			currency_name
			iso2
		}
    paid_with
    comments
    date_submitted
    date_approved
    date_compensated
    
    employee{
        ${inc_employee ? `
            ${employee_basic_personal_details_fragment}
            ${removed !== undefined ? `
                expense_list(where: {removed: {_eq: ${removed}}}){
                    id
                    date
                }` : ``
}
        ` : `
            id
        `}
    }
    
    approver{
        ${employee_basic_personal_details_fragment}
    }
    compensator{
        ${employee_basic_personal_details_fragment}
    }
    
    ${orgs_fragment}
`;
//</editor-fold>
