const createImpl = require("../createImpl");
const {contractor_details_fragment} = require("./commons");
const {findClientByContractorEmail} = require("../../general/clients/query_clients");
const {updateContractor} = require("./update");
const {checkContractorExistByUsername, findByIdContractor, checkContractorExistByLinkedCompanyId} = require("./query_contractors");
const {updateClient} = require("../../general/clients/update");

const args = {
    name: "Contractor",
    tbl: "default_contractors",
    details_fragment: contractor_details_fragment(),
};

//<editor-fold desc="createContractor">
exports.createContractor = async (socket, input) => {
    const create = createImpl({...args, skipOrgs: true});

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

    const existingCompany = await findClientByContractorEmail(socket, username);
    const linked_company_id = existingCompany && existingCompany.id;

    let savedItem;

    if (linked_company_id) {
        //existing client by matched username
        const existingContractor = await checkContractorExistByLinkedCompanyId(socket, linked_company_id);
        if (existingContractor) {
            //existing client by matched username ALREADY linked
            //send confirmation to contractor to setup/accept
            savedItem = await updateContractor(socket, {id: existingContractor.id, site_list});
        } else {
            //existing client by matched username NOT linked
            const existingContractor = await checkContractorExistByUsername(socket, username);
            if (existingContractor) {
                //existing contractor by matched username
                //send confirmation to contractor to setup/accept
                savedItem = await updateContractor(socket, {id: existingContractor.id, site_list, linked_company_id});
                if (savedItem) {
                    await updateClient(socket, {id: linked_company_id, linked_contractor_id: savedItem.id});
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
                input.linked_company_id = linked_company_id;
                savedItem = await create(socket, input);
                if (savedItem) {
                    await updateClient(socket, {id: linked_company_id, linked_contractor_id: savedItem.id});
                }
            }
        }
    } else {
        //NO existing client by matched username
        const existingContractor = await checkContractorExistByUsername(socket, username);
        if (existingContractor) {
            //existing contractor by matched username
            //send confirmation to contractor to setup/accept
            savedItem = await updateContractor(socket, {id: existingContractor.id, site_list});
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
            savedItem = await create(socket, input);
        }
    }
    if (savedItem) {
        return await findByIdContractor(socket, savedItem.id);
    }
};
//</editor-fold>
