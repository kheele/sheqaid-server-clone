const CheckUserByAuthId = require("../fn/callables/graphql/CheckUserByAuthId");
const CheckUserById = require("../fn/callables/graphql/CheckUserById");
const CheckUserByPhone = require("../fn/callables/graphql/CheckUserByPhone");
const CheckUserByUsername = require("../fn/callables/graphql/CheckUserByUsername");

global.checkByAuthIdUserTypeImpl = async ({auth_id, access_type}) => {
    const queryData = CheckUserByAuthId[access_type];
    if (!queryData) {
        return null;
    }

    return getRelayOne({
        ...queryData,
        variables: {auth_id},
    });
};

global.checkByAuthIdUser = async (auth_id) => {
    return checkByAuthIdUserTypeImpl({auth_id, access_type: "User"});
};

global.checkByAuthIdContractorUser = async (auth_id) => {
    return checkByAuthIdUserTypeImpl({auth_id, access_type: "ContractorUser"});
};

global.checkByAuthIdStaff = async (auth_id) => {
    return checkByAuthIdUserTypeImpl({auth_id, access_type: "Staff"});
};

//

global.checkByIdUserTypeImpl = async ({id, access_type}) => {
    const queryData = CheckUserById[access_type];
    if (!queryData) {
        return null;
    }

    return getRelayOne({
        ...queryData,
        variables: {id},
    });
};

global.checkByIdUser = async (id) => {
    return checkByIdUserTypeImpl({id, access_type: "User"});
};

global.checkByIdContractorUser = async (id) => {
    return checkByIdUserTypeImpl({id, access_type: "ContractorUser"});
};

global.checkByIdStaff = async (id) => {
    return checkByIdUserTypeImpl({id, access_type: "Staff"});
};

//

global.checkByPhoneUserTypeImpl = async ({phone, access_type}) => {
    const queryData = CheckUserByPhone[access_type];
    if (!queryData) {
        return null;
    }

    return getRelayOne({
        ...queryData,
        variables: {phone},
    });
};

global.checkByPhoneUser = async (phone) => {
    return checkByPhoneUserTypeImpl({phone, access_type: "User"});
};

global.checkByPhoneContractorUser = async (phone) => {
    return checkByPhoneUserTypeImpl({phone, access_type: "ContractorUser"});
};

global.checkByPhoneStaff = async (phone) => {
    return checkByPhoneUserTypeImpl({phone, access_type: "Staff"});
};

//

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
