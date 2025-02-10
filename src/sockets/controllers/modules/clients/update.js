const updateImpl = require("../updateImpl");
const {details_fragment} = require("./commons");
const {checkClientExistById, checkDuplicateClientByContractorEmail} = require("./query_clients");

const args = {
    name: "Clients",
    tbl: "default_clients",
    details_fragment,
    uploadUpdate: ({id}) => ({
        new_name: `clients/${id}/profile-pic`,
        key: 'profile_pic',
    }),
};

//<editor-fold desc="updateClient">
exports.updateClient = async (socket, attrs) => {
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
