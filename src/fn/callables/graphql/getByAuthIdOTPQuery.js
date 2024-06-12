
exports.query = `
  query getByAuthIdOTPQuery($auth_id: String) {
    default_users_otp_connection(where: {auth_id: {_eq: $auth_id}, otp: {_neq: null}}) {
      edges {
        node {
          id
          date
          auth_id
          otp
        }
      }
    }
  }
`;
