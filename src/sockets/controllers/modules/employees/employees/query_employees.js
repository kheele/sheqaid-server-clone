const findImpl = require("../../findImpl");
const findByIdImpl = require("../../findByIdImpl");
const {employee_details_fragment} = require("./commons");

const args = {
    name: "Employee",
    tbl: "hr_employees",
    details_fragment: `
        id
        auth_id
    `,
};

//<editor-fold desc="findByIdEmployee">
exports.findByIdEmployee = async (socket, id) => {
    const findById = findByIdImpl({
        ...args,
        details_fragment: employee_details_fragment
    });

    return findById(socket, id);
};
//</editor-fold>

//<editor-fold desc="findByEmailDuplicateEmployee">
exports.findByEmailDuplicateEmployee = async (socket, {id, email}) => {
    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({id, email}) => {
            return {filter: `id: {_neq: ${id}}, email: {_eq: "${email}"}`};
        }
    });

    return findBy(socket, {id, email});
};
//</editor-fold>

//<editor-fold desc="findByPhoneDuplicateEmployee">
exports.findByPhoneDuplicateEmployee = async (socket, {id, phone}) => {
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
            return {filter: `_or:{email: {_eq: "${username}"}, phone: {_eq: "${username}"}}`};
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
            const uid = await getStaffUidByUsername(username);
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
            return {filter: `_or:{email: {_eq: "${username}"}, phone: {_eq: "${username}"}}`};
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

        const uid = await getStaffUidByUsername(username);
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
            return {filter: `_or:{email: {_eq: "${username}"}, phone: {_eq: "${username}"}}`};
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
