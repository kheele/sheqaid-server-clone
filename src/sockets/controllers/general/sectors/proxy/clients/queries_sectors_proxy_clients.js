const findImpl = require("../../../../modules/findImpl");

exports.findByIdProxySectorClient = async (socket, id) => {
    if(!id) return;

    const findBy = findImpl({
        name: "ProxySectorClient",
        tbl: "proxy_sector__client",
        details_fragment: `
            sector_id
            sector{
                id
            }
            client_id
            client{
                id
                name
            }
        `,
        getVariablesAndQueryConfig: ({sector_id, client_id}) => {
            return {filter: `sector_id: {_eq: ${sector_id}}, client_id: {_eq: ${client_id}}`};
        }
    });

    return findBy(socket, id);
};