const listImpl = require('../../modules/listImpl');
const findByIdImpl = require('../../modules/findByIdImpl');
const {manual_details_fragment: details_fragment, getVariablesAndQueryConfig} = require("./commons");

const args = {
    name: "Manuals",
    tbl: "manuals",
    details_fragment,
    orgs_fragment: null,
};

eventManager.on("manuals/findById", async (socket, id) => {
    const findById = findByIdImpl(args);

    return findById(socket, id).then(res => {
        processUrls(res);
        return res;
    });
});

eventManager.on("manuals/list", listImpl({
    ...args,
    order_by: "order_by: {name: asc}",
    getVariablesAndQueryConfig,
}));

const processUrls = (item) => {
    if (!item) {
        return;
    }

    const {id, data} = item;

    {
        const site_url = {
            1: "hr-management-ajfqwq2",
            2: "asset-management-vnzdgxp",
            3: "sheq-management-ppfhov9",
        }[id];

        data.site_url = `https://${site_url}.gamma.site`;
    }

    {
        const pdf_url = {
            1: "https://assets.api.gamma.app/export/pdf/b3fbhyf3z1zsnz6/6cfd88075e88fc11dcc33cade282ad8c/SHEQ-Intel-Employee-Management.pdf",
            // 2: "asset-management-vnzdgxp",
            // 3: "sheq-management-ppfhov9",
        }[id];

        data.pdf_url = pdf_url;
    }

    {
        const ppt_url = {
            1: "https://assets.api.gamma.app/export/pptx/b3fbhyf3z1zsnz6/0dc113c3bfaeb5bd8afef2c15fb5e204/SHEQ-Intel-Employee-Management.pptx",
            // 2: "asset-management-vnzdgxp",
            // 3: "sheq-management-ppfhov9",
        }[id];

        data.ppt_url = ppt_url;
    }
};
