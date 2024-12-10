//<editor-fold desc="getDateRangeDashboardFragment">
module.exports.getDateRangeDashboardFragment = (listName, isContract) => {
	return `
		id
	    
	    #${listName}
	    list_aggregate:${listName}_aggregate(where: {
	        removed: {_eq: false},
	        ${isContract ? 'contract_details: {':''}expiry_date: {_gte: $dateStart, _lte: $dateEnd}${isContract ? '}' : ''}
	    }){
	        aggregate{
	            count
	        }
	    }
	`;
};
//</editor-fold>
