const findByIdImpl = require("../../modules/findByIdImpl");
const findImpl = require("../../modules/findImpl");
const {details_fragment} = require("./commons");

const args = {
    name: "Clients",
    tbl: "default_clients",
    details_fragment: `
        id
    `,
    orgs_fragment: `
		company {
			id
			name
		}
	`,
};

//<editor-fold desc="findByIdClient">
exports.findByIdClient = async (socket, id) => {
    const findById = findByIdImpl({
        ...args,
        details_fragment,
        orgs_fragment: `
            company {
                id
                name
            }
        `,
    });
    return findById(socket, id);
};
//</editor-fold>

//<editor-fold desc="checkClientExistById">
exports.checkClientExistById = async (socket, id) => {
    const findById = findByIdImpl(args);
    return findById(socket, id);
};
//</editor-fold>

//<editor-fold desc="findClientByContractorEmail">
exports.findClientByContractorEmail = async (socket, contractor_email) => {
    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({contractor_email}) => {
            return {filter: `contractor_email: {_eq: "${contractor_email}"}`};
        }
    });

    return findBy(socket, {contractor_email});
};
//</editor-fold>

//<editor-fold desc="checkDuplicateClientByContractorEmail">
exports.checkDuplicateClientByContractorEmail = async (socket, {id, contractor_email}) => {
    const findBy = findImpl({
        ...args,
        getVariablesAndQueryConfig: ({id, contractor_email}) => {
            return {filter: `id: {_neq: ${id}}, contractor_email: {_eq: "${contractor_email}"}`};
        }
    });

    return findBy(socket, {id, contractor_email});
};
//</editor-fold>
