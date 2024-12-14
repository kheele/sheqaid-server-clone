let {orgs_fragment} = require("../../../graphql/Fragments");
const getDetailsFragment = require("./getDetailsFragment");

//<editor-fold desc="listImpl">
module.exports = (config) => {
    return async (socket, data) => {
        let {
            name,
            tbl,
            details_fragment,
            orgs_fragment: orgs_fragment_override,
            where: __where,
            orgs_filter: orgs_filter_override,
            order_by,
            limit,
            skipRemoved = false,
            getVariablesAndQueryConfig,
        } = config;

        // console.log('data', data);

        let {
            id,
            id_list,
            excCompany,
        } = data || {};

        const __orgs_fragment = orgs_fragment_override === null ? '' : orgs_fragment_override || orgs_fragment;

        console.log('tbl------------', tbl, data)
        name = isFunction(name) ? name(data) : name;
        tbl = isFunction(tbl) ? tbl(data) : tbl;
        details_fragment = await getDetailsFragment({socket, data, details_fragment});

        if(order_by) {
            if(isFunction(order_by)) {
                order_by = order_by(data);
            }

            if(order_by && !order_by.trim().startsWith("order_by")) {
                order_by = `order_by: ${order_by}`;
            }
        }

        if (id) {
            return listGraphQL({
                query: `
                    query findById${name}ByLoggedQuery {
                      ${tbl}(
                        where: {
                          id: {_eq: ${id}}
                        }
                      ) {
                          ${details_fragment ? `${details_fragment},` : ''}
                          ${__orgs_fragment}
                      }
                    }
			`,
                operationName: `findById${name}ByLoggedQuery`,
            });
        } else if (id_list) {
            return listGraphQL({
                query: `
					query listByIds${name}ByLoggedQuery {
                        ${tbl}(
                          where: {
                            id: {_in: [${id_list.join(',')}]}
                          },
                          ${order_by ? `${order_by},` : ''}
                        ) {
                          ${details_fragment ? `${details_fragment},` : ''}
                          ${__orgs_fragment}
                        }
                    }
				`,
                operationName: `listByIds${name}ByLoggedQuery`,
            });
        } else {
            let {
                offset = 0,
                limit: _limit = 50,
                //
                removed = false,
                written_off = false,
                //
                logged_employee_id,
                site_id, project_id, client_id, company_id,
                //
                exact_orgs = false,
                excCompany,
                //
                client_filter,
                orgs_filter = [],
                //
                ...others
            } = data || {};

            limit = isNumber(limit) ? limit : _limit;

            let __orgs_filter;
            if(orgs_filter_override) {
                __orgs_filter = await orgs_filter_override(socket, data);
            } else if(orgs_filter && orgs_filter.isNotEmpty()) {
                __orgs_filter = orgs_filter;
            } else {
                __orgs_filter = socket.orgsFilter(data);
            }

            console.log('listByLoggedImpl', __orgs_filter)

            let remove_args;
            if(data) {
                if(!skipRemoved) {
                    if ('written_off' in data) {
                        remove_args = {key: 'written_off', value: written_off};
                    } else {
                        remove_args = {key: 'removed', value: removed};
                    }
                }
            }

            const filters = getVariablesAndQueryConfig ? getVariablesAndQueryConfig({
                orgs_filter: __orgs_filter,
                //
                ...others,
                //
                logged_employee_id,
                site_id, project_id, client_id, company_id,
                //
                exact_orgs
            }) : {filter: __orgs_filter.join(', ')};

            const {filter = ""} = filters;

            // const whereArgs = {filter, [remove_args.key]: remove_args.value, ...data, site_id, project_id, client_id, company_id};

            let where;
            if (__where) {
                if(remove_args) {
                    where = __where({data, filters, filter, [remove_args.key]: remove_args.value});
                } else {
                    where = __where({data, filters, filter});
                }
            } else {
                if(remove_args) {
                    where = `
                        ${remove_args.key}: {_eq: ${remove_args.value}},
                        ${filter}
                    `;
                } else {
                    where = `
                        ${filter}
                    `;
                }
            }

            console.log('where:', where)

            const query = `
                query listAll${name}Query {
                    ${tbl}(
                        where: {
                          ${where}
                        },
                        ${order_by ? `${order_by},` : ''}
                        offset: ${offset},
                        ${limit > 0 ? `limit: ${limit}` : ''}
                    ) {
                        ${details_fragment ? `${details_fragment},` : ''}
                        ${__orgs_fragment}
                    }
                }
			`;

            return listGraphQL({
                query,
                operationName: `listAll${name}Query`,
            }).catch(err => {
                console.error(err, query);
                throw err;
            });
        }
    };
}
//</editor-fold>
