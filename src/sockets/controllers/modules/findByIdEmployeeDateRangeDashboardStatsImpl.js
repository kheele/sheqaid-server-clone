//<editor-fold desc="findByIdEmployeeDateRangeDashboardStats">
const findByIdEmployeeDateRangeDashboardStats = (
	{
		name,
		listName,
		isContract,
		type,
		onCreateQuery,
	}
) => {
	const operationName = `findByIdEmployeeHR${name}DateRangeDashboardStatsQuery`;
	
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
			return onCreateQuery(data, operationName);
		}
		
		return Promise.all(
			dates.map(async date => {
				const {start: dateStart, end: dateEnd} = date;
				const stats = await getGraphQLOne({
					variables: {id, dateStart, dateEnd},
					query: `
			      query ${operationName}($id: bigint, $dateStart: date, $dateEnd: date) {
			        hr_employees(where: {id: {_eq: $id}}) {
                id
                #${listName}
                list_aggregate:${listName}_aggregate(where: {
                  removed: {_eq: false},
	                ${isContract ? 'contract_details: {' : ''}expiry_date: {_gte: $dateStart, _lte: $dateEnd}${isContract ? '}' : ''}
	                ${type ? `, type: {_eq: "${type}"}` : ''}
                }){
                  aggregate{
                    count
                  }
                }
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
exports.findByIdEmployeeDateRangeDashboardStats = findByIdEmployeeDateRangeDashboardStats;
//</editor-fold>
