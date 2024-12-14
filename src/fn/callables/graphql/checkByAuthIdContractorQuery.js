exports.query = `
  query checkByAuthIdContractorQuery($auth_id: bigint) {
    default_contractor_users_connection(where: {auth_id: {_eq: $auth_id}}) {
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
