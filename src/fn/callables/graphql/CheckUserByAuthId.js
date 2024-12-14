const {query: checkByAuthIdUserQuery} = require("../graphql/checkByAuthIdUserQuery");
const {query: checkByAuthIdContractorQuery} = require("../graphql/checkByAuthIdContractorQuery");
const {query: checkByAuthIdStaffQuery} = require("../graphql/checkByAuthIdStaffQuery");

exports.User = {
    query: checkByAuthIdUserQuery,
    operationName: "checkByAuthIdUserQuery",
};

exports.ContractorUser = {
    query: checkByAuthIdContractorQuery,
    operationName: "checkByAuthIdContractorQuery",
};

exports.Staff = {
    query: checkByAuthIdStaffQuery,
    operationName: "checkByAuthIdStaffQuery",
};