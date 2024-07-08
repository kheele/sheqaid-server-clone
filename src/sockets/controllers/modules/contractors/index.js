require('./library');
require('./questionnaires');
require('./sites');
require('./template-categories');
require('./templates');
require('./users');

const updateImpl = require("../updateImpl");
const findByIdImpl = require('../findByIdImpl');
const listImpl = require('../listImpl');
const {contractor_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");
const {orgs_no_site_fragment} = require("../../../../graphql/Fragments");
const findByIdDashboardMainImpl = require("./findByIdDashboardMainImpl");
const findByIdDashboardSingleImpl = require("./findByIdDashboardSingleImpl");
const createImpl = require("../createImpl");

const args = {
	name: "Contractors",
	tbl: "default_contractors",
	details_fragment,
	orgs_fragment: orgs_no_site_fragment,
};

eventManager.on(`contractors/create`, async (socket, input) => {
	const fn = createImpl(args);

	const {
		name,
		username,
		inc_contractor_pack,
		client_id,
		project_id,
		site_list,
	} = input;

	// const {sess_company_id, sess_my_client_id, sess_my_project_id, sess_my_site_id} = this;
	// const {selectedClient, selectedProject, selectedSite} = storage.selected;
	// const {isConsultant, isNoProjects} = storage.is;

	const existingCompany = await findByContractorEmailClient(username);
	const linked_company_id = existingCompany && existingCompany.id;

	let savedItem;

	if (linked_company_id) {
		//existing client by matched username
		const existingContractor = await findByLinkedCompanyIdUsernameContractor(linked_company_id);
		if (existingContractor) {
			//existing client by matched username ALREADY linked
			//send confirmation to contractor to setup/accept
			savedItem = await updateContractor({id: existingContractor.id, site_list});
		} else {
			//existing client by matched username NOT linked
			const existingContractor = await findByUsernameContractor(username);
			if (existingContractor) {
				//existing contractor by matched username
				//send confirmation to contractor to setup/accept
				savedItem = await updateContractor({id: existingContractor.id, site_list, linked_company_id});
				if (savedItem) {
					await updateClient({id: linked_company_id, linked_contractor_id: savedItem.id});
				}
			} else {
				// input.company_id = sess_company_id;
				// if (sess_my_client_id) {
				//   input.client_id = sess_my_client_id;
				// } else if (isConsultant) {
				//   if(client_id || selectedClient) {
				//     input.client_id = client_id || selectedClient.id;
				//   }
				// }
				crudUtils.injectCreate(input, true);
				input.linked_company_id = linked_company_id;
				savedItem = await createMutationImpl({mutation, input});
				if (savedItem) {
					await updateClient({id: linked_company_id, linked_contractor_id: savedItem.id});
				}
			}
		}
	} else {
		//NO existing client by matched username
		const existingContractor = await findByUsernameContractor(username);
		if (existingContractor) {
			//existing contractor by matched username
			//send confirmation to contractor to setup/accept
			savedItem = await updateContractor({id: existingContractor.id, site_list});
		} else {
			//NO existing contractor by matched username
			// input.company_id = sess_company_id;
			// if (sess_my_client_id) {
			//   input.client_id = sess_my_client_id;
			// } else if (isConsultant) {
			//   if(client_id || selectedClient) {
			//     input.client_id = client_id || selectedClient.id;
			//   }
			// }
			crudUtils.injectCreate(input, true);
			savedItem = await createMutationImpl({mutation, input});
		}
	}

	if (savedItem) {
		return await findByIdContractor(savedItem.id);
	}
});

eventManager.on(`contractors/update`, async (socket, attrs) => {
	const findById = findByIdImpl(args);

	const {
		id,
	} = attrs;

	const item = await findById(socket, id);
	if (!item) return;

	const {
		removed,
		name,
		username,
		inc_contractor_pack,
		client_id,
		project_id,
		site_list,
	} = attrs;

	if (site_list) {
		delete attrs.site_list;

		const updateProxyContractorSite = updateImpl({
			name: "ProxyContractorSite",
			tbl: "proxy_contractors__sites",
			details_fragment: `
                id
            `,
			orgs_fragment: null,
		});

		const insertProxyContractorSite = createImpl({
			name: "ProxyContractorSite",
			tbl: "proxy_contractors__sites",
			details_fragment: `
                id
            `,
			orgs_fragment: null,
		});

		await Promise.all((site_list.data || site_list).map(async v => {
			if (v.id) {
				await updateProxyContractorSite(socket, v);
			} else {
				await insertProxyContractorSite(socket, {...v, contractor_id: id});
			}
		}));
	}

	const update = updateImpl(args);
	return update(socket, attrs);
});

eventManager.on("contractors/findById", findByIdImpl(args));

eventManager.on("contractors/listByLogged", listImpl({
	...args,
	order_by: "order_by: {name: asc}",
	getVariablesAndQueryConfig,
}));

eventManager.on("contractors/main/dashboard", findByIdDashboardMainImpl);

eventManager.on("contractors/single/dashboard", findByIdDashboardSingleImpl);
