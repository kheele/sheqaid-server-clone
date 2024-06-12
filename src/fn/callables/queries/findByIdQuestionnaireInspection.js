//<editor-fold desc="contractor_questionnaire_question_list_fragment">
const contractor_questionnaire_question_list_fragment = (deep = 3) => {
	if (deep === 0) {
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
    open
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
    question_list:question_list{
        ${contractor_questionnaire_question_list_fragment(deep - 1)}
    }
    options{
      optionImage
      optionText
      optionType
      answer
    }
    message_list{
        ques{
            id
        }
        msg
        read
        date
        sender{
            id
            fname
            lname
            username
            phone
        }
        recipient{
            id
            fname
            lname
            username
            phone
        }
        contractor_sender{
            id
            fname
            lname
            username
            phone
        }
        contractor_recipient{
            id
            fname
            lname
            username
            phone
        }
        logged_user{
            id
            fname
            lname
            username
            phone
        }
    }
    notified_list{
        employee{
            id
            fname
            lname
            email
            phone
        }
        ques{
            id
        }
    }
    #ques_path_list{
    #    id
    #    path
    #    ques{
    #        id
    #    }
    #}
`;
};
//</editor-fold>

module.exports = async (id) => {
	return await getRelayOne({
		query: `
      query findOneContractorQuestionnaireQuery{
        default_contractor_questionnaires_connection(
          where: {id: {_eq: ${id}},},
        ) {
          edges {
		        node {
              id
              created_at
              name
              desc
              status
              status_answered_by_sender
              answered_by
              is_template
              group
              
              page_title_list:question_list(where: {is_page_title: {_eq: true}}){
                  ${contractor_questionnaire_question_list_fragment(3)}
              }
              question_list:question_list(where: {is_page_title: {_eq: false}}){
                  ${contractor_questionnaire_question_list_fragment(3)}
              }
              asset{
                id
                asset_detail{
                  asset_type
                  name
                  reg_num
                  serial_num
                }
              }
              responsible_person{
                id
                full_name
                email
				        linked_user_id
				        linked_user{
				          id
				          username
				        }
                company{
                  id
                  name
                }
                client{
                  id
                  name
                }
              }
              user{
                id
                username
                company{
                  id
                  name
                }
                client{
                  id
                  name
                }
              }
              contractor_site{
                  id
                  name
              }
              contractor {
                  id
                  name
                  username
                  contractor_user_list{
                    id
                    username
                  }
              }
              
              company{
                  id
                  name
                  user_list(where: {
                      removed: {_eq: false},
                      notifications_settings: {receive_incident_management_notifs: {_eq: true}},
                      client_id: {_is_null: true},
                      project_id: {_is_null: true},
                      site_id: {_is_null: true}
                  }){
                      id
                      full_name
                      username
                      phone
                  }
              }
              client{
                  id
                  name
                  user_list(where: {
                      removed: {_eq: false},
                      notifications_settings: {receive_incident_management_notifs: {_eq: true}},
                      project_id: {_is_null: true},
                      site_id: {_is_null: true}
                  }){
                      id
                      full_name
                      username
                      phone
                  }
              }
              project{
                  id
                  name
                  user_list(where: {
                      removed: {_eq: false},
                      notifications_settings: {receive_incident_management_notifs: {_eq: true}},
                      site_id: {_is_null: true}
                  }){
                      id
                      full_name
                      username
                      phone
                  }
              }
              site{
                  id
                  name
                  user_list(where: {
                      removed: {_eq: false},
                      notifications_settings: {receive_incident_management_notifs: {_eq: true}},
                  }){
                      id
                      full_name
                      username
                      phone
                  }
              }
            }
          }
        }
      }
    `,
		operationName: "findOneContractorQuestionnaireQuery",
	});
}
