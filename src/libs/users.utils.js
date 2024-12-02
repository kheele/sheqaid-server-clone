const CheckUserByUsername = require("../fn/callables/graphql/CheckUserByUsername");

global.checkByUsernameUserTypeImpl = async ({username, access_type}) => {
    const queryData = CheckUserByUsername[access_type];
    if (!queryData) {
        return null;
    }

    return getRelayOne({
        ...queryData,
        variables: {username},
    });
};

global.checkByUsernameUser = async (username) => {
    return checkByUsernameUserTypeImpl({username, access_type: "User"});
};

global.checkByUsernameContractorUser = async (username) => {
    return checkByUsernameUserTypeImpl({username, access_type: "ContractorUser"});
};

global.checkByUsernameStaff = async (username) => {
    return checkByUsernameUserTypeImpl({username, access_type: "Staff"});
};
