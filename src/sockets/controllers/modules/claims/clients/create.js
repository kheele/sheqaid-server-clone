const createImpl = require("../../createImpl");
const {coida_claims_fragment: details_fragment} = require("./commons");

const args = {
    name: "ClaimsClient",
    tbl: "coida_claims",
    details_fragment,
    // uploadUpdate: ({id}) => ({
    //     new_name: `clients/${id}/profile-pic`,
    //     key: 'profile_pic',
    // }),
};

//<editor-fold desc="createClientClaim">
exports.createClientClaim = async (socket, input) => {
    const create = createImpl({...args, skipOrgs: true,});

    const {
        name,
        business_id,
        phone,
        email,
        contractor_email,
        address,
        profile_pic,
        sector_list
    } = input;

    const loggedUser = await socket.getLoggedUser();
    if (!loggedUser) return;
    const { user:{id: user_id}, company:{id: company_id}} = loggedUser;
    input.user_id = user_id;
    input.company_id = company_id;

    if (contractor_email) {
        const existingItem = await findClientByContractorEmail(socket, contractor_email);
        if (existingItem) {
            return "DUP_CONTRACTOR_EMAIL";
        }
    }

    return create(socket, input);
};
//</editor-fold>
