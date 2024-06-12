const {findByIdEmployeeDashboardStats} = require("../../findByIdEmployeeDashboardStatsImpl");

const {
	findByIdCompanyDashboardStatsImpl,
	findByIdClientDashboardStatsImpl,
	findByIdProjectDashboardStatsImpl,
	findByIdSiteDashboardStatsImpl,
	findByIdContractorDashboardStatsImpl,
} = require("../../findByIdOrgDashboardStatsImpl");

//<editor-fold desc="getFragment">
const getFragment = (listName, isContract) => {
	return `
			id
	    
	    #${listName}
	    list_active_aggregate:${listName}_aggregate(where: {removed: {_eq: false}}){
	        aggregate{
	            count
	        }
	    }
	    list_removed_aggregate:${listName}_aggregate(where: {removed: {_eq: true}}){
	        aggregate{
	            count
	        }
	    }
	    list_no_expiry_aggregate:${listName}_aggregate(where: {
	        removed: {_eq: false},
	        ${isContract ? 'contract_details: {' : ''}expiry_date: {_is_null: true}${isContract ? '}' : ''}
	    }){
	        aggregate{
	            count
	        }
	    }
	    list_expired_aggregate:${listName}_aggregate(where: {
	        removed: {_eq: false},
	        ${isContract ? 'contract_details: {' : ''}expiry_date: {_lte: "now()"}${isContract ? '}' : ''}
	    }){
	        aggregate{
	            count
	        }
	    }
	    list_mon_expiry_aggregate:${listName}_aggregate(where: {
	        removed: {_eq: false},
	        ${isContract ? 'contract_details: {' : ''}expiry_date: {_gt: "now()", _lte: $mon}${isContract ? '}' : ''}
	    }){
	        aggregate{
	            count
	        }
	    }
	    list_2mon_expiry_aggregate:${listName}_aggregate(where: {
	        removed: {_eq: false},
	        ${isContract ? 'contract_details: {' : ''}expiry_date: {_gt: $mon, _lte: $mon2}${isContract ? '}' : ''}
	    }){
	        aggregate{
	            count
	        }
	    }
	    list_3mon_expiry_aggregate:${listName}_aggregate(where: {
	        removed: {_eq: false},
	        ${isContract ? 'contract_details: {' : ''}expiry_date: {_gt: $mon2, _lte: $mon3}${isContract ? '}' : ''}
	    }){
	        aggregate{
	            count
	        }
	    }
	    list_4mon_expiry_aggregate:${listName}_aggregate(where: {
	        removed: {_eq: false},
	        ${isContract ? 'contract_details: {' : ''}expiry_date: {_gt: $mon3}${isContract ? '}' : ''}
	    }){
	        aggregate{
	            count
	        }
	    }
		`;
};
//</editor-fold>

const mapResults = id => {
	return res => res && res.data;
};

//<editor-fold desc="findByIdEmployeeDashboardStats">
module.exports.findByIdEmployeeDashboardStats = ({name, listName, onCreateQuery, isContract}) => {
	return findByIdEmployeeDashboardStats({
		name,
		listName,
		isContract,
		mapResults,
		onCreateQuery,
	});
}
//</editor-fold>

//<editor-fold desc="findByIdCompanyDashboardStatsImpl">
module.exports.findByIdCompanyDashboardStats = ({name, listName, details_fragment, onCreateQuery, isContract}) => {
	return findByIdCompanyDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: details_fragment || getFragment(listName, isContract),
		mapResults,
		onCreateQuery,
	});
}
//</editor-fold>

//<editor-fold desc="findByIdClientDashboardStatsImpl">
module.exports.findByIdClientDashboardStats = ({name, listName, details_fragment, onCreateQuery, isContract}) => {
	return findByIdClientDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: details_fragment || getFragment(listName, isContract),
		mapResults,
		onCreateQuery,
	});
}
//</editor-fold>

//<editor-fold desc="findByIdProjectDashboardStatsImpl">
module.exports.findByIdProjectDashboardStats = ({name, listName, details_fragment, onCreateQuery, isContract}) => {
	return findByIdProjectDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: details_fragment || getFragment(listName, isContract),
		mapResults,
		onCreateQuery,
	});
}
//</editor-fold>

//<editor-fold desc="findByIdSiteDashboardStatsImpl">
module.exports.findByIdSiteDashboardStats = ({name, listName, details_fragment, onCreateQuery, isContract}) => {
	return findByIdSiteDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: details_fragment || getFragment(listName, isContract),
		mapResults,
		onCreateQuery,
	});
}
//</editor-fold>

//<editor-fold desc="findByIdContractorDashboardStatsImpl">
module.exports.findByIdContractorDashboardStats = ({name, listName, details_fragment, onCreateQuery, isContract}) => {
	return findByIdContractorDashboardStatsImpl({
		name: `HR${name}`,
		details_fragment: details_fragment || getFragment(listName, isContract),
		mapResults,
		onCreateQuery,
	});
}
//</editor-fold>
