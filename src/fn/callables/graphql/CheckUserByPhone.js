const {query: checkByPhoneUserQuery} = require("../graphql/checkByPhoneUserQuery");
const {query: checkByPhoneContractorQuery} = require("../graphql/checkByPhoneContractorQuery");
const {query: checkByPhoneStaffQuery} = require("../graphql/checkByPhoneStaffQuery");

exports.User = {
    query: checkByPhoneUserQuery,
    operationName: "checkByPhoneUserQuery",
};

exports.ContractorUser = {
    query: checkByPhoneContractorQuery,
    operationName: "checkByPhoneContractorQuery",
};

exports.Staff = {
    query: checkByPhoneStaffQuery,
    operationName: "checkByPhoneStaffQuery",
};