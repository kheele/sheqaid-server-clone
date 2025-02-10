const updateImpl = require("../updateImpl");
const {contractor_details_fragment} = require("./commons");
const findByIdImpl = require("../findByIdImpl");
const createImpl = require("../createImpl");

const args = {
    name: "Contractor",
    tbl: "default_contractors",
    details_fragment: contractor_details_fragment(),
};

//<editor-fold desc="updateContractor">
exports.updateContractor = async (socket, attrs) => {
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
};
//</editor-fold>
