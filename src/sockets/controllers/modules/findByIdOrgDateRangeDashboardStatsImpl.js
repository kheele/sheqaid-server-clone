//<editor-fold desc="listImpl">
const findByIdOrgDateRangeDashboardStatsImpl = (
	{
		name,
		org,
		tbl,
		details_fragment,
		onCreateQuery,
	}
) => {
	const operationName = `findById${org}${name}DateRangeDashboardStatsQuery`;
	
	return async (socket, data) => {
		const {
			id,
			dates,
			//
			// site_id, project_id, client_id, company_id,
		} = data;
		
		// const id = site_id || project_id || client_id || company_id;
		// let tbl;
		// if(site_id) {
		// 	tbl = "default_sites";
		// } else if(project_id) {
		// 	tbl = "default_projects";
		// } else if(client_id) {
		// 	tbl = "default_clients";
		// } else {
		// 	tbl = "default_companies";
		// }
		
		if(onCreateQuery) {
			return onCreateQuery(data, operationName, tbl);
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

exports.findByIdCompanyDateRangeDashboardStatsImpl = ({name, details_fragment, onCreateQuery}) => {
	return findByIdOrgDateRangeDashboardStatsImpl({
		org: "Company",
		tbl: "default_companies",
		name,
		details_fragment,
		onCreateQuery,
	});
};

exports.findByIdClientDateRangeDashboardStatsImpl = ({name, details_fragment, onCreateQuery}) => {
	return findByIdOrgDateRangeDashboardStatsImpl({
		org: "Client",
		tbl: "default_clients",
		name,
		details_fragment,
		onCreateQuery,
	});
};

exports.findByIdProjectDateRangeDashboardStatsImpl = ({name, details_fragment, onCreateQuery}) => {
	return findByIdOrgDateRangeDashboardStatsImpl({
		org: "Project",
		tbl: "default_projects",
		name,
		details_fragment,
		onCreateQuery,
	});
};

exports.findByIdSiteDateRangeDashboardStatsImpl = ({name, details_fragment, onCreateQuery}) => {
	return findByIdOrgDateRangeDashboardStatsImpl({
		org: "Site",
		tbl: "default_sites",
		name,
		details_fragment,
		onCreateQuery,
	});
};

exports.findByIdContractorDateRangeDashboardStatsImpl = ({name, details_fragment, onCreateQuery}) => {
	return findByIdOrgDateRangeDashboardStatsImpl({
		org: "Contractor",
		tbl: "default_contractors",
		name,
		details_fragment,
		onCreateQuery,
	});
};
