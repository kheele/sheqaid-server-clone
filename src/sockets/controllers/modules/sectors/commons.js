//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
	{
		orgs_filter = [],
		//
		id,
		//
		name,
		sector_owner,
		//
		site_id, project_id, client_id,
		//
		exact_orgs = false,
	}
) => {
	//<editor-fold desc="variables, filters">
	let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});
	
	if (id) {
		filter.push(`id: {_eq: ${id}}`);
	} else {
		if (name) {
			filter.push(`name: {_ilike: "%${name}%"}`);
		}
		if (sector_owner) {
			filter.push(`sector_owner: {_eq: "${sector_owner}%"}`);
		}
	}
	
	filter = filter.join(',');
	//</editor-fold>
	
	return {filter};
};
//</editor-fold>

//<editor-fold desc="details_fragment">
exports.details_fragment = async (socket, data) => {
	const is = await socket.is();
	if (!is) return;

	const {isConsultant, isNoProjects, isContractorView} = is;
	const decodedIdToken = await socket.getDecodedIdToken();
	if (!decodedIdToken) return;

	const {
		company_id,
		my_client,
		my_project,
		my_site,
		contractor_id,

		selected_client_id,
		selected_project_id,
		selected_site_id,
		logged_contractor_id,

		selected_contractor_client_id,
		selected_contractor_site_id,

		// access_type,
		// loggedUser: {user: {id: user_id}},
	} = decodedIdToken;

	let training_course_list_aggregate = '';
	if(selected_site_id || selected_contractor_site_id) {
		training_course_list_aggregate = `(where: {site_id: {_eq: ${selected_site_id || selected_contractor_site_id}}})`;
	} else if(selected_project_id) {
		training_course_list_aggregate = `(where: {project_id: {_eq: ${selected_project_id}}})`;
	} else if(selected_client_id || selected_contractor_client_id) {
		training_course_list_aggregate = `(where: {client_id: {_eq: ${selected_client_id || selected_contractor_client_id}}})`;
	} else if(contractor_id || logged_contractor_id) {
		training_course_list_aggregate = `(where: {contractor_id: {_eq: ${contractor_id || logged_contractor_id}}})`;
	} else if(company_id) {
		training_course_list_aggregate = `(where: {company_id: {_eq: ${company_id}}})`;
	}

	return `
		id
		created_at
		name
		desc
		sector_owner
		training_course_list_aggregate${training_course_list_aggregate}{
			aggregate{
				count
			}
		}
		company_list_aggregate{
			aggregate{
				count
			}
		}
		client_list_aggregate{
			aggregate{
				count
			}
		}
	`;
};
//</editor-fold>
