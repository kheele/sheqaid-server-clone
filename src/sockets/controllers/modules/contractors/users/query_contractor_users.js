const findImpl = require("../../findImpl");
const findByIdImpl = require("../../findByIdImpl");
const {user_details_fragment} = require("./commons");
const {findByUsernameContractor} = require("../query_contractors");
const {orgs_contractor_fragment} = require("../../../../../graphql/Fragments");

const args = {
    name: "ContractorUser",
    tbl: "default_contractor_users",
    orgs_fragment: orgs_contractor_fragment,
    details_fragment: `
        id
        auth_id
        contractor {
            id
            username
        }
    `,
};

//<editor-fold desc="findByIdContractorUser">
exports.findByIdContractorUser = async (socket, id) => {
    const findById = findByIdImpl({
        ...args,
        details_fragment: user_details_fragment
    });

    return findById(socket, id);
};
//</editor-fold>

//<editor-fold desc="findByUsernameDuplicateContractorUser">
exports.findByUsernameDuplicateContractorUser = async (socket, {id, username}) => {
    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({id, username}) => {
            return {filter: `id: {_neq: ${id}}, username: {_eq: "${username}"}`};
        }
    });

    return findBy(socket, {id, username});
};
//</editor-fold>

//<editor-fold desc="findByPhoneDuplicateContractorUser">
exports.findByPhoneDuplicateContractorUser = async (socket, {id, phone}) => {
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
            return {filter: `_or:[{username: {_eq: "${username}"}}, {phone: {_eq: "${username}"}}]`};
        }
    });

    return findBy(socket, {username}).then(async res => {
        if (!res) {
            return 'NO_USER_DB';
        }

        if (res.data.contractor) {
            return res;
        }

        return 'DB_USER_DUP';
    }).then(async res => {
        if (!res) return;

        if(res === "NO_USER_DB") {
            const uid = await getContractorUserUidByUsername(username);
            return {uid};
        }

        if (res.data && res.data.contractor) {
            const {contractor: {username: contractorUsername}} = res.data;
            if (contractorUsername === username) {
                const uid = await getContractorUserUidByUsername(username);
                return {uid};
            } else {
                // usernameStatus.loading = false;
                // usernameStatus.duplicate = true;
                return 'DB_USER_DUP';
            }
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
            return {filter: `_or:[{username: {_eq: "${username}"}}, {phone: {_eq: "${username}"}}]`};
        }
    });

    return findBy(socket, {username}).then(async res => {
        if (res) {
            const {id, data: {auth_id}} = res;
            if (auth_id) {
                return {uid: auth_id, id};
            }

            const uid = await getContractorUserUidByUsername(username);
            if (!uid) {
                return {id};
            }
            return {uid, id};
        }

        const contractor = await findByUsernameContractor(socket, username);
        if (!contractor) {
            return "NO_USER_DB";
        }

        const findByContractorIdContractorUser = findImpl({
            ...args,
            getVariablesAndQueryConfig: ({contractor_id}) => {
                return {filter: `contractor_id: {_eq: ${contractor_id}}`};
            }
        });

        res = await findByContractorIdContractorUser(socket, {contractor_id: contractor.id});
        if (res) {
            return {contractor, message: "CONTRACTOR_EMAIL_RESTRICTION"};//setup user account
        }
        return {contractor};//setup user account
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
            return {filter: `_or:[{username: {_eq: "${username}"}}, {phone: {_eq: "${username}"}}]`};
        }
    });

    return findBy(socket, {username}).then(async res => {
        if (res) {
            const {id, data: {auth_id}} = res;
            if (auth_id) {
                return {auth_id, id};
            }
        }

        const contractor = await findByUsernameContractor(socket, username);
        if (!contractor) {
            return "NO_USER_DB";
        }

        const findByContractorIdContractorUser = findImpl({
            ...args,
            getVariablesAndQueryConfig: ({contractor_id}) => {
                return {filter: `contractor_id: {_eq: ${contractor_id}}`};
            }
        });

        res = await findByContractorIdContractorUser(socket, {contractor_id: contractor.id});
        if (res) {
            return {contractor, message: "CONTRACTOR_EMAIL_RESTRICTION"};//setup user account
        }
        return {contractor};//setup user account
    });
};
//</editor-fold>
