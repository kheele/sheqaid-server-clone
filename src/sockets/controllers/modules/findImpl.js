let {orgs_fragment} = require("../../../graphql/Fragments");
const getDetailsFragment = require("./getDetailsFragment");

//<editor-fold desc="findImpl">
module.exports = (config) => {
    return async (socket, data) => {
        let {
            name,
            tbl,
            details_fragment,
            orgs_fragment: orgs_fragment_override,
            where: __where,
            skipRemoved = false,
            getVariablesAndQueryConfig,
        } = config;

        // console.log('data', data);

        let {
            offset = 0,
            limit = 50,
            //
            removed = false,
            written_off = false,
            //
            id,
            id_list,
            //
            logged_employee_id,
            site_id, project_id, client_id, company_id,
            //
            exact_orgs = false,
            //
            client_filter,
            orgs_filter = [],
            //
            ...others
        } = data || {};

        let remove_args;
        if (data) {
            if (!skipRemoved) {
                if ('written_off' in data) {
                    remove_args = {key: 'written_off', value: written_off};
                } else {
                    remove_args = {key: 'removed', value: removed};
                }
            }
        }

        // const {filter = ""} = getVariablesAndQueryConfig ? getVariablesAndQueryConfig({
        const filters = getVariablesAndQueryConfig ? getVariablesAndQueryConfig({
            orgs_filter,
            //
            id,
            //
            ...others,
            //
            logged_employee_id,
            site_id, project_id, client_id, company_id,
            //
            exact_orgs
        }) : {};

        const {filter = ""} = filters;

        // const whereArgs = {filter, [remove_args.key]: remove_args.value, ...data, site_id, project_id, client_id, company_id};

        let where;
        if (__where) {
            if (remove_args) {
                where = __where({data, filters, filter, [remove_args.key]: remove_args.value});
            } else {
                where = __where({data, filters, filter});
            }
        } else {
            if (remove_args) {
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

        const __orgs_fragment = orgs_fragment_override === null ? '' : orgs_fragment_override || orgs_fragment;
        details_fragment = await getDetailsFragment({socket, data, details_fragment});

        const query = `
	        query find${name}ByLoggedQuery {
	          ${tbl}(
	            where: {
	              ${where}
	            },
		        limit: 1,
	          ) {
                    ${details_fragment}
	                ${__orgs_fragment}
	          }
	        }
		`;

        return listGraphQL({
            query,
            operationName: `find${name}ByLoggedQuery`,
        }).then(res => res && res[0]).catch(err => {
            console.error(`find${name}ByLoggedQuery`, err, query);
            throw err;
        });
    };
}
//</editor-fold>
