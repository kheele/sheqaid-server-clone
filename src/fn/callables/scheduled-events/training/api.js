const {send: send__users} = require("./send__users");
const {send: send__employees} = require("./send__employees");

//<editor-fold desc="where">
const where_missed = `
	training_plan_list: {
	  year: {_lt: $today_year},
	  completion_status: {_in: ["Not Started", "Outstanding"]},
	}
  removed:{_eq: false},
`;

const where_curr_year = `
	training_plan_list: {
	  year: {_eq: $today_year},
	  completion_status: {_in: ["Not Started", "Outstanding"]},
	}
  removed:{_eq: false},
`;
//</editor-fold>

//<editor-fold desc="simple_orgs_fragment">
const simple_orgs_fragment = `
    company{
        id
        name
    }
    client{
        id
        name
    }
    project{
        id
        name
    }
    site{
        id
        name
    }
`;
//</editor-fold>

//<editor-fold desc="fragment">
const fragment = `
    id
    fname
    lname
    dob
    sex
    id_num
    passport_num
    phone
    email
    employment_num
    employment_date
    job_position{
        id
        name
    }
    department{
        id
        name
    }
    
    list_missed: training_plan_list(
      where: {
	      year: {_lt: $today_year},
        completion_status: {_in: ["Not Started", "Outstanding"]},
      },
      order_by: {year: desc}
    ){
        completion_status
        year
        course{
          id
          name
        }
        training{
          id
          course{
	          id
	          name
	        }
        }
    }
    list_curr_year: training_plan_list(
      where: {
	      year: {_eq: $today_year},
        completion_status: {_in: ["Not Started", "Outstanding"]},
      },
      order_by: {year: desc}
    ){
        completion_status
        year
        course{
          id
          name
        }
        training{
          id
          course{
	          id
	          name
	        }
        }
    }
      
    ${simple_orgs_fragment}
`;
//</editor-fold>

//<editor-fold desc="lists_fragment">
const lists_fragment = `
  #list
  list_missed:employee_list(
    where: {
        ${where_missed} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}, lname: asc, fname: asc}
  ){
    ${fragment}
  }
  list_curr_year:employee_list(
    where: {
        ${where_curr_year} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}, lname: asc, fname: asc}
  ){
    ${fragment}
  }
`;
//</editor-fold>

//<editor-fold desc="orgs_fragment">
const orgs_fragment = `
    company{
        id
        name
        ${lists_fragment}
    }
    client{
        id
        name
        ${lists_fragment}
    }
    project{
        id
        name
        ${lists_fragment}
    }
    site{
        id
        name
        ${lists_fragment}
    }
`;
//</editor-fold>

//<editor-fold desc="user_fragment">
const user_fragment = ` 
    id
    fname
    lname
    username
    notifications_settings{
        receive_training_management_notifs
    }
    ${orgs_fragment}
`;
//</editor-fold>

//<editor-fold desc="employee_fragment">
const employee_fragment = `
    id
    fname
    lname
    email
    ${orgs_fragment}
`;
//</editor-fold>

//[Not Started, Outstanding, In Progress, Completed]

//<editor-fold desc="query">
const query = `
query getTrainingPlanExpiryQuery($today_year: Int) {
  user_list:default_users_connection(
      where: {
          removed: {_eq: false}, 
          notifications_settings: {receive_training_management_notifs: {_eq: true}},
          _or:[
            {
              site: {
                employee_list: {
	                training_plan_list: {
	                  year: {_lte: $today_year},
	                  completion_status: {_in: ["Not Started", "Outstanding"]},
	                }
                  removed:{_eq: false},
                }
              },
            },
            {
              project: {
                employee_list: {
	                training_plan_list: {
	                  year: {_lte: $today_year},
	                  completion_status: {_in: ["Not Started", "Outstanding"]}
	                }
                  removed:{_eq: false},
                }
              },
            },
            {
              client: {
                employee_list: {
	                training_plan_list: {
	                  year: {_lte: $today_year},
	                  completion_status: {_in: ["Not Started", "Outstanding"]}
	                }
                  removed:{_eq: false},
                }
              },
            },
            {
              company: {
                employee_list: {
	                training_plan_list: {
	                  year: {_lte: $today_year},
	                  completion_status: {_in: ["Not Started", "Outstanding"]}
	                }
                  removed:{_eq: false},
                }
              }
            }
          ],
     }
  ){
    edges{
      node{
        ${user_fragment}
      }
    }
  }
}
`;
//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="onTrainingPlanExpiry">
exports.onTrainingPlanExpiry = async (data) => {
	// await authorize();

	const item = await getRelayOne({
		query,
		operationName: "getTrainingPlanExpiryQuery",
		variables: {
			today_year: new Date().getFullYear(),
		},
		multi_queries: true,
	});
	if (!item) {
		// res.send();
		return;
	}

	// console.log('onTrainingPlanExpiry', item)

	const {
		user_list = [],
		employee_list =[],
	} = item;

	if(!user_list.isEmpty()) {
		await send__users(user_list);
	}

	if(!employee_list.isEmpty()) {
		await send__employees(employee_list);
	}

};
// </editor-fold>

