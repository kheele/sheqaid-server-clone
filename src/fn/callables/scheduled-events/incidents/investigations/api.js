const {send: send__users} = require("./send__users");
const {send: send__employees} = require("./send__employees");

//<editor-fold desc="where">
const where_expired = `
    due_date: {_lte: $today_date},
    removed:{_eq: false},
`;

const where_month_expiry = `
    due_date: {_gt: $today_date, _lte: $mon_date},
    removed:{_eq: false},
`;

const where_no_expiry = `
    due_date: {_is_null: true},
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
	investigation: {
    id
    due_date
    document_list{
      id
      doc
    }
    investigation_finding_list{
      id
      desc
    }
    investigation_team_list{
      id
      investigator{
        id
	      lname
	      fname
	      id_num
	      passport_num
	      email
	      phone
      }
      investigator_other{
        id
	      lname
	      fname
	      id_num
	      passport_num
	      email
	      phone
      }
    }
  }
  ${simple_orgs_fragment}
`;
//</editor-fold>

//<editor-fold desc="lists_fragment">
const lists_fragment = `
  #list_incident
  list_incident_expired:incident_list(
    where: {
      investigation: {${where_expired}}
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_incident_month_expiry:incident_list(
    where: {
      investigation: {${where_month_expiry}}
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_incident_no_expiry:incident_list(
    where: {
      investigation: {${where_no_expiry}}
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
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
      receive_incident_management_notifs
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

//<editor-fold desc="query">
const query = `
query getIncidentInvestigationExpiryQuery($today_date: date, $mon_date: date) {
  user_list:default_users_connection(
      where: {
          removed: {_eq: false}, 
          notifications_settings: {receive_incident_management_notifs: {_eq: true}},
          _or:[
            {
              site: {
                incident_list: {
                  investigation: {
	                  _or:[
	                    {due_date: {_is_null: true}},
	                    {due_date: {_lte: $mon_date}}
	                  ],
	                  removed:{_eq: false},
                  }
                }
              },
            },
            {
              project: {
                incident_list: {
                  investigation: {
	                  _or:[
	                    {due_date: {_is_null: true}},
	                    {due_date: {_lte: $mon_date}}
	                  ],
	                  removed:{_eq: false},
                  }
                }
              },
            },
            {
              client: {
                incident_list: {
                  investigation: {
	                  _or:[
	                    {due_date: {_is_null: true}},
	                    {due_date: {_lte: $mon_date}}
	                  ],
	                  removed:{_eq: false},
                  }
                }
              },
            },
            {
              company: {
                incident_list: {
                  investigation: {
	                  _or:[
	                    {due_date: {_is_null: true}},
	                    {due_date: {_lte: $mon_date}}
	                  ],
	                  removed:{_eq: false},
                  }
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

// <editor-fold defaultstate="collapsed" desc="onIncidentInvestigationExpiry">
exports.onIncidentInvestigationExpiry = async (data) => {
	// await authorize();

	const item = await getRelayOne({
		query,
		operationName: "getIncidentInvestigationExpiryQuery",
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

	console.log('onIncidentInvestigationExpiry', item)

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

