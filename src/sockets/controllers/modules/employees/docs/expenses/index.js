const {employee_basic_personal_details_fragment} = require("../../../../../../graphql/Fragments");

const createImpl = require("../../../createImpl");
const findByIdImpl = require('./findByIdImpl');
const listImpl = require('./listImpl');
const {
	getHRDocsDashboardFragment, hrDocsDashboardMapResults
} = require("../hrDocsDashboardImpl");

const {
	getDateRangeDashboardFragment,
} = require("../hrDocsDateRangeDashboardImpl");

const {findByIdEmployeeDateRangeDashboardStats} = require("../../../findByIdEmployeeDateRangeDashboardStatsImpl");
const {findByIdOrgDateRangeDashboardStatsImpl} = require("../../../findByIdOrgDateRangeDashboardStatsImpl");
const {findByIdOrgDashboardStatsImpl} = require("../../../findByIdOrgDashboardStatsImpl");
const {findByIdEmployeeDashboardStats} = require("../../../findByIdEmployeeDashboardStatsImpl");

const args = {
	name: "Expenses",
	tbl: "hr_employees_docs_expenses",
	// details_fragment,
	details_fragment: `
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
		employee_id
		employee{
			${employee_basic_personal_details_fragment}
		}
		approver_id
		approver{
			${employee_basic_personal_details_fragment}
		}
		compensator_id
		compensator{
			${employee_basic_personal_details_fragment}
		}
	`,
	// orgs_fragment: null,
	uploadUpdate: ({id, data:{employee_id}}) => ({
		new_name: `employees/${employee_id}/docs/expenses/${id}/Expense-doc-${Dates.formatTimestamp(new Date())}`,
		key: 'doc',
	}),
	// onUploadComplete: (id) => ({
	// 	new_name: `employees/docs/${id}/doc`,
	// 	key: 'doc',
	// }),
};

const path = "employees/docs/expenses/";

eventManager.on(`${path}create`, createImpl(args));

// eventManager.on(`${path}update`, updateImpl(args));

// eventManager.on(`${path}delete`, deleteImpl(args));

// eventManager.on(`${path}findById`, findByIdImpl(args));

eventManager.on("employees/docs/expenses/findById", findByIdImpl);

eventManager.on("employees/docs/expenses/listByLogged", listImpl);

const details_fragment_dashboard = `
	id
  
  #expense_list
  list_active_aggregate:expense_list_aggregate(where: {removed: {_eq: false}}){
      aggregate{
          count
      }
  }
  list_removed_aggregate:expense_list_aggregate(where: {removed: {_eq: true}}){
      aggregate{
          count
      }
  }
  
  #
  list_unsubmitted_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    status: {_eq: "Unsubmitted"}
	    
  }){
      aggregate{
          count
      }
  }
  list_awaiting_approval_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    status: {_eq: "Awaiting Approval"}
	    
  }){
      aggregate{
          count
      }
  }
  list_awaiting_payment_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    status: {_eq: "Awaiting Payment"}
	    
  }){
      aggregate{
          count
      }
  }
  list_completed_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    status: {_eq: "Completed"}
	    
  }){
      aggregate{
          count
      }
  }
  list_rejected_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    status: {_eq: "Rejected"}
	    
  }){
      aggregate{
          count
      }
  }
  
  #
  list_paid_with_bank_transfer_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    paid_with: {_eq: "Bank Transfer"}
	    
  }){
      aggregate{
          count
      }
  }
  list_paid_with_cash_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    paid_with: {_eq: "Cash"}
	    
  }){
      aggregate{
          count
      }
  }
  list_paid_with_company_card_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    paid_with: {_eq: "Company Card"}
	    
  }){
      aggregate{
          count
      }
  }
  list_paid_with_invoice_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    paid_with: {_eq: "Invoice"}
	    
  }){
      aggregate{
          count
      }
  }
  list_paid_with_personal_card_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    paid_with: {_eq: "Personal Card"}
	    
  }){
      aggregate{
          count
      }
  }
  list_paid_with_petty_cash_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    paid_with: {_eq: "Petty Cash"}
	    
  }){
      aggregate{
          count
      }
  }
  
  #
  list_category_beverage_clients_and_training_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    category: {_eq: "Beverage - Clients and Training"}
	    
  }){
      aggregate{
          count
      }
  }
  list_category_business_technologies_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    category: {_eq: "Business Technologies"}
	    
  }){
      aggregate{
          count
      }
  }
  list_category_education_or_training_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    category: {_eq: "Education / Training"}
	    
  }){
      aggregate{
          count
      }
  }
`;

