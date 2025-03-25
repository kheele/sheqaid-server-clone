const findImpl = require("../../../findImpl");

exports.findByIdProxyIncidentSubCategory = async (socket, id) => {
    if(!id) return;

    const findBy = findImpl({
        name: "ProxyIncidentSubCategory",
        tbl: "proxy_incident__sub_category",
        details_fragment: `
            incident_id
            incident{
                id
            }
            sub_category_id
            sub_category{
                id
                name
                category{
                    id
                    name
                }
            }
        `,
        getVariablesAndQueryConfig: ({incident_id, sub_category_id}) => {
            return {filter: `incident_id: {_eq: ${incident_id}}, sub_category_id: {_eq: ${sub_category_id}}`};
        }
    });

    return findBy(socket, id);
};