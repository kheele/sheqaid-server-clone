const {query: checkByResetPassIdUserQuery} = require("../graphql/checkByResetPassIdUserQuery");
const {query: checkByResetPassIdContractorQuery} = require("../graphql/checkByResetPassIdContractorQuery");
const {query: checkByResetPassIdStaffQuery} = require("../graphql/checkByResetPassIdStaffQuery");

exports.User = {
    query: checkByResetPassIdUserQuery,
    operationName: "checkByResetPassIdUserQuery",
};

exports.ContractorUser = {
    query: checkByResetPassIdContractorQuery,
    operationName: "checkByResetPassIdContractorQuery",
};

exports.Staff = {
    query: checkByResetPassIdStaffQuery,
    operationName: "checkByResetPassIdStaffQuery",
};