const {query: checkByUsernameUserQuery} = require("../graphql/checkByUsernameUserQuery");
const {query: checkByUsernameContractorQuery} = require("../graphql/checkByUsernameContractorQuery");
const {query: checkByUsernameStaffQuery} = require("../graphql/checkByUsernameStaffQuery");

exports.User = {
    query: checkByUsernameUserQuery,
    operationName: "checkByUsernameUserQuery",
};

exports.ContractorUser = {
    query: checkByUsernameContractorQuery,
    operationName: "checkByUsernameContractorQuery",
};

exports.Staff = {
    query: checkByUsernameStaffQuery,
    operationName: "checkByUsernameStaffQuery",
};