//<editor-fold desc="listImpl">
const getArgs = async (socket, data) => {
    const {monStart, monEnd} = data;
    const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

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

    return {org, tbl, id, dates};
};

exports.findByIdOrgDateRangeDashboardStatsImpl = (
    {
        name,
        // org,
        // tbl,
        details_fragment,
        onCreateQuery,
    }
) => {
    return async (socket, data) => {
        const args = await getArgs(socket, data);
        if (!args) return;

        const {org, tbl, id, dates} = args;

        const operationName = `findById${org}${name}DateRangeDashboardStatsQuery`;

        if (onCreateQuery) {
            return onCreateQuery({...data, id, dates}, operationName, tbl);
        }

        return Promise.all(
            dates.map(async date => {
                const {start: dateStart, end: dateEnd} = date;
                const stats = await getGraphQLOne({
                    variables: {id, dateStart, dateEnd},
                    query: `
			      query ${operationName}($id: bigint, $dateStart: date, $dateEnd: date) {
			        ${tbl}(
			            where: {id: {_eq: $id},},
			        ) {
			            ${details_fragment}
			        }
			      }
			    `,
                    operationName,
                });

                if (!stats) return {id, month_year: Dates.parse(dateStart).formatMonthYear(), count: 0};

                const {id: _id, data: {list_aggregate: {aggregate: {count}}}} = stats;
                return {id, month_year: Dates.parse(dateStart).formatMonthYear(), count};
            })
        );
    };
};
//</editor-fold>
//164