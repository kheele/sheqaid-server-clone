//<editor-fold desc="listImpl">
const getDetailsFragment = require("./getDetailsFragment");
const getArgs = async (socket, data) => {
    //logged_contractor_id, selected_contractor_client_id, selected_contractor_site_id,
    //access_type
    const is = await socket.is();
    if (!is) return;

    const {isConsultant, isNoProjects, isContractorView} = is;
    const decodedIdToken = await socket.getDecodedIdToken();
    if (!decodedIdToken) return;
    const {
        company_id,
        selected_client_id,
        selected_project_id,
        selected_site_id,
        logged_contractor_id
    } = decodedIdToken;

    let org, tbl, id;
    if (isContractorView) {
        id = logged_contractor_id;
        tbl = "default_contractors";
        org = "Contractor";
    } else {
        if (isConsultant) {
            if (selected_site_id) {
                id = selected_site_id;
                tbl = "default_sites";
                org = "Site";
            } else if (selected_project_id) {
                id = selected_project_id;
                tbl = "default_projects";
                org = "Project";
            } else if (selected_client_id) {
                id = selected_client_id;
                tbl = "default_clients";
                org = "Client";
            } else {
                id = company_id;
                tbl = "default_companies";
                org = "Company";
            }
        } else if (!isNoProjects) {//client with projects
            if (selected_site_id) {
                id = selected_site_id;
                tbl = "default_sites";
                org = "Site";
            } else if (selected_project_id) {
                id = selected_project_id;
                tbl = "default_projects";
                org = "Project";
            } else {
                id = company_id;
                tbl = "default_companies";
                org = "Company";
            }
        } else {
            id = company_id;
            tbl = "default_companies";
            org = "Company";
        }
    }

    return {org, tbl, id};
};

exports.findByIdOrgDashboardStatsImpl = (config) => {
    return async (socket, data) => {
        if (!data) return;

        const args = await getArgs(socket, data);
        if (!args) return;

        let {
            name,
            // org,
            // tbl,
            details_fragment,
            mapResults,
            onCreateQuery,
        } = config;

        const {org, tbl, id} = args;

        const operationName = `findById${org}${name}DashboardStatsQuery`;

        const {
            // id,
            mon,
            mon2,
            mon3,
            //
            // site_id, project_id, client_id, company_id,
        } = data;

        // console.log('socket.decodedIdToken', socket.request.session.decodedIdToken)

        let promise;
        if (onCreateQuery) {
            promise = onCreateQuery({...data, id}, operationName, tbl);
        } else {
            details_fragment = await getDetailsFragment({socket, data, details_fragment});

            promise = getGraphQLOne({
                variables: {id, mon, mon2, mon3},
                query: `
                  query ${operationName}($id: bigint, $mon: date, $mon2: date, $mon3: date) {
                    ${tbl}(
                        where: {id: {_eq: $id},},
                    ) {
                        ${details_fragment}
                    }
                  }
                `,
                operationName,
            });
        }

        if (mapResults) {
            promise = promise.then(mapResults(id));
        }

        return promise;
    };
};
//</editor-fold>
