//<editor-fold desc="getFragment">
exports.getHRDocsDashboardFragment = (listName, isContract) => {
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

exports.hrDocsDashboardMapResults = hrDocsDashboardMapResults = id => {
	return res => res && res.data;
};
