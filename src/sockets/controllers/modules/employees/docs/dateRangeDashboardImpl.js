const {
	findByIdCompanyDateRangeDashboardStatsImpl,
	findByIdClientDateRangeDashboardStatsImpl,
	findByIdProjectDateRangeDashboardStatsImpl,
	findByIdSiteDateRangeDashboardStatsImpl,
	findByIdContractorDateRangeDashboardStatsImpl,
} = require("../../findByIdOrgDateRangeDashboardStatsImpl");

//<editor-fold desc="getFragment">
const getFragment = (listName, isContract) => {
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

//<editor-fold desc="findByIdCompanyDateRangeDashboardStatsImpl">
module.exports.findByIdCompanyDateRangeDashboardStats = ({name, listName, details_fragment, onCreateQuery, isContract}) => {
	return findByIdCompanyDateRangeDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: details_fragment || getFragment(listName, isContract),
		onCreateQuery,
	});
}
//</editor-fold>

//<editor-fold desc="findByIdClientDateRangeDashboardStatsImpl">
module.exports.findByIdClientDateRangeDashboardStats = ({name, listName, details_fragment, onCreateQuery, isContract}) => {
	return findByIdClientDateRangeDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: details_fragment || getFragment(listName, isContract),
		onCreateQuery,
	});
}
//</editor-fold>

//<editor-fold desc="findByIdProjectDateRangeDashboardStatsImpl">
module.exports.findByIdProjectDateRangeDashboardStats = ({name, listName, details_fragment, onCreateQuery, isContract}) => {
	return findByIdProjectDateRangeDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: details_fragment || getFragment(listName, isContract),
		onCreateQuery,
	});
}
//</editor-fold>

//<editor-fold desc="findByIdSiteDateRangeDashboardStatsImpl">
module.exports.findByIdSiteDateRangeDashboardStats = ({name, listName, details_fragment, onCreateQuery, isContract}) => {
	return findByIdSiteDateRangeDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: details_fragment || getFragment(listName, isContract),
		onCreateQuery,
	});
}
//</editor-fold>

//<editor-fold desc="findByIdContractorDateRangeDashboardStatsImpl">
module.exports.findByIdContractorDateRangeDashboardStats = ({name, listName, details_fragment, onCreateQuery, isContract}) => {
	return findByIdContractorDateRangeDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: details_fragment || getFragment(listName, isContract),
		onCreateQuery,
	});
}
//</editor-fold>
