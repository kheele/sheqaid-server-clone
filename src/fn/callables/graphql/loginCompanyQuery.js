
exports.query = `
  query loginCompanyQuery($id: bigint) {
    default_companies_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
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
      }
    }
  }
`;
