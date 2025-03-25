const findImpl = require("../../../findImpl");

exports.findByIdProxyIncidentCategory = async (socket, id) => {
    if(!id) return;

    const findBy = findImpl({
        name: "ProxyIncidentCategory",
        tbl: "proxy_incident__category",
        details_fragment: `
            incident_id
            incident{
                id
            }
            category_id
            category{
                id
                name
            }
        `,
        getVariablesAndQueryConfig: ({incident_id, category_id}) => {
            return {filter: `incident_id: {_eq: ${incident_id}}, category_id: {_eq: ${category_id}}`};
        }
    });

    return findBy(socket, id);
};