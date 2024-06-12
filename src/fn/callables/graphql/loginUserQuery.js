
const module_fragment = `
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
                  plugin{
                    key
                  }
`;

exports.query = `
  query loginUserQuery($auth_id: String) {
    default_users_connection(where: {auth_id: {_eq: $auth_id}}) {
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
            id
            actions {
              create
              edit
              id
              remove
              share
              view
            }
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
                  ${module_fragment}
                }
              }
              city {
                id
                name
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
            project_list{
              id
              name
              site_list{
	              id
	              name
	              project {
		              id
		            }
		            client {
		              id
		            }
	            }
	            client {
	              id
	            }
            }
            site_list{
              id
              name
	            project {
		            id
		          }
	            client {
	              id
	            }
            }
            module_list {
                id
                price
                module {
                  ${module_fragment}
                }
            }
          }
          project {
            id
            name
            site_list{
              id
              name
	            project {
		            id
		          }
	            client {
	              id
	            }
              }
	          client {
	            id
	          }
          }
          site {
            id
            name
	          project {
		          id
		      }
	          client {
	            id
	          }
          }
        }
      }
    }
  }
`;
