const {orgs_fragment, employee_personal_details_fragment} = require("../../../../../graphql/Fragments");
const {getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (
	{
		socket,
		data,
		tbl,
		listName,
		listRename,
		inc_fragment,
		singular,
		attrs,
		isContract = false,
		isExpense = false,
	}
) => {
	console.log('data', data);
	
	let {
		offset = 0,
		limit = 50,
		//
		removed = false,
		//
		id,
		//
		view = 'Employee',
		mon, mon2, mon3,
		expiry_date = 'ALL',
		date_range,
		//
		department_id,
		job_position_id,
		team_id,
		supervisor_id,
		employee_id,
		//
		// ...attrs,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		client_filter,
		// orgs_filter = [],
	} = data;

	const orgs_filter = socket.orgsFilter(data);
	
	const {filter, filterEmployee} = getVariablesAndQueryConfig({
		orgs_filter,
		//
		id,
		//
		view,
		mon, mon2, mon3,
		expiry_date,
		date_range,
		//
		department_id,
		job_position_id,
		team_id,
		supervisor_id,
		employee_id,
		//
		...attrs,
		//
		logged_employee_id,
		site_id, project_id, client_id,
		//
		exact_orgs,
		isContract,
		isExpense,
	});
	
	const singularQueryName = singular.replace('/', '_').replace(' ', '');
	
	if (view === 'Employee') {
		//<editor-fold desc="ByGroup">
		return listGraphQL({
			query: `
                query listAllByGroup${singularQueryName}ByLoggedQuery {
                  hr_employees(
                      where: {
                          ${listName}_aggregate: {
                            count: {
                              predicate: {_gt: 0},
                              filter: {
                                removed: {_eq: ${removed}} 
                                ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
                                ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
                                ${filter}
                              }
                            }
                          }, 
                          ${listName}: {
                            removed: {_eq: ${removed}}
                            ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
                            ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
                            ${filter}
                          }
                          ${filterEmployee}
                      },
                      order_by: {lname: asc},
                      offset: ${offset},
                      ${limit > 0 ? `limit: ${limit}` : ''}
                  ) {
                      ${employee_personal_details_fragment}
                      ${isContract ? `
                          ${listName}(where: {removed: {_eq: ${removed}}}, order_by: {contract_details_aggregate: {max: {expiry_date: desc_nulls_last}}}){
                              ${inc_fragment({removed})}
                          }
                          ${listName}_no_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, contract_details: {expiry_date: {_is_null: true}}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listName}_expired_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, contract_details: {expiry_date: {_lte: "now()"}}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listName}_mon_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, contract_details: {expiry_date: {_gt: "now()", _lte: "${mon}"}}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listName}_2mon_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, contract_details: {expiry_date: {_gt: "${mon}", _lte: "${mon2}"}}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listName}_3mon_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, contract_details: {expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listName}_4mon_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, contract_details: {expiry_date: {_gt: "${mon3}"}}
                          }){
                              aggregate{
                                  count
                              }
                          }
                      ` :
											isExpense ? `
													${listRename ? `${listRename}:` : ``}${listName}(
                            where: {
                                removed: {_eq: ${removed}}
                            },
                            order_by: {date_submitted: desc_nulls_last}
                          ){
                              ${inc_fragment({removed})}
                          }
                          ${listRename || listName}_no_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, date_submitted: {_is_null: true}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listRename || listName}_expired_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, date_submitted: {_lte: "now()"}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listRename || listName}_mon_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, date_submitted: {_gt: "now()", _lte: "${mon}"}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listRename || listName}_2mon_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, date_submitted: {_gt: "${mon}", _lte: "${mon2}"}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listRename || listName}_3mon_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, date_submitted: {_gt: "${mon2}", _lte: "${mon3}"}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listRename || listName}_4mon_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, date_submitted: {_gt: "${mon3}"}
                          }){
                              aggregate{
                                  count
                              }
                          }
											` : `
                          ${listRename ? `${listRename}:` : ``}${listName}(
                            where: {
                                removed: {_eq: ${removed}}
                                ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
                                ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
                            }, 
                            order_by: {expiry_date: desc_nulls_last}
                          ){
                              ${inc_fragment({removed})}
                          }
                          ${listRename || listName}_no_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, expiry_date: {_is_null: true}
                              ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
                              ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listRename || listName}_expired_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, expiry_date: {_lte: "now()"}
                              ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
                              ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listRename || listName}_mon_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, expiry_date: {_gt: "now()", _lte: "${mon}"}
                              ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
                              ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listRename || listName}_2mon_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon}", _lte: "${mon2}"}
                              ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
                              ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listRename || listName}_3mon_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}
                              ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
                              ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
                          }){
                              aggregate{
                                  count
                              }
                          }
                          ${listRename || listName}_4mon_expiry_aggregate:${listName}_aggregate(where: {
                              removed: {_eq: ${removed}}, expiry_date: {_gt: "${mon3}"}
                              ${singular === 'PrDP' ? `,type: {_eq: "PrDP"}` : ``}
                              ${singular === 'ID/Passport' ? `,type: {_eq: "ID/Passport"}` : ``}
                          }){
                              aggregate{
                                  count
                              }
                          }
                      `}
                      
                      ${orgs_fragment}
                  }
                }
			`,
			operationName: `listAllByGroup${singularQueryName}ByLoggedQuery`,
		});
		//</editor-fold>
	} else {
		//<editor-fold desc="ByEach">
		return listGraphQL({
			query: `
                query listAllByEach${singularQueryName}ByLoggedQuery {
                  ${tbl}(
                      where: {
                         removed: {_eq: ${removed}}, 
                         ${singular === 'PrDP' ? `type: {_eq: "PrDP"}` : ``}
                         ${singular === 'ID/Passport' ? `type: {_eq: "ID/Passport"}` : ``}
                         ${filter}
                         ${filterEmployee}
                      },
                      order_by: {employee: {lname: asc}},
                      offset: ${offset},
                      ${limit > 0 ? `limit: ${limit}` : ''}
                  ) {
                      ${inc_fragment({removed, inc_employee: true})}
                      ${(singular === 'PrDP' || singular === 'ID/Passport') ? '' : orgs_fragment}
                  }
                }
			`,
			operationName: `listAllByEach${singularQueryName}ByLoggedQuery`,
		});
		//</editor-fold>
	}
}
//</editor-fold>
