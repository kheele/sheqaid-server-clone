const {orgs_fragment, employee_personal_details_fragment} = require("../../../../../graphql/Fragments");
const {getVariablesAndQueryConfig} = require('./commons-ppe-issue');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	console.log('data', data)
	
	let {
		offset = 0,
		limit = 50,
		//
		removed = false,
		id,
		incContractors = false,
		view,
		ppe_type_list,
		employee_list,
		team_list,
		department_list,
		job_position_list,
		name,
		id_or_pass_num,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
		//
		client_filter,
		// orgs_filter = [],
	} = data;

	const orgs_filter = socket.orgsFilter(data);
	
	const {filter} = getVariablesAndQueryConfig({
		orgs_filter,
		id,
		//
		incContractors,
		view,
		ppe_type_list,
		employee_list,
		team_list,
		department_list,
		job_position_list,
		name,
		id_or_pass_num,
		//
		site_id, project_id, client_id,
		//
		exact_orgs
	});
	
	// return listGraphQL({
	// 	query: `
	// 		query listAllEmployeesByLoggedQuery {
	// 			proxy_employee__ppe_type(
	// 			  where: {
	// 					employee: {
	// 						removed: {_eq: ${removed}},
	// 						${filter}
	// 					}
	// 			  },
	//         order_by: {employee: {lname: asc}},
	// 				offset: ${offset},
	// 				${limit > 0 ? `limit: ${limit}` : ''}
	// 			) {
  //         employee{
  //           ${employee_personal_details_fragment}
  //           ${incContractors ? `
	//           contractor {
	//             id
	//             name
	//           }` : ''}
	//           ${orgs_fragment}
  //         }
  //         ppe_type{
  //           id
  //           name
  //           is_issued
  //           ppe_item_list{
  //             id
  //           }
  //         }
	// 			}
	// 		}
	// 	`,
	// 	operationName: "listAllEmployeesByLoggedQuery",
	// });
	
	if(view === "Employee") {
		return listGraphQL({
			query: `
			query listAllEmployeesByLoggedQuery {
				hr_employees(
				  where: {
						removed: {_eq: false},
						ppe_type_list_aggregate: {count: {filter: {ppe_type: {removed:{_eq: false}}}, predicate: {_gt: 0}}},
						${filter}
				  },
	        order_by: {lname: asc},
					offset: ${offset},
					${limit > 0 ? `limit: ${limit}` : ''}
				) {
          ${employee_personal_details_fragment}
          
          ppe_type_list(where: {ppe_type: {removed: {_eq: false}}}){
            id
            created_at
            ppe_type{
              id
              removed
              name
              profile_pic
              unit
              duration_type
              duration_value
              notes
              ppe_item_list(where: {removed: {_eq: false}}){
                id
		            created_at
		            notes
		            profile_pic
		            serial_num
		            purchase_date
		            condition
		            ppe_type{
		              id
		            }
		          }
            }
            is_issued
          }
          ppe_item_list(where: {ppe_item:{removed: {_eq: false}}}){
            id
            ppe_item{
              id
	            created_at
	            notes
	            profile_pic
	            serial_num
	            purchase_date
	            condition
	            ppe_type{
			          id
	            }
            }
		      }
          
          ${incContractors ? `
          contractor {
            id
            name
          }` : ''}
          ${orgs_fragment}
				}
			}
		`,
			operationName: "listAllEmployeesByLoggedQuery",
		});
	} else if(view === "Team") {
		return listGraphQL({
			query: `
			query listAllTeamsByLoggedQuery {
				default_teams(
				  where: {
						status: {_eq: "Active"},
						ppe_type_list_aggregate: {count: {filter: {ppe_type: {removed:{_eq: false}}}, predicate: {_gt: 0}}},
						${filter}
				  },
	        order_by: {name: asc},
					offset: ${offset},
					${limit > 0 ? `limit: ${limit}` : ''}
				) {
					id
					created_at
					name
				  status
				  
				  supervisor {
				    id
				    fname
				    lname
				    email
				    phone
				    job_position{
				      id
				      name
				    }
				  }
          
          ppe_type_list(where: {ppe_type: {removed: {_eq: false}}}){
            id
            ppe_type{
              id
              removed
              name
              profile_pic
              unit
              duration_type
              duration_value
              notes
              ppe_item_list(where: {removed: {_eq: false}}){
                id
		            created_at
		            notes
		            profile_pic
		            serial_num
		            purchase_date
		            condition
		            ppe_type{
		              id
		            }
		          }
            }
          }
          
          ${incContractors ? `
          contractor {
            id
            name
          }` : ''}
          ${orgs_fragment}
				}
			}
		`,
			operationName: "listAllTeamsByLoggedQuery",
		});
	} else if(view === "Department") {
		return listGraphQL({
			query: `
			query listAllDepartmentsByLoggedQuery {
				default_departments(
				  where: {
						removed: {_eq: false},
						ppe_type_list_aggregate: {count: {filter: {ppe_type: {removed:{_eq: false}}}, predicate: {_gt: 0}}},
						${filter}
				  },
	        order_by: {name: asc},
					offset: ${offset},
					${limit > 0 ? `limit: ${limit}` : ''}
				) {
				  id
				  name
				  removed
          
          ppe_type_list(where: {ppe_type: {removed: {_eq: false}}}){
            id
            ppe_type{
              id
              removed
              name
              profile_pic
              unit
              duration_type
              duration_value
              notes
              ppe_item_list(where: {removed: {_eq: false}}){
                id
		            created_at
		            notes
		            profile_pic
		            serial_num
		            purchase_date
		            condition
		            ppe_type{
		              id
		            }
		          }
            }
          }
          
          ${incContractors ? `
          contractor {
            id
            name
          }` : ''}
          ${orgs_fragment}
				}
			}
		`,
			operationName: "listAllDepartmentsByLoggedQuery",
		});
	} else if(view === "Job Position") {
		return listGraphQL({
			query: `
			query listAllJobPositionsByLoggedQuery {
				default_job_positions(
				  where: {
						removed: {_eq: false},
						ppe_type_list_aggregate: {count: {filter: {ppe_type: {removed:{_eq: false}}}, predicate: {_gt: 0}}},
						${filter}
				  },
	        order_by: {name: asc},
					offset: ${offset},
					${limit > 0 ? `limit: ${limit}` : ''}
				) {
					id
				  name
				  desc
				  doc
				  job_position_owner
				  
				  job_category {
				    id
				    name
				  }
          
          ppe_type_list(where: {ppe_type: {removed: {_eq: false}}}){
            id
            ppe_type{
              id
              removed
              name
              profile_pic
              unit
              duration_type
              duration_value
              notes
              ppe_item_list(where: {removed: {_eq: false}}){
                id
		            created_at
		            notes
		            profile_pic
		            serial_num
		            purchase_date
		            condition
		            ppe_type{
		              id
		            }
		          }
            }
          }
          
          ${incContractors ? `
          contractor {
            id
            name
          }` : ''}
          ${orgs_fragment}
				}
			}
		`,
			operationName: "listAllJobPositionsByLoggedQuery",
		});
	} else if(view === "PPE Type") {
		return listGraphQL({
			query: `
			query listAllPPETypesByLoggedQuery {
				ppe_types(
				  where: {
						removed: {_eq: false},
						${filter}
				  },
	        order_by: {name: asc},
					offset: ${offset},
					${limit > 0 ? `limit: ${limit}` : ''}
				) {
					id
				  created_at
				  removed
				  name
				  unit
				  duration_type
				  duration_value
				  notes
				  profile_pic
          
          ppe_item_list(where: {removed: {_eq: false}}){
            id
	          created_at
	          notes
	          profile_pic
	          serial_num
	          purchase_date
	          condition
	          ppe_type{
			        id
            }
		      }
          
          ${incContractors ? `
          contractor {
            id
            name
          }` : ''}
          ${orgs_fragment}
				}
			}
		`,
			operationName: "listAllPPETypesByLoggedQuery",
		});
	}
}
//</editor-fold>
