//<editor-fold desc="getFragment">
exports.getHRDocsDashboardFragment = (listName, isContract) => {
	if(listName === "leave_list") {
		return `
			id
	    
			#${listName}
			list_removed_aggregate:${listName}_aggregate(where: {removed: {_eq: true}}){
				aggregate{
					count
				}
			}
			list_no_expiry_aggregate:${listName}_aggregate(where: {
				removed: {_eq: false},
				expiry_date: {_is_null: true}
			}){
				aggregate{
					count
				}
			}
			list_expired_aggregate:${listName}_aggregate(where: {
				removed: {_eq: false},
				expiry_date: {_lte: "now()"}
			}){
				aggregate{
					count
				}
			}
			list_awaiting_approval_aggregate:${listName}_aggregate(where: {
				removed: {_eq: false},
				status: {_eq: "Awaiting Approval"}
			}){
				aggregate{
					count
				}
			}
			list_approved_aggregate:${listName}_aggregate(where: {
				removed: {_eq: false},
				status: {_eq: "Approved"}
			}){
				aggregate{
					count
				}
			}
			list_rejected_aggregate:${listName}_aggregate(where: {
				removed: {_eq: false},
				status: {_eq: "Rejected"}
			}){
				aggregate{
					count
				}
			}
			
			list_type_unclassified_aggregate:${listName}_aggregate(where: {
				removed: {_eq: false},
				type: {_is_null: true}
			}){
				aggregate{
					count
				}
			}
			list_type_sick_aggregate:${listName}_aggregate(where: {
				removed: {_eq: false},
				type: {_eq: "Sick"}
			}){
				aggregate{
					count
				}
			}
			list_type_annual_aggregate:${listName}_aggregate(where: {
				removed: {_eq: false},
				type: {_eq: "Annual"}
			}){
				aggregate{
					count
				}
			}
			list_type_unpaid_aggregate:${listName}_aggregate(where: {
				removed: {_eq: false},
				type: {_eq: "Unpaid"}
			}){
				aggregate{
					count
				}
			}
			list_type_maternity_aggregate:${listName}_aggregate(where: {
				removed: {_eq: false},
				type: {_eq: "Maternity"}
			}){
				aggregate{
					count
				}
			}
			list_type_family_responsibility_aggregate:${listName}_aggregate(where: {
				removed: {_eq: false},
				type: {_eq: "Family Responsibility"}
			}){
				aggregate{
					count
				}
			}
			
			#
			list_type_sick_days_taken_aggregate:${listName}_aggregate(where: {
				removed: {_eq: false},
				status: {_eq: "Approved"},
				type: {_eq: "Sick"},
				expiry_date: {_lte: "now()"},
			}){
				aggregate{
					count
				}
			}
			list_type_sick_days_remaining_aggregate:${listName}_aggregate(where: {
				removed: {_eq: false},
				type: {_eq: "Sick"}
			}){
				aggregate{
					count
				}
			}
		`;
	}

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
