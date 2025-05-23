const {send: send__users} = require("./send__users");
const {send: send__employees} = require("./send__employees");
const {employee_personal_details_fragment} = require("../../../../graphql/Fragments");

//<editor-fold desc="where">
const where_expired = `
    doc_version_list: {expiry: {_lte: $today_date}},
    removed:{_eq: false},
`;

const where_month_expiry = `
    doc_version_list: {expiry: {_gt: $today_date, _lte: $mon_date}},
    removed:{_eq: false},
`;

const where_no_expiry = `
    doc_version_list: {expiry: {_is_null: true}},
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
  title
  desc
  internal_or_external
  doc_type
  doc_version_list(order_by:{expiry: desc_nulls_last}){
      id
      expiry
      doc_num
      type
      doc
  }
  latest_version: doc_version_list(order_by:{expiry: desc_nulls_last}, limit: 1){
      id
      expiry
      doc_num
      type
      doc
  }
  category{
      id
      name
  }
  responsible_department{
      id
      name
  }
  responsible_person{
      ${employee_personal_details_fragment}
  }
  employee{
      id
      fname
      lname
      id_num
      passport_num
      email
      phone
  }
  ${simple_orgs_fragment}
`;
//</editor-fold>

//<editor-fold desc="lists_fragment">
const lists_fragment = `
  #list_project_plan
  list_project_plan_expired:document_list(
    where: {
        doc_type:{_eq: "Project Plan"},
        ${where_expired} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_project_plan_month_expiry:document_list(
    where: {
        doc_type:{_eq: "Project Plan"},
        ${where_month_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_project_plan_no_expiry:document_list(
    where: {
        doc_type:{_eq: "Project Plan"},
        ${where_no_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  #list_ims_policy
  #list_ims_policy_expired:document_list(
  #  where: {
  #      doc_type:{_eq: "IMS Policy"},
  #      ${where_expired} 
  #  },
  #  order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  #){
  #  ${fragment}
  #}
  #list_ims_policy_month_expiry:document_list(
  #  where: {
  #      doc_type:{_eq: "IMS Policy"},
  #      ${where_month_expiry} 
  #  },
  #  order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  #){
  #  ${fragment}
  #}
  #list_ims_policy_no_expiry:document_list(
  #  where: {
  #      doc_type:{_eq: "IMS Policy"},
  #      ${where_no_expiry} 
  #  },
  #  order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  #){
  #  ${fragment}
  #}
  #list_general_document
  list_general_document_expired:document_list(
    where: {
        doc_type:{_eq: "General Document"},
        ${where_expired} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_general_document_month_expiry:document_list(
    where: {
        doc_type:{_eq: "General Document"},
        ${where_month_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_general_document_no_expiry:document_list(
    where: {
        doc_type:{_eq: "General Document"},
        ${where_no_expiry} 
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
        receive_expired_docs_notifs
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
query getDocumentsExpiryQuery($today_date: date, $mon_date: date) {
  user_list:default_users_connection(
      where: {
          removed: {_eq: false}, 
          notifications_settings: {receive_expired_docs_notifs: {_eq: true}},
          _or:[
            {
              site: {
                document_list: {
                  doc_version_list: {
                    _or:[
                      {expiry: {_is_null: true}},
                      {expiry: {_lte: $mon_date}}
                    ]
                  },
                  removed:{_eq: false},
                }
              },
            },
            {
              project: {
                document_list: {
                  doc_version_list: {
                    _or:[
                      {expiry: {_is_null: true}},
                      {expiry: {_lte: $mon_date}}
                    ]
                  },
                  removed:{_eq: false},
                }
              },
            },
            {
              client: {
                document_list: {
                  doc_version_list: {
                    _or:[
                      {expiry: {_is_null: true}},
                      {expiry: {_lte: $mon_date}}
                    ]
                  },
                  removed:{_eq: false},
                }
              },
            },
            {
              company: {
                document_list: {
                  doc_version_list: {
                    _or:[
                      {expiry: {_is_null: true}},
                      {expiry: {_lte: $mon_date}}
                    ]
                  },
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

// <editor-fold defaultstate="collapsed" desc="onDocumentsExpiry">
exports.onDocumentsExpiry = async (data) => {
	// await authorize();

	const item = await getRelayOne({
		query,
		operationName: "getDocumentsExpiryQuery",
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

	// console.log('onDocumentsExpiry', item)

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

