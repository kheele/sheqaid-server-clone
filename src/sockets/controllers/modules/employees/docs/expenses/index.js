const findByIdImpl = require("../../../findByIdImpl");

const createImpl = require("../../../createImpl");
const updateImpl = require("../../../updateImpl");
const listHRDocsByLogged = require('./listHRDocsByLogged');
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
const {inc_fragment} = require("./commons");
const {updateExpense} = require("./update");

const details_fragment_dashboard = `
	id
  
  #expense_list
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
	      sum{
	        amount
	      }
      }
  }
  list_awaiting_approval_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    status: {_eq: "Awaiting Approval"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_awaiting_payment_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    status: {_eq: "Awaiting Payment"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_completed_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    status: {_eq: "Completed"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_rejected_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    status: {_eq: "Rejected"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  
  #
  list_paid_with_bank_transfer_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    paid_with: {_eq: "Bank Transfer"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_paid_with_cash_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    paid_with: {_eq: "Cash"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_paid_with_company_card_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    paid_with: {_eq: "Company Card"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_paid_with_invoice_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    paid_with: {_eq: "Invoice"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_paid_with_personal_card_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    paid_with: {_eq: "Personal Card"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_paid_with_petty_cash_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	    paid_with: {_eq: "Petty Cash"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  
  #
  list_category_beverage_clients_and_training_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Beverage - Clients and Training"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_business_technologies_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Business Technologies"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_education_or_training_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Education / Training"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_fuel_and_oil_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Fuel and Oil"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_kilometers_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Kilometers"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_material_or_project_supplies_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Material/Project Supplies"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_meals_and_entertainment_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Meals and Entertainment"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_medical__employer_contribution_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Medical - Employer Contribution"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_office_expense__refreshments_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Office Expense-Refreshments"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_office_supplies_or_printing_and_stationary_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Office Supplies/Printing and Stationary"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_other_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Other"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_parking_and_tolls_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Parking and Tolls"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_postage_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Postage"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_professional_registrations_or_memberships_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Professional Registrations/Memberships"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_rent_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Rent"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_repairs_and_maintenance_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Repairs and Maintenance"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_staff_welfare_and_gifts_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Staff Welfare and Gifts"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_telephone_and_internet_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Telephone and Internet"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_transportation_public_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Transportation (taxi, bus, train)"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
  list_category_travel_and_accommodation_aggregate:expense_list_aggregate(where: {
      removed: {_eq: false},
	  category: {_eq: "Travel and Accommodation"}  
  }){
      aggregate{
          count
	      sum{
	        amount
	      }
      }
  }
`;

const details_fragment_dashboard_date_range = `
	id
	#expense_list
	list_aggregate:expense_list_aggregate(where: {
	    removed: {_eq: false},
		date: {_gte: $dateStart, _lte: $dateEnd}
	}){
	  aggregate{
	    count
	    sum{
	        amount
	    }
	  }
	}
`;

const args = {
    name: "Expense",
    tbl: "hr_employees_docs_expenses",
    details_fragment: inc_fragment({inc_employee: true}),
    uploadUpdate: ({id, data: {employee}}) => ({
        new_name: `employees/${employee.id}/docs/expenses/${id}/Expense-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
        key: 'doc',
    }),
};

const path = "employees/docs/expenses";

eventManager.on(`${path}/create`, createImpl(args));

eventManager.on(`${path}/update`, updateExpense);

// eventManager.on(`${path}/delete`, deleteImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listHRDocsByLogged);

eventManager.on(`${path}/dashboard/single`, findByIdEmployeeDashboardStats({
    name: "Expenses",
    // listName: "expense_list",
    mapResults: hrDocsDashboardMapResults,
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

eventManager.on(`${path}/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
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

                if (!stats) return {
                    id,
                    month_year: Dates.parse(dateStart).formatMonthYear(),
                    count: 0,
                    sum: {amount: 0}
                };

                const {id: _id, data: {list_aggregate: {aggregate: {count, sum}}}} = stats;
                return {id, month_year: Dates.parse(dateStart).formatMonthYear(), count, sum};
            })
        );
    },
}));

eventManager.on(`${path}/dashboard`, findByIdOrgDashboardStatsImpl({
    name: "Expenses",
    listName: "expense_list",
    mapResults: hrDocsDashboardMapResults,
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

eventManager.on(`${path}/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
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

                if (!stats) return {
                    id,
                    month_year: Dates.parse(dateStart).formatMonthYear(),
                    count: 0,
                    sum: {amount: 0}
                };

                const {id: _id, data: {list_aggregate: {aggregate: {count, sum}}}} = stats;
                return {id, month_year: Dates.parse(dateStart).formatMonthYear(), count, sum};
            })
        );
    },
}));
//333