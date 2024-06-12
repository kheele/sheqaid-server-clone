exports.query = `
  query checkByIdUserQuery($id: bigint) {
    default_users_connection(where: {id: {_eq: $id}}) {
      edges {
        node {
          id
          auth_id
          fname
          lname
          username
        }
      }
    }
  }
`;
