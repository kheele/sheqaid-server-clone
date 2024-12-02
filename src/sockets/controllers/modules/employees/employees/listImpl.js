const {orgs_fragment, employee_personal_details_fragment} = require("../../../../../graphql/Fragments");
const {getVariablesAndQueryConfig} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    // console.log('data', data)

    let {
        offset = 0,
        limit = 50,
        //
        removed = false,
        id,
        incContractors = false,
        excludeIds,
        department_id,
        job_position_id,
        job_category_id,
        team_id,
        supervisor_id,
        name,
        id_or_pass_num,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
        //
        client_filter,
        orgs_filter = [],
    } = data;

    console.log('listImpl1', orgs_filter)
    // const orgs_filter = socket.orgsFilter(data);
    console.log('listImpl2', socket.orgsFilter(data))

    const {filter} = getVariablesAndQueryConfig({
        orgs_filter,
        excludeIds,
        id,
        //
        incContractors,
        department_id,
        job_position_id,
        job_category_id,
        team_id,
        supervisor_id,
        name,
        id_or_pass_num,
        //
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    const query = `
		query listAllEmployeesByLoggedQuery {
			hr_employees(
			    where: {
					removed: {_eq: ${removed}},
					${filter}
			    },
	            order_by: {employment_num: asc},
	            offset: ${offset},
	            ${limit > 0 ? `limit: ${limit}` : ''}
			) {
                ${employee_personal_details_fragment}
                employment_num
                employment_date
                removed
                  
                job_observation_list_aggregate(where: {removed: {_eq: false}}){
                    aggregate{
                        count
                    }
                }
                job_observation_list{
                    id
                    name
                }
		  
                medical_list_aggregate(where: {removed: {_eq: false}}){
                    aggregate{
                    count
                    }
                }
                leave_list_aggregate(where: {removed: {_eq: false}}){
                  aggregate{
                    count
                  }
                }
                ppe_type_list_aggregate{
                  aggregate{
                    count
                  }
                }
                trainer_training_list_aggregate:trainer_training_matrix_list_aggregate{
                  aggregate{
                    count
                  }
                }
                warning_list_aggregate(where: {removed: {_eq: false}}){
                  aggregate{
                    count
                  }
                }
                supervisor_employee_list_aggregate(where: {removed: {_eq: false}}){
                  aggregate{
                    count
                  }
                }
                supervisor{
                  ${employee_personal_details_fragment}
                }
                linked_user {
                  id
                  fname
                  lname
                  username
                  phone
                }
                department {
                  id
                  name
                }
                job_position {
                  id
                  name
                  job_category{
                    id
                    name
                  }
                }
                ${incContractors ? `
                contractor {
                  id
                  name
                }` : ''}
                ${orgs_fragment}
			}
		}
	`;

    return listGraphQL({
        query,
        operationName: "listAllEmployeesByLoggedQuery",
    }).catch(err => {
        console.error(err, query);
        throw err;
    });
}
//</editor-fold>
