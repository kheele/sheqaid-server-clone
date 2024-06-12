const {send: send__users} = require("./send__users");
const {send: send__employees} = require("./send__employees");

//<editor-fold desc="where">
const where_expired = `
    ques_list: {questionType: {_eq: "Document"}, expiry: {_lte: $today_date}},
    is_template: {_eq: false},
    group: {_eq: "Contractors"},
    removed:{_eq: false},
`;

const where_month_expiry = `
    ques_list: {questionType: {_eq: "Document"}, expiry: {_gt: $today_date, _lte: $mon_date}},
    is_template: {_eq: false},
    group: {_eq: "Contractors"},
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
const ques_list_fragment = (deep = 3, inc_expiry) => {
	if(deep === 0) {
		return `id`;
	}
	return `
    id
    answer
    expiry
    comments
    hasExpiry
    isEditableDoc
    isMandatory
    isMultiAnswer
    linkDoc {
        id
        created_at
        name
        desc
        category
    }
    maxScore
    notify
    notifyAction
    questionImage
    questionText
    questionType
    score
    questionnaire{
        id
    }
    idx
    is_page_title
    question_list:ques_list(where: {questionType: {_eq: "Document"}, ${inc_expiry}}){
        ${ques_list_fragment(deep - 1, inc_expiry)}
    }
`;
};

const fragment = (deep = 3, inc_expiry) => {
	return `
		id
    created_at
    name
    desc
    status
    status_answered_by_sender
    answered_by
    page_title_list:ques_list(where: {is_page_title: {_eq: true}}){
        ${ques_list_fragment(3, inc_expiry)}
    }
    question_list:ques_list(where: {is_page_title: {_eq: false}}){
        ${ques_list_fragment(3, inc_expiry)}
    }
    
    contractor_site{
        id
        name
    }
    contractor {
        id
        name
    }
      
    ${simple_orgs_fragment}
`;
};
//</editor-fold>

//<editor-fold desc="lists_fragment">
const lists_fragment = `
  #list_questionnaire
  list_questionnaire_expired:contractor_questionnaire_list(
    where: {
        ${where_expired} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment(3, "expiry: {_lte: $today_date}")}
  }
  list_questionnaire_month_expiry:contractor_questionnaire_list(
    where: {
        ${where_month_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment(3, "expiry: {_gt: $today_date, _lte: $mon_date}")}
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
        receive_contractor_management_notifs
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
query getQuestionnairesExpiryQuery($today_date: date, $mon_date: date) {
  user_list:default_users_connection(
      where: {
          removed: {_eq: false}, 
          notifications_settings: {receive_contractor_management_notifs: {_eq: true}},
          _or:[
            {
              site: {
                contractor_questionnaire_list: {
								  is_template: {_eq: false},
								  group: {_eq: "Contractors"},
                  ques_list: {
                    questionType: {_eq: "Document"},
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
                contractor_questionnaire_list: {
								  is_template: {_eq: false},
								  group: {_eq: "Contractors"},
                  ques_list: {
                    questionType: {_eq: "Document"},
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
                contractor_questionnaire_list: {
								  is_template: {_eq: false},
								  group: {_eq: "Contractors"},
                  ques_list: {
                    questionType: {_eq: "Document"},
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
                contractor_questionnaire_list: {
								  is_template: {_eq: false},
								  group: {_eq: "Contractors"},
                  ques_list: {
                    questionType: {_eq: "Document"},
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

// <editor-fold defaultstate="collapsed" desc="onQuestionnairesExpiry">
exports.onQuestionnairesExpiry = async (data) => {
	// await authorize();

	const item = await getRelayOne({
		query,
		operationName: "getQuestionnairesExpiryQuery",
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

	console.log('onQuestionnairesExpiry', item)

	const {
		user_list = [],
		employee_list =[],
	} = item;

	if(!user_list.isEmpty()) {
		// await send__users(user_list);
	}

	if(!employee_list.isEmpty()) {
		await send__employees(employee_list);
	}

};
// </editor-fold>

