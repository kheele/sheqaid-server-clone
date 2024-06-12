export const orgsFilter = (orgs) => {

};

export const createOrgQuery = (orgs, fragment) => {
	const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = storage.sessionIds;
	const {selectedClient, selectedProject, selectedSite,} = storage.selected;
	const {selectedContractorClient, selectedContractorSite} = storage.selected;
	const {loggedContractor} = storage;
	const {hasProjects, isConsultant, isContractor} = storage.is;

	let {
		// site_id,
		// project_id,
		// client_id,
		incContractors = false,
		excContractors = false,
		exact_orgs = false,
		exact_orgs_company = false,
	} = orgs || {};

	const company_id = sess_company_id;
	const client_id = selectedClient && selectedClient.id;
	const project_id = selectedProject && selectedProject.id;
	const site_id = selectedSite && selectedSite.id;

	if (site_id) {
		return `query findOneSiteQuery {
			default_sites_by_pk(${site_id}) {
				${fragment}
			}
		}`;
	}

	if (project_id) {
		return 'default_projects';
	}

	if (client_id) {
		return 'default_clients';
	}

	if (company_id) {
		return 'default_companies';
	}

	//<editor-fold desc="variables, filters">
	const filter = [];
	if (isContractor) {
		if (loggedContractor) {
			filter.push(`contractor_id: {_eq: ${loggedContractor.id}}`);
		}
		if (selectedContractorSite) {
			filter.push(`contractor_site_id: {_eq: ${selectedContractorSite.id}}`);
		} else if (selectedContractorClient) {
			filter.push(`contractor_site: {client_id: {_eq: ${selectedContractorClient.id}}}`);
		}
		return filter;
	} else {
		if (!excContractors && (loggedContractor || selectedContractorSite)) {
			if (loggedContractor) {
				filter.push(`contractor_id: {_eq: ${loggedContractor.id}}`);
			}
			if (selectedContractorSite) {
				filter.push(`contractor_site_id: {_eq: ${selectedContractorSite.id}}`);
			} else if (selectedContractorClient) {
				filter.push(`contractor_site: {client_id: {_eq: ${selectedContractorClient.id}}}`);
			}
			return filter;
		}
	}

	if (company_id) {
		filter.push(`company_id: {_eq: ${company_id}}`);
	}

	let qIncContractors;
	if (incContractors) {
		let q = '';
		if (client_id) {
			q = `, client_id: {_eq: ${client_id}}`;
		}
		qIncContractors = `{contractor: {company_id: {_eq: ${sess_company_id}}${q}}},`;
	}

	const site_id_fn = (site_id) => {
		if (site_id && !exact_orgs_company) {
			if (sess_my_site_id || exact_orgs) {
				return `, site_id: {_eq: ${site_id}}`;
			} else {
				return `, _or: [
					{site_id: {_eq: ${site_id}}}, 
					{site_id: {_is_null: true}}
				]`;
			}
		}
		return ``;
	};
	const project_id_fn = (project_id) => {
		if (project_id && !exact_orgs_company) {
			if (sess_my_project_id || exact_orgs) {
				return `, _or: [
					{
						project_id: {_eq: ${project_id}} 
						${site_id_fn(site_id)}
				  	}
				]`;
			} else {
				return `, _or: [
          			{
						project_id: {_eq: ${project_id}} 
						${site_id_fn(site_id)}
				  	},
				  	{project_id: {_is_null: true}}
        		]`;
			}
		}
		return ``;
	};

	if (isConsultant) {
		if (client_id) {
			if (sess_my_client_id || exact_orgs) {
				filter.push(`_or: [
					${qIncContractors ? `${qIncContractors},` : ''}
					{
					  client_id: {_eq: ${client_id}}
					  ${project_id_fn(project_id)}
					}
				]`);
			} else {
				filter.push(`_or: [
					${qIncContractors ? `${qIncContractors},` : ''}
					{
					  client_id: {_eq: ${client_id}}
					  ${project_id_fn(project_id)}
					}, 
					{client_id: {_is_null: true}}
				]`);
			}
		}
	} else {
		if (hasProjects) {
			filter.push(`_or: [
				${qIncContractors ? `${qIncContractors},` : ''}
				${project_id_fn(project_id).replace(', _or', '_or')}
	    	]`);
		} else if (qIncContractors) {
			filter.push(`_or: [
				${qIncContractors}
	    	]`);
		}
	}
	//</editor-fold>

	return filter;
};