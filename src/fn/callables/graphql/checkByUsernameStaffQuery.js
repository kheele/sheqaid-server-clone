exports.query = `
  query checkByUsernameStaffQuery($username: String) {
    hr_employees_connection(where: {email: {_eq: $username}}) {
      edges {
        node {
          id
          auth_id
        }
      }
    }
  }
`;
