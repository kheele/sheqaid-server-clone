exports.query = `
  query checkByUsernameContractorQuery($username: String) {
    default_contractor_users_connection(where: {username: {_eq: $username}}) {
      edges {
        node {
          id
          auth_id
          contractor {
            id
            username
          }
        }
      }
    }
  }
`;
