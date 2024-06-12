const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {departments_details_fragment} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
	if (!data) {
		return;
	}
	
	const {
		name,
		//
		client_id,
		company_id,
		contractor_id,
		//
		incContractors,
		excContractors,
		exact_orgs,
		exact_orgs_company,
		//
		orgs_filter,
	} = data;
	
	let where = [];
	if(contractor_id) {
		where.push(`{contractor_id:{_eq: ${contractor_id}}}`);
		if(client_id) {
			where.push(`{client_id:{_eq: ${client_id}}}`);
		} else {
			where.push(`{company_id:{_eq: ${company_id}}}`);
		}
		
		where = `_or: [${where.join(', ')}]`;
	} else if(client_id) {
		where.push(`client_id:{_eq: ${client_id}}`);
	} else {
		where.push(`company_id:{_eq: ${company_id}}`);
	}
	
	return getGraphQLOne({
		query: `
            query findByClientIdAndNameDepartmentQuery {
                default_departments(
                  where: {
                    name: {_eq: "${name}"},
                    ${where}
                  },
                ) {
                    ${departments_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
		operationName: "findByClientIdAndNameDepartmentQuery",
	});
}
//</editor-fold>
