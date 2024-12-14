exports.query = `
  query checkByAuthIdStaffQuery($auth_id: bigint) {
    hr_employees_connection(where: {auth_id: {_eq: $auth_id}}) {
      edges {
        node {
          id
          auth_id
          fname
          lname
          email
        }
      }
    }
  }
`;
