const {query: checkByIdUserQuery} = require("../graphql/checkByIdUserQuery");
const {query: checkByIdContractorQuery} = require("../graphql/checkByIdContractorQuery");
const {query: checkByIdStaffQuery} = require("../graphql/checkByIdStaffQuery");

exports.User = {
    query: checkByIdUserQuery,
    operationName: "checkByIdUserQuery",
};

exports.ContractorUser = {
    query: checkByIdContractorQuery,
    operationName: "checkByIdContractorQuery",
};

exports.Staff = {
    query: checkByIdStaffQuery,
    operationName: "checkByIdStaffQuery",
};