exports.query = `
  query checkByUsernameUserQuery($username: String) {
    default_users_connection(where: {username: {_eq: $username}}) {
      edges {
        node {
          id
          auth_id
        }
      }
    }
  }
`;
