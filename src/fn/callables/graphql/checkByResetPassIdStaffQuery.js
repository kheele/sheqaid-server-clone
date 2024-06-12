exports.query = `
  query checkByResetPassIdStaffQuery($reset_password_id: String) {
    hr_employees_connection(where: {reset_password_id: {_eq: $reset_password_id}}) {
      edges {
        node {
          id
          auth_id
          email
          phone
        }
      }
    }
  }
`;
