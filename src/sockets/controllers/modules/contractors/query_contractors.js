const findImpl = require("../findImpl");
const findByIdImpl = require("../findByIdImpl");
const {contractor_details_fragment, contractor_otp_details_fragment} = require("./commons");
const updateImpl = require("../updateImpl");
const {orgs_no_site_fragment} = require("../../../../graphql/Fragments");

const args = {
    name: "Contractors",
    tbl: "default_contractors",
    details_fragment: `
        id
    `,
    orgs_fragment: null,
};

//<editor-fold desc="findByIdContractor">
exports.findByIdContractor = findByIdContractor = async (socket, id) => {
    const findById = findByIdImpl({
        ...args,
        details_fragment: contractor_details_fragment(),
        orgs_fragment: orgs_no_site_fragment,
    });

    return findById(socket, id);
};
//</editor-fold>

//<editor-fold desc="findByOTPContractor">
exports.findByOTPContractor = async (socket, {id, code}) => {
    if (!id || !code) {
        return;
    }

    const item = await checkContractorExistById(socket, id);
    if (!item) return "NO_USER_DB";

    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({id, code}) => {
            return {filter: `id: {_eq: ${id}}, password_otp: {_eq: "${code}"}`};
        },
        details_fragment: contractor_otp_details_fragment,
        orgs_fragment: orgs_no_site_fragment,
    });

    return findBy(socket, {id, code}).then(res => {
        if(!res) {
            return "NO_OTP_MATCH";
        }
        removeContractorOTP(socket, id);
        return res;
    });
};
//</editor-fold>

//<editor-fold desc="findByUsernameContractor">
exports.findByUsernameContractor = async (socket, username) => {
    if (!username) {
        return;
    }

    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({username}) => {
            return {filter: `username: {_eq: "${username}"}`};
        },
        details_fragment: contractor_details_fragment(),
        orgs_fragment: orgs_no_site_fragment,
    });

    return findBy(socket, {username});
};
//</editor-fold>

//<editor-fold desc="checkContractorExistById">
exports.checkContractorExistById = checkContractorExistById = async (socket, id) => {
    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({id}) => {
            return {filter: `id: {_eq: ${id}}`};
        }
    });

    return findBy(socket, {id});
};
//</editor-fold>

//<editor-fold desc="removeContractorOTP">
const removeContractorOTP = async (socket, id) => {
    const item = await checkContractorExistById(socket, id);
    if (!item) return "NO_USER_DB";

    const update = updateImpl(args);
    return update(socket, {id, password_otp: null});
};
//</editor-fold>

//<editor-fold desc="sendContractorOTP">
exports.sendContractorOTP = async (socket, id) => {
    const item = await checkContractorExistById(socket, id);
    if (!item) return "NO_USER_DB";

    const password_otp = uuidv4().substring(0, 5);
    const update = updateImpl(args);
    return update(socket, {id, password_otp});
};
//</editor-fold>

//<editor-fold desc="checkContractorExistByUsername">
exports.checkContractorExistByUsername = async (socket, username) => {
    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({username}) => {
            return {filter: `username: {_eq: "${username}"}`};
        }
    });

    return findBy(socket, {username});
};
//</editor-fold>

//<editor-fold desc="checkContractorExistByLinkedCompanyId">
exports.checkContractorExistByLinkedCompanyId = async (socket, linked_company_id) => {
    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({linked_company_id}) => {
            return {filter: `linked_company_id: {_eq: ${linked_company_id}}`};
        }
    });

    return findBy(socket, {linked_company_id});
};
//</editor-fold>

//<editor-fold desc="findByUsernameDuplicateContractor">
exports.findByUsernameDuplicateContractor = async (socket, {id, username}) => {
    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({id, username}) => {
            return {filter: `id: {_neq: ${id}}, username: {_eq: "${username}"}`};
        }
    });

    return findBy(socket, {id, username});
};
//</editor-fold>

//<editor-fold desc="findByPhoneDuplicateContractor">
exports.findByPhoneDuplicateContractor = async (socket, {id, phone}) => {
    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({id, phone}) => {
            return {filter: `id: {_neq: ${id}}, phone: {_eq: "${phone}"}`};
        }
    });

    return findBy(socket, {id, phone});
};
//</editor-fold>
