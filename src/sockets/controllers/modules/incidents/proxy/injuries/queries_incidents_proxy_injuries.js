const findImpl = require("../../../findImpl");

exports.findByIdProxyIncidentInjury = async (socket, id) => {
    if(!id) return;

    const findBy = findImpl({
        name: "ProxyIncidentInjury",
        tbl: "proxy_incident__injury",
        details_fragment: `
            incident_id
            incident{
                id
            }
            injury_id
            injury{
                id
                name
                type
            }
        `,
        getVariablesAndQueryConfig: ({incident_id, injury_id}) => {
            return {filter: `incident_id: {_eq: ${incident_id}}, injury_id: {_eq: ${injury_id}}`};
        }
    });

    return findBy(socket, id);
};