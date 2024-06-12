exports.query = `
  query checkByIdStaffQuery($id: bigint) {
    hr_employees_connection(where: {id: {_eq: $id}}) {
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
