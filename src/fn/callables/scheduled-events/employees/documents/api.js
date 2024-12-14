const {send: send__users} = require("./send__users");
const {send: send__employees} = require("./send__employees");

const fragment_attr = {
	receive_employees_expired_docs_medicals: `
		#date
		annexture_3
		restrictions
	`,
	// receive_employees_expired_docs_medicals: `
	// 	date
	// 	annexture_3
	// 	restrictions
	// `,
};

//<editor-fold desc="where">
const where_expired = `
    expiry_date: {_lte: $today_date},
    removed:{_eq: false},
`;

const where_month_expiry = `
    expiry_date: {_gt: $today_date, _lte: $mon_date},
    removed:{_eq: false},
`;

const where_no_expiry = `
    expiry_date: {_is_null: true},
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
const fragment = ({notification_key}) => `
  id
  created_at
  expiry_date
  expiry_updated
  doc
  removed
  ${fragment_attr[notification_key]}
  employee{
    id
    full_name
    sex
    dob
    id_num
    passport_num
    email
    phone
    employment_num
    employment_date
    department{
      id
      name
    }
    job_position{
      id
      name
    }
  }
  contractor{
    id
    name
  }
  contractor_site{
    id
    name
  }
  
  ${simple_orgs_fragment}
`;
//</editor-fold>

//<editor-fold desc="lists_fragment">
const lists_fragment = ({list, notification_key}) => `
  #${list}
  ${list}_expired:${list}(
    where: {
        ${where_expired} 
    },
    order_by: {company: {name: asc}, client: {name: asc}}
  ){
    ${fragment({notification_key})}
  }
  ${list}_month_expiry:${list}(
    where: {
        ${where_month_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}}
  ){
    ${fragment({notification_key})}
  }
  ${list}_no_expiry:${list}(
    where: {
        ${where_no_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}}
  ){
    ${fragment({notification_key})}
  }
`;
//</editor-fold>

//<editor-fold desc="orgs_fragment">
const orgs_fragment = ({list, notification_key}) => `
    company{
        id
        name
        ${lists_fragment({list, notification_key})}
    }
    client{
        id
        name
        ${lists_fragment({list, notification_key})}
    }
    project{
        id
        name
        ${lists_fragment({list, notification_key})}
    }
    site{
        id
        name
        ${lists_fragment({list, notification_key})}
    }
`;
//</editor-fold>

//<editor-fold desc="user_fragment">
const user_fragment = ({list, notification_key}) => ` 
    id
    fname
    lname
    username
    notifications_settings{
        ${notification_key}
    }
    ${orgs_fragment({list, notification_key})}
`;
//</editor-fold>

//<editor-fold desc="employee_fragment">
const employee_fragment = ({list, notification_key}) => `
    id
    fname
    lname
    email
    ${orgs_fragment({list, notification_key})}
`;
//</editor-fold>

//<editor-fold desc="query">
const query = ({list, notification_key}) => `
query onEmployeeDocsExpiryQuery($today_date: date, $mon_date: date) {
  user_list:default_users_connection(
      where: {
          removed: {_eq: false}, 
          notifications_settings: {${notification_key}: {_eq: true}},
          _or:[
            {
              site: {
                ${list}: {
                  _or:[
                    {expiry_date: {_is_null: true}},
                    {expiry_date: {_lte: $mon_date}}
                  ],
                  removed:{_eq: false},
                }
              },
            },
            {
              project: {
                ${list}: {
                  _or:[
                    {expiry_date: {_is_null: true}},
                    {expiry_date: {_lte: $mon_date}}
                  ],
                  removed:{_eq: false},
                }
              },
            },
            {
              client: {
                ${list}: {
                  _or:[
                    {expiry_date: {_is_null: true}},
                    {expiry_date: {_lte: $mon_date}}
                  ],
                  removed:{_eq: false},
                }
              },
            },
            {
              company: {
                ${list}: {
                  _or:[
                    {expiry_date: {_is_null: true}},
                    {expiry_date: {_lte: $mon_date}}
                  ],
                  removed:{_eq: false},
                }
              }
            }
          ],
     }
  ){
    edges{
      node{
        ${user_fragment({list, notification_key})}
      }
    }
  }
}
`;
//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="onEmployeeDocsExpiry">
exports.onEmployeeDocsExpiry = async (data) => {
	// await authorize();

	const item = await getRelayOne({
		query: query({
			list: 'medical_list',
			notification_key: 'receive_employees_expired_docs_medicals',
		}),
		operationName: "onEmployeeDocsExpiryQuery",
		variables: {
			today_date: new Date(),
			mon_date: new Date().addMonths(1),
		},
		multi_queries: true,
	});
	if (!item) {
		// res.send();
		return;
	}

	console.log('onEmployeeDocsExpiry', item)

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

