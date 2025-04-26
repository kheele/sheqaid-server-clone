const createImpl = require("../../modules/createImpl");
const {details_fragment} = require("./commons");

const args = {
    name: "Sectors",
    tbl: "default_sectors",
    details_fragment,
    orgs_fragment: `
		company {
			id
			name
		}
		client {
			id
			name
		}
	`,
};

//<editor-fold desc="createSector">
exports.createSector = async (socket, input) => {
    const create = createImpl(args);

    const is = await socket.is();
    if (!is) return;
    const decodedIdToken = await socket.getDecodedIdToken();
    if (!decodedIdToken) return;

    const {
        company_id,
        selected_client_id,
        selected_project_id,
        selected_site_id,
        logged_contractor_id
    } = decodedIdToken;

    const {isContractor} = is;

    const loggedUser = await socket.getLoggedUser();
    if (!loggedUser) return;
    const {user: {id: user_id}} = loggedUser;

    const {id} = input;

    if(id) {
        delete input.id;
        input.parent_id = id;
    }

    if (isContractor) {
        input.contractor_user_id = user_id;
        input.contractor_id = logged_contractor_id;
        input.company_id = 38;//TODO: THIS IS A HACK. THE COMPANY WITH THIS ID WAS CREATED ONLY TO ASSIGN CONTRACTORS DATA TO THE COMPANY. BECAUSE PGSQL THROWS NON-NULL ERROR.
        return;
    } else {
        input.user_id = user_id;
        input.company_id = company_id;
    }

    if (selected_client_id) {
        input.client_id = selected_client_id;
    }

    input.sector_owner = "Private";

    return create(socket, input);
};
//</editor-fold>
