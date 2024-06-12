
exports.mutation = `
  mutation updateOTPMutation($id: default_users_otp_pk_columns_input!, $_set: default_users_otp_set_input!) {
    update_default_users_otp_by_pk(pk_columns: $id, _set: $_set) {
      id
      date
      auth_id
    }
  }
`;

