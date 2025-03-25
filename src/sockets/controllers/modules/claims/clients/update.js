const updateImpl = require("../../updateImpl");
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

//<editor-fold desc="updateClientClaim">
exports.updateClientClaim = async (socket, attrs) => {
    const update = updateImpl(args);

    const {
        id,
        name,
        business_id,
        phone,
        email,
        contractor_email,
        address,
        profile_pic,
        sector_list
    } = attrs;

    const item = await checkClientExistById(socket, id);
    if (!item) return;

    if (contractor_email) {
        const existingItem = await checkDuplicateClientByContractorEmail(socket, {id, contractor_email});
        if (existingItem) {
            return "DUP_CONTRACTOR_EMAIL";
        }
    }

    return update(socket, attrs);
};
//</editor-fold>
