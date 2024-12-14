exports.query = `
  query checkByPhoneStaffQuery($phone: String) {
    hr_employees_connection(where: {phone: {_eq: $phone}}) {
      edges {
        node {
          id
          auth_id
        }
      }
    }
  }
`;
