//<editor-fold desc="findByIdOrgHRDocumentsDateRangeDashboardStatsImpl">
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

    let org, org_id_key, id;
    if (isContractorView) {
        id = logged_contractor_id;
        org_id_key = "contractor_id";
        org = "Contractor";
    } else {
        if (isConsultant) {
            if (selected_site_id) {
                id = selected_site_id;
                org_id_key = "site_id";
                org = "Site";
            } else if (selected_project_id) {
                id = selected_project_id;
                org_id_key = "project_id";
                org = "Project";
            } else if (selected_client_id) {
                id = selected_client_id;
                org_id_key = "client_id";
                org = "Client";
            } else {
                id = company_id;
                org_id_key = "company_id";
                org = "Company";
            }
        } else if (!isNoProjects) {//client with projects
            if (selected_site_id) {
                id = selected_site_id;
                org_id_key = "site_id";
                org = "Site";
            } else if (selected_project_id) {
                id = selected_project_id;
                org_id_key = "project_id";
                org = "Project";
            } else {
                id = company_id;
                org_id_key = "company_id";
                org = "Company";
            }
        } else {
            id = company_id;
            org_id_key = "company_id";
            org = "Company";
        }
    }

    const {monStart, monEnd} = data;
    const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);

    return {org, org_id_key, id, dates};
};

exports.findByIdOrgHRPersonalDocumentsDateRangeDashboardStatsImpl = (
    {
        // org,
        // org_id_key,
        name,
        type,
    }
) => {
    return async (socket, data) => {
        const args = await getArgs(socket, data);
        if (!args) return;

        const {org, org_id_key, id, dates} = args;

        const operationName = `findById${org}HRDocument${name}DateRangeDashboardStatsQuery`;

        return Promise.all(
            dates.map(async date => {
                const {start: dateStart, end: dateEnd} = date;
                const stats = await getGraphQLOne({
                    variables: {id, dateStart, dateEnd},
                    multi_queries: true,
                    query: `
			      query ${operationName}($id: bigint, $dateStart: date, $dateEnd: date) {
	            #doc_list
			        list_aggregate:hr_employees_documents_aggregate(where: {
			            employee: {${org_id_key}: {_eq: $id}},
			            removed: {_eq: false}, expiry_date: {_gte: $dateStart, _lte: $dateEnd}, type: {_eq: "${type}"}
			        }){
			            aggregate{
			                count
			            }
			        }
			      }
			    `,
                    operationName,
                });

                if (!stats) return {id, month_year: Dates.parse(dateStart).formatMonthYear(), count: 0};

                const {list_aggregate: {aggregate: {count}}} = stats;
                return {id, month_year: Dates.parse(dateStart).formatMonthYear(), count};
            })
        );
    };
};
//</editor-fold>
