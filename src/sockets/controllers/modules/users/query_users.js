const findImpl = require("../findImpl");
const findByIdImpl = require("../findByIdImpl");
const {user_details_fragment} = require("./commons");
const {findByUsernameContractor} = require("../contractors/query_contractors");

const args = {
    name: "User",
    tbl: "default_users",
    details_fragment: `
        id
        auth_id
    `,
};

//<editor-fold desc="findByIdUser">
exports.findByIdUser = async (socket, id) => {
    const findById = findByIdImpl({
        ...args,
        details_fragment: user_details_fragment
    });

    return findById(socket, id);
};
//</editor-fold>

//<editor-fold desc="findByUsernameDuplicateUser">
exports.findByUsernameDuplicateUser = async (socket, {id, username}) => {
    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({id, username}) => {
            return {filter: `id: {_neq: ${id}}, username: {_eq: "${username}"}`};
        }
    });

    return findBy(socket, {id, username});
};
//</editor-fold>

//<editor-fold desc="findByPhoneDuplicateUser">
exports.findByPhoneDuplicateUser = async (socket, {id, phone}) => {
    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({id, phone}) => {
            return {filter: `id: {_neq: ${id}}, phone: {_eq: "${phone}"}`};
        }
    });

    return findBy(socket, {id, phone});
};
//</editor-fold>

//<editor-fold desc="checkExistByUsername">
exports.checkExistByUsername = async (socket, username) => {
    if(!username) {
        return;
    }

    username = username.toLowerCase();

    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({username}) => {
            return {filter: `_or:{username: {_eq: "${username}"}, phone: {_eq: "${username}"}}`};
        }
    });

    return findBy(socket, {username}).then(async res => {
        if (!res) {
            return 'NO_USER_DB';
        }

        return 'DB_USER_DUP';
    }).then(async res => {
        if (!res) return;

        if(res === "NO_USER_DB") {
            const uid = await getUserUidByUsername(username);
            return {uid};
        }

        return res;
    });
};
//</editor-fold>

//<editor-fold desc="loginUserStep1ByUsername">
exports.loginUserStep1ByUsername = async (socket, username) => {
    if(!username) {
        return;
    }

    username = username.toLowerCase();

    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({username}) => {
            return {filter: `_or:{username: {_eq: "${username}"}, phone: {_eq: "${username}"}}`};
        }
    });

    return findBy(socket, {username}).then(async res => {
        if (!res) {
            return "NO_USER_DB";
        }

        const {id, data: {auth_id}} = res;
        if (auth_id) {
            return {uid: auth_id, id};
        }

        const uid = await getUserUidByUsername(username);
        if (!uid) {
            return {id};
        }
        return {uid, id};
    });
};
//</editor-fold>

//<editor-fold desc="findByUsernameUserSetupBiometric">
exports.findByUsernameUserSetupBiometric = async (socket, username) => {
    if(!username) {
        return;
    }

    username = username.toLowerCase();

    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({username}) => {
            return {filter: `_or:{username: {_eq: "${username}"}, phone: {_eq: "${username}"}}`};
        }
    });

    return findBy(socket, {username}).then(async res => {
        if (res) {
            const {id, data: {auth_id}} = res;
            if (auth_id) {
                return {auth_id, id};
            }
        }

        return "NO_USER_DB";
    });
};
//</editor-fold>
