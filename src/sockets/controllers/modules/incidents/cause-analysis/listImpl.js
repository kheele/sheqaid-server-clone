const {orgs_fragment} = require("../../../../../graphql/Fragments");
const {
    incident_investigation_cause_analysis_immediate_fragment,
    incident_investigation_cause_analysis_root_fragment,
} = require('../investigations/commons');
const {
    getVariablesAndQueryConfig,
} = require('./commons');

//<editor-fold desc="listImpl">
module.exports = async (socket, data) => {
    // console.log('data', data)

    let {
        offset = 0,
        limit = 50,
        //
        removed = false,
        // status,
        //
        logged_employee_id,
        site_id, project_id, client_id,
        //
        exact_orgs = false,
        //
        client_filter,
        orgs_filter = [],
    } = data;

    const {filter} = getVariablesAndQueryConfig({
        orgs_filter,
        //
        // status,
        //
        logged_employee_id,
        site_id, project_id, client_id,
        //
        exact_orgs
    });

    return listGraphQL({
        query: `
			query listAllIncidentsByLoggedQuery {
                sheq_incident_investigation(
                  where: {
                    removed: {_eq: ${removed}},
                    ${filter},
                    _and:{
                      _or:[
	                      {investigation:{cause_analysis:{immediate_analysis:{cause_analysis_cause_list:{corrective_action_list:{id:{_is_null: false}}}}}},
	                      {investigation:{cause_analysis:{root_analysis:{cause_analysis_cause_list:{corrective_action_list:{id:{_is_null: false}}}}}}
                      ]
                    }
                  },
	                order_by: {incident_date: desc, incident_time: desc, group: asc, short_desc: asc},
                    offset: ${offset},
                    ${limit > 0 ? `limit: ${limit}` : ''}
                ) {
                    id
                    group
                    incident_date
                    short_desc
                    location
                    exact_location
                    #
                    category_list{
                        category{
                          id
                          name
                        }
                    }
                    sub_category_list{
                        sub_category{
                          id
                          name
                          category{
                            id
                            name
                          }
                        }
                    }
                    sector_list{
                        id
                        sector{
                          id
                          name
                        }
                    }
                    activity_list{
                        id
                        activity{
                          id
                          name
                          sector{
                            id
                            name
                          }
                        }
                    }   
                    investigation{
                      id
                      cause_analysis{
                        id
                        immediate_analysis{
                          ${incident_investigation_cause_analysis_immediate_fragment}
                        }
                        root_analysis{
                          ${incident_investigation_cause_analysis_root_fragment}
                        }
                      }
                    }
                    ${orgs_fragment}
                }
            }
		`,
        operationName: "listAllIncidentsByLoggedQuery",
    });
}
//</editor-fold>
