const createImpl = require("../createImpl");
const {
    asset_details_fragment: details_fragment, onProcessFormData,
} = require('./commons');

const args = {
    name: "Assets",
    tbl: "assets",
    details_fragment,
};

//<editor-fold desc="createAsset">
exports.createAsset = async (socket, input) => {
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        formData,
        target_asset_id,
        isParent,
        isChild,
    } = input;

    const create = createImpl({
        ...args,
        details_fragment,
    });

    const {session: {decodedIdToken}} = socket.request;
    const {company_id} = decodedIdToken || {};

    const data = await onProcessFormData({
        formData, target_asset_id, isParent, isChild, company_id,
    });
    console.log(data)

    return create(socket, data);
};
//</editor-fold>
