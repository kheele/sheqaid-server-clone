
const aggregate = `
	aggregate{
		count
	}
`;

const site_list = `
	id
	status
	contractor{
	  id
	  name
	  username
	}
	site {
	  id
	  name
	  company {
			id
			created_at
			account_type
			address
			business_id
			consultant
			email
			name
			no_projects
			phone
			profile_pic
			trial_start_date
			trial_max_days
			sector_list {
			  id
			  sector {
			    id
			    name
			  }
			}
			module_list {
			  id
			  price
			  module {
			    id
			    borderColor
			    desc
			    discount
			    faIconLeft
			    faIconRight
			    has_update
			    hover
			    key
			    price
			    sort
			    status
			    svgIconLeft
			    svgIconRight
			    title
			  }
			}
			zone {
			  id
			  name
			}
			country {
			  id
			  name
			}
			category {
			  id
			  name
			}
		}
		client {
		  id
		  name
		}
		project {
		  id
		  name
		}
	}
`;

const contractor = `
	id
	created_at
  name
	username
	inc_contractor_pack
	incident_list_aggregate{
		${aggregate}
	}
	contractor_user_list_aggregate{
		${aggregate}
	}
	employee_list_aggregate{
		${aggregate}
	}
	questionnaire_list_aggregate:contractor_questionnaire_list_aggregate(where: {group: {_eq: "Contractors"}}){
    ${aggregate}
  }
  questionnaire_active_list_aggregate:contractor_questionnaire_list_aggregate(where: {group: {_eq: "Contractors"}, status: {_neq: "CompleteAccepted"}}){
    ${aggregate}
  }
  questionnaire_complete_list_aggregate:contractor_questionnaire_list_aggregate(where: {group: {_eq: "Contractors"}, status: {_eq: "CompleteAccepted"}}){
    ${aggregate}
  }
  questionnaire_compliance_list_aggregate:contractor_questionnaire_list_aggregate(where: {group: {_eq: "Contractors"}, status: {_eq: "CompleteAccepted"}}){
    nodes {
      id
      question_list_aggregate {
        aggregate {
	        sum {
	          score
	          maxScore
	        }
	        min {
	          score
	        }
	        max {
	          score
	        }
	        avg {
	          score
	        }
        }
      }
    }
  }
	site_list {
	  ${site_list}
	} 
`;

exports.query = `
  query loginContractorUserQuery($auth_id: String) {
    default_contractor_users_connection(where: {auth_id: {_eq: $auth_id}}) {
      edges {
        node {
          id
          auth_id
          created_at,
          fname
          lname
          username
          phone
          profile_pic
          auth_type
          has_biometric
          notifications_settings {
            id
            receive_asset_management_notifs
            receive_chemicals_management_notifs
            receive_contractor_management_notifs
            receive_employees_expired_docs_medicals
            receive_employees_profile_notifs
            receive_incident_management_notifs
            receive_non_conformance_management_notifs
            receive_training_management_notifs
            receive_expired_docs_notifs
          }
          linked_employee_id
          linked_employee {
            id
            fname
            lname
            email
            phone
          }
          permissions_module_list {
            actions {
              create
              edit
              id
              remove
              share
              view
            }
            id
            module {
              key
              id
              plugin {
                id
                key
                desc
                title
                status
              }
              title
            }
          }
          permissions_other_list {
            actions {
              create
              edit
              id
              remove
              share
              view
            }
            id
            key {
              value
              id
            }
          }
          contractor {
            ${contractor}
          }
        }
      }
    }
  }
`;