const details_fragment_dashboard_date_range = `
	id
	#expense_list
	list_aggregate:expense_list_aggregate(where: {
	  removed: {_eq: false},
		date_compensated: {_gte: $dateStart, _lte: $dateEnd}
	}){
	  aggregate{
	    count
	  }
	}
`;

eventManager.on(`employees/docs/expenses/dashboard/single`, findByIdEmployeeDashboardStats({
	name: "Expenses",
	// listName: "expense_list",
	onCreateQuery: async (data, operationName) => {
		const {
			id,
			mon,
			mon2,
			mon3,
			//
			// site_id, project_id, client_id, company_id,
		} = data;
		return getGraphQLOne({
			// variables: {id, mon, mon2, mon3},
			variables: {id},
			query: `
	      query ${operationName}($id: bigint) {
	        hr_employees(where: {id: {_eq: $id}}) {
            ${details_fragment_dashboard}
          }
	      }
	    `,
			operationName,
		});
	},
}));

eventManager.on(`employees/docs/expenses/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
	name: "Expenses",
	// listName: "expense_list",
	onCreateQuery: async (data, operationName) => {
		const {
			id,
			dates,
			//
			// site_id, project_id, client_id, company_id,
		} = data;
		return Promise.all(
			dates.map(async date => {
				const {start: dateStart, end: dateEnd} = date;
				const stats = await getGraphQLOne({
					variables: {id, dateStart, dateEnd},
					query: `
			      query ${operationName}($id: bigint, $dateStart: date, $dateEnd: date) {
			        hr_employees(where: {id: {_eq: $id}}) {
                ${details_fragment_dashboard_date_range}
              }
			      }
			    `,
					operationName,
				});
				
				if (!stats) return {id, month_year: Dates.parse(dateStart).formatMonthYear(), count: 0};
				
				const {id: _id, data: {list_aggregate: {aggregate: {count}}}} = stats;
				return {id, month_year: Dates.parse(dateStart).formatMonthYear(), count};
			})
		);
	},
}));

eventManager.on(`employees/docs/expenses/dashboard`, findByIdOrgDashboardStatsImpl({
	name: "Expenses",
	listName: "expense_list",
	onCreateQuery: async (data, operationName, tbl) => {
		const {
			id,
			mon,
			mon2,
			mon3,
			//
			// site_id, project_id, client_id, company_id,
		} = data;

		return getGraphQLOne({
			// variables: {id, mon, mon2, mon3},
			variables: {id},
			query: `
		      query ${operationName}($id: bigint) {
		        ${tbl}(
		            where: {id: {_eq: $id},},
		        ) {
		          ${details_fragment_dashboard}
		        }
		      }
		    `,
			operationName,
		});
	},
}));

eventManager.on(`employees/docs/expenses/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
	name: "Expenses",
	listName: "expense_list",
	onCreateQuery: async (data, operationName, tbl) => {
		const {
			id,
			dates,
			//
			// site_id, project_id, client_id, company_id,
		} = data;

		return Promise.all(
			dates.map(async date => {
				const {start: dateStart, end: dateEnd} = date;
				const stats = await getGraphQLOne({
					variables: {id, dateStart, dateEnd},
					query: `
				      query ${operationName}($id: bigint, $dateStart: date, $dateEnd: date) {
				        ${tbl}(
				            where: {id: {_eq: $id}},
				        ) {
				          ${details_fragment_dashboard_date_range}
				        }
				      }
				    `,
					operationName,
				});

				if (!stats) return {id, month_year: Dates.parse(dateStart).formatMonthYear(), count: 0};

				const {id: _id, data: {list_aggregate: {aggregate: {count}}}} = stats;
				return {id, month_year: Dates.parse(dateStart).formatMonthYear(), count};
			})
		);
	},
}));