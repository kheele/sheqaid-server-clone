const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {job_positions_details_fragment} = require('./commons');

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
            query findByClientIdAndNameJobPositionQuery {
                default_job_positions(
                  where: {
                    name: {_eq: "${name}"},
                    ${where}
                  },
                ) {
                    ${job_positions_details_fragment}
                    ${orgs_fragment}
                }
            }
        `,
		operationName: "findByClientIdAndNameJobPositionQuery",
	});
}
//</editor-fold>
