exports.query = `
  query checkByPhoneContractorQuery($phone: String) {
    default_contractor_users_connection(where: {phone: {_eq: $phone}}) {
      edges {
        node {
          id
          auth_id
        }
      }
    }
  }
`;
