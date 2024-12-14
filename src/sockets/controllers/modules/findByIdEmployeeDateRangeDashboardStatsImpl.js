//<editor-fold desc="findByIdEmployeeDateRangeDashboardStats">
const getArgs = async (socket, data) => {
	const {monStart, monEnd} = data;
	const dates = Dates.getMonthsStartAndEndDateRangeSQL(monStart, monEnd);
	return {dates};
};

exports.findByIdEmployeeDateRangeDashboardStats = (config) => {
	return async (socket, data) => {
		if (!data) return;

		const args = await getArgs(socket, data);
		if (!args) return;

		const {
			name,
			listName,
			isContract,
			type,
			onCreateQuery,
		} = config

		const {dates} = args;
		const {id} = data;

		const operationName = `findByIdEmployeeHR${name}DateRangeDashboardStatsQuery`;

		if(onCreateQuery) {
			return onCreateQuery({...data, dates}, operationName);
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
//</editor-fold>
