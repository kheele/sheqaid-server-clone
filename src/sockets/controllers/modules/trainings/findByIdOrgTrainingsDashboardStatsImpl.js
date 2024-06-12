//<editor-fold desc="listImpl">
const findByIdOrgTrainingsDashboardStatsImpl = (
	{
		org,
		tbl,
	}
) => {
	const operationName = `findById${org}TrainingsDashboardStatsQuery`;
	
	return async (socket, data) => {
		const {
			id,
			//
			// site_id, project_id, client_id, company_id,
		} = data;
		
		// const id = site_id || project_id || client_id || company_id;
		// let tbl;
		// if(site_id) {
		// 	tbl = "default_sites";
		// } else if(project_id) {
		// 	tbl = "default_projects";
		// } else if(client_id) {
		// 	tbl = "default_clients";
		// } else {
		// 	tbl = "default_companies";
		// }
		
		return getGraphQLOne({
			query: `
	      query ${operationName} {
	        ${tbl}(
	            where: {id: {_eq: ${id}},},
	        ) {
            id
            cost_list_aggregate:training_matrix_list_aggregate{
                aggregate {
                    sum {
                        cost
                    }
                }
            }
            training_list_aggregate:training_matrix_list_aggregate{
                aggregate{
                    count
                }
            }
            participant_list_aggregate:training_plan_list_aggregate(where: {completion_status: {_eq: "Completed"}}) {
                aggregate {
                    count(distinct: true, columns: employee_id)
                }
            }
            training_course_list_aggregate{
                aggregate{
                    count
                }
            }
            institution_list_aggregate:training_matrix_list_aggregate{
                aggregate {
                    count(distinct: true, columns: institution_conducting_training)
                }
            }
            trainer_internal_list_aggregate:training_matrix_list_aggregate{
                aggregate {
                    count(distinct: true, columns: trainer_id)
                }
            }
            trainer_external_list_aggregate:training_matrix_list_aggregate{
                aggregate {
                    count(distinct: true, columns: trainer_external_id)
                }
            }
          }
	      }
	    `,
			operationName,
		});
	};
};
//</editor-fold>

exports.findByIdCompanyTrainingsDashboardStats = () => {
	return findByIdOrgTrainingsDashboardStatsImpl({
		org: "Company",
		tbl: "default_companies",
	});
};

exports.findByIdClientTrainingsDashboardStats = () => {
	return findByIdOrgTrainingsDashboardStatsImpl({
		org: "Client",
		tbl: "default_clients",
	});
};

exports.findByIdProjectTrainingsDashboardStats = () => {
	return findByIdOrgTrainingsDashboardStatsImpl({
		org: "Project",
		tbl: "default_projects",
	});
};

exports.findByIdSiteTrainingsDashboardStats = () => {
	return findByIdOrgTrainingsDashboardStatsImpl({
		org: "Site",
		tbl: "default_sites",
	});
};

exports.findByIdContractorTrainingsDashboardStats = () => {
	return findByIdOrgTrainingsDashboardStatsImpl({
		org: "Contractor",
		tbl: "default_contractors",
	});
};
