exports.query = `
  query checkByPhoneUserQuery($phone: String) {
    default_users_connection(where: {phone: {_eq: $phone}}) {
      edges {
        node {
          id
          auth_id
        }
      }
    }
  }
`;
