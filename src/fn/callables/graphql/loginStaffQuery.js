const {employee_personal_details_fragment} = require("../../../graphql/Fragments");

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
	site_list {
	  ${site_list}
	} 
`;

exports.query = `
  query loginStaffQuery($auth_id: String) {
    hr_employees_connection(where: {auth_id: {_eq: $auth_id}}) {
      edges {
        node {
          id
          auth_id
          auth_type
          has_biometric
          ${employee_personal_details_fragment}
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
          contractor {
            ${contractor}
          }
        }
      }
    }
  }
`;
