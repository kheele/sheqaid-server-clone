exports.query = `
  query checkByResetPassIdUserQuery($reset_password_id: String) {
    default_users_connection(where: {reset_password_id: {_eq: $reset_password_id}}) {
      edges {
        node {
          id
          auth_id
        }
      }
    }
  }
`;
