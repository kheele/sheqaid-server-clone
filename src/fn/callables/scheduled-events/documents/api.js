const {send: send__users} = require("./send__users");
const {send: send__employees} = require("./send__employees");
const {query_company, query_client, query_site, query_project} = require("./api_queries");

// <editor-fold defaultstate="collapsed" desc="onDocumentsExpiry">
exports.onDocumentsExpiry = async (data) => {
	// await authorize();

	const item_company = await getRelayOne({
		query: query_company,
		operationName: "getCompanyDocumentsExpiryQuery",
		variables: {
			today_date: new Date(),
			mon_date: new Date().addMonths(1),
		},
		multi_queries: true,
	});
	const item_client = await getRelayOne({
		query: query_client,
		operationName: "getClientDocumentsExpiryQuery",
		variables: {
			today_date: new Date(),
			mon_date: new Date().addMonths(1),
		},
		multi_queries: true,
	});
	const item_project = await getRelayOne({
		query: query_project,
		operationName: "getProjectDocumentsExpiryQuery",
		variables: {
			today_date: new Date(),
			mon_date: new Date().addMonths(1),
		},
		multi_queries: true,
	});
	const item_site = await getRelayOne({
		query: query_site,
		operationName: "getSiteDocumentsExpiryQuery",
		variables: {
			today_date: new Date(),
			mon_date: new Date().addMonths(1),
		},
		multi_queries: true,
	});
	if (!item_company && !item_client && !item_project && !item_site) {
		return;
	}

	// console.log('onDocumentsExpiry item_company', item_company)
	// console.log('onDocumentsExpiry item_client', item_client)
	// console.log('onDocumentsExpiry item_project', item_project)
	// console.log('onDocumentsExpiry item_site', item_site)

	const {
		user_list: company_user_list = [],
		employee_list:company_employee_list =[],
	} = item_company || {};

	const {
		user_list: client_user_list = [],
		employee_list:client_employee_list =[],
	} = item_client || {};

	const {
		user_list: project_user_list = [],
		employee_list:project_employee_list =[],
	} = item_project || {};

	const {
		user_list: site_user_list = [],
		employee_list:site_employee_list =[],
	} = item_site || {};

    const user_list = [...company_user_list, ...client_user_list, ...project_user_list, ...site_user_list];
    const employee_list = [...company_employee_list, ...client_employee_list, ...project_employee_list, ...site_employee_list];

	if(!user_list.isEmpty()) {
		await send__users(user_list);
	}

	if(!employee_list.isEmpty()) {
		await send__employees(employee_list);
	}

};
// </editor-fold>

