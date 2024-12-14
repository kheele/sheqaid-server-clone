//<editor-fold desc="findByIdEmployeeDashboardStats">
exports.findByIdEmployeeDashboardStats = (config) => {
    return async (socket, data) => {
        if (!data) return;

        const {
            name,
            listName,
            isContract,
            type,
            onCreateQuery,
            mapResults,
        } = config;

        const operationName = `findByIdEmployeeHR${name}DashboardStatsQuery`;

        const {
            id,
            mon,
            mon2,
            mon3,
            //
            // site_id, project_id, client_id, company_id,
        } = data;

        // console.log('socket.decodedIdToken', socket.request.session.decodedIdToken)

        let promise;
        if (onCreateQuery) {
            promise = onCreateQuery(data, operationName);
        } else {
            promise = getGraphQLOne({
                variables: {id, mon, mon2, mon3},
                query: `
	      query ${operationName}($id: bigint, $mon: date, $mon2: date, $mon3: date) {
	        hr_employees(where: {id: {_eq: $id}}) {
            id
            
            #${listName}
            list_active_aggregate:${listName}_aggregate(where: {removed: {_eq: false}${type ? `, type: {_eq: "${type}"}` : ''}}){
                aggregate{
                    count
                }
            }
            list_removed_aggregate:${listName}_aggregate(where: {removed: {_eq: true}${type ? `, type: {_eq: "${type}"}` : ''}}){
                aggregate{
                    count
                }
            }
            list_no_expiry_aggregate:${listName}_aggregate(where: {
                removed: {_eq: false},
	              ${isContract ? 'contract_details: {' : ''}expiry_date: {_is_null: true}${isContract ? '}' : ''}
	              ${type ? `, type: {_eq: "${type}"}` : ''}
            }){
                aggregate{
                    count
                }
            }
            list_expired_aggregate:${listName}_aggregate(where: {
                removed: {_eq: false},
	              ${isContract ? 'contract_details: {' : ''}expiry_date: {_lte: "now()"}${isContract ? '}' : ''}
	              ${type ? `, type: {_eq: "${type}"}` : ''}
            }){
                aggregate{
                    count
                }
            }
            list_mon_expiry_aggregate:${listName}_aggregate(where: {
                removed: {_eq: false},
                ${isContract ? 'contract_details: {' : ''}expiry_date: {_gt: "now()", _lte: $mon}${isContract ? '}' : ''}
	              ${type ? `, type: {_eq: "${type}"}` : ''}
            }){
                aggregate{
                    count
                }
            }
            list_2mon_expiry_aggregate:${listName}_aggregate(where: {
                removed: {_eq: false},
                ${isContract ? 'contract_details: {' : ''}expiry_date: {_gt: $mon, _lte: $mon2}${isContract ? '}' : ''}
	              ${type ? `, type: {_eq: "${type}"}` : ''}
            }){
                aggregate{
                    count
                }
            }
            list_3mon_expiry_aggregate:${listName}_aggregate(where: {
                removed: {_eq: false},
                ${isContract ? 'contract_details: {' : ''}expiry_date: {_gt: $mon2, _lte: $mon3}${isContract ? '}' : ''}
	              ${type ? `, type: {_eq: "${type}"}` : ''}
            }){
                aggregate{
                    count
                }
            }
            list_4mon_expiry_aggregate:${listName}_aggregate(where: {
                removed: {_eq: false},
                ${isContract ? 'contract_details: {' : ''}expiry_date: {_gt: $mon3}${isContract ? '}' : ''}
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
        }

        if (mapResults) {
            promise = promise.then(mapResults(id));
        }

        return promise;
    };
};
//</editor-fold>
