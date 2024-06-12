exports.query = `
  query checkByIdContractorQuery($id: bigint) {
    default_contractor_users_connection(where: {id: {_eq: $id}}) {
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
