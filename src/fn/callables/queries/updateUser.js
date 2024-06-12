const CheckUserById = require("../graphql/CheckUserById");
const queries = {
    User: {
        mutation: `
          mutation updateUserMutation($id: default_users_pk_columns_input!, $_set: default_users_set_input!) {
            update_default_users_by_pk(pk_columns: $id, _set: $_set) {
              id
              auth_id
            }
          }
        `,
        operationName: "updateUserMutation",
    },
    ContractorUser: {
        mutation: `
          mutation updateUserMutation($id: default_contractor_users_pk_columns_input!, $_set: default_contractor_users_set_input!) {
            update_default_contractor_users_by_pk(pk_columns: $id, _set: $_set) {
              id
              auth_id
            }
          }
        `,
        operationName: "updateUserMutation",
    },
    Staff: {
        mutation: `
          mutation updateUserMutation($id: hr_employees_pk_columns_input!, $_set: hr_employees_set_input!) {
            update_hr_employees_by_pk(pk_columns: $id, _set: $_set) {
              id
              auth_id
            }
          }
        `,
        operationName: "updateUserMutation",
    },
};

module.exports = async ({id, attrs, access_type}) => {
    const queryData = CheckUserById[access_type];
    if (!queryData) {
        return null;
    }

    const item = await getRelayOne({
        ...queryData,
        variables: {id},
    });
    console.log('CheckUserById item', item)
    if (!item) {
        return 'NO_DB_USER';
    }

    const mutationData = queries[access_type];
    if (!mutationData) {
        return null;
    }

    return await updateRelay({
        ...mutationData,
        id,
        attrs,
    });
};
