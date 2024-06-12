
exports.mutation = `
  mutation insertOTPMutation($object: default_users_otp_insert_input!) {
    insert_default_users_otp_one(
      object: $object
    ) {
      id
      date
      auth_id
    }
  }
`;

