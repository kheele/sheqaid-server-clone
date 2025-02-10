const {employee_personal_details_fragment} = require("../../../../../graphql/Fragments");

//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        id,
        //
        name,
        type,
        target,
        supervisor_id,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    if (id) {
        filter.push(`id: {_eq: ${id}}`);
    } else {
        if (target) {
            filter.push(`target: {_eq: ${target}}`);
        }
        if (type) {
            filter.push(`type: {_eq: ${type}}`);
        }
        if (name) {
            if (filter.anyMatch(v => v.trim().startsWith('_or'))) {
                filter.push(`_and: {
                  _or: [
                    {client: {name: {_ilike: "%${name}%"}}}, 
                    {project: {name: {_ilike: "%${name}%"}}}, 
                    {site: {name: {_ilike: "%${name}%"}}}
                  ]
                }`);
            } else {
                filter.push(`_or: [
                  {client: {name: {_ilike: "%${name}%"}}}, 
                  {project: {name: {_ilike: "%${name}%"}}}, 
                  {site: {name: {_ilike: "%${name}%"}}}
                ]`);
            }
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="organogram_details_fragment">
exports.organogram_details_fragment = `
    id
    created_at
    target
    type
    doc
    removed
    employee_list {
    	id
    	employee{
    		${employee_personal_details_fragment}
    	}
    	employee_reported_to{
    		${employee_personal_details_fragment}
    	}
    	team{
    		id
    		name
    		status
    		supervisor{
    			${employee_personal_details_fragment}
    		}
    		employee_list{
    			${employee_personal_details_fragment}
    		}
    	}
    	employee_list{
    		id
    		employee{
			    ${employee_personal_details_fragment}
		    }
    	}
    }
`;
//</editor-fold>
