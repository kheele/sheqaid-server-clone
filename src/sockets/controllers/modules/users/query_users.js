const findImpl = require("../findImpl");
const findByIdImpl = require("../findByIdImpl");
const {user_details_fragment} = require("./commons");

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
