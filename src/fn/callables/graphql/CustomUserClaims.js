const {query: loginUserQuery} = require("../graphql/loginUserQuery");
const {query: loginContractorUserQuery} = require("../graphql/loginContractorUserQuery");
const {query: loginStaffQuery} = require("../graphql/loginContractorUserQuery");//TODO: create this for Staff

exports.User = {
    query: loginUserQuery,
    operationName: "loginUserQuery",
};

exports.ContractorUser = {
    query: loginContractorUserQuery,
    operationName: "loginContractorUserQuery",
};

exports.Staff = {
    query: loginStaffQuery,
    operationName: "loginStaffQuery",
};