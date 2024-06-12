require('./templates');

const findByIdImpl = require("./findByIdImpl");
const listImpl = require('./listImpl');
const findByIdDashboardImpl = require("./findByIdDashboardImpl");

eventManager.on("inspections/findById", findByIdImpl);

eventManager.on("inspections/listTodayByLogged", async (socket, data) => {
    const {asset_id} = data;

    data.client_filter = [`schedule_date: {_eq: "${Dates.formatDateSQL(new Date())}"}`];

    if(asset_id) {
        data.client_filter.push(`asset_id: {_eq: ${asset_id}}`);
    } else {
        data.client_filter.push(`asset_id: {_is_null: false}`);
    }

    data.client_filter = data.client_filter.join(',\n')

    return listImpl(socket, data);
});

eventManager.on("inspections/listUnansweredByLogged", async (socket, data) => {
    const {asset_id} = data;

    const unansweredFilter = (level = 3) => {
        return `
          question_list_aggregate: {
            count: {
              predicate: {_eq: 0}, 
              filter: {
                _and: [
                    {has_no_answer: {_eq: true}},
                    {options: {answer: {_is_null: true}}}
                ]
              }
            }
          } 
        `;
    };

    data.client_filter = [
        `schedule_date: {_lt: "${Dates.formatDateSQL(new Date())}"}`,
        `progress: {_eq: 0}`,
        // unansweredFilter(3)
    ];

    if(asset_id) {
        data.client_filter.push(`asset_id: {_eq: ${asset_id}}`);
    } else {
        data.client_filter.push(`asset_id: {_is_null: false}`);
    }

    data.client_filter = data.client_filter.join(',\n')

    return listImpl(socket, data);
});

eventManager.on("inspections/listUpcomingByLogged", async (socket, data) => {
    const {asset_id} = data;

    data.client_filter = [`schedule_date: {_gt: "${Dates.formatDateSQL(new Date())}"}`];

    if(asset_id) {
        data.client_filter.push(`asset_id: {_eq: ${asset_id}}`);
    } else {
        data.client_filter.push(`asset_id: {_is_null: false}`);
    }

    data.client_filter = data.client_filter.join(',\n')

    return listImpl(socket, data);
});

eventManager.on("inspections/listCompletedByLogged", async (socket, data) => {
    const {asset_id} = data;
    data.client_filter = [`status: {_eq: "CompleteAccepted"}`];

    if(asset_id) {
        data.client_filter.push(`asset_id: {_eq: ${asset_id}}`);
    } else {
        data.client_filter.push(`asset_id: {_is_null: false}`);
    }

    data.client_filter = data.client_filter.join(',\n')

    return listImpl(socket, data);
});

eventManager.on("inspections/listActiveByLogged", async (socket, data) => {
    const {asset_id} = data;

    const answeredFilter = (level = 3) => {
        return `
          question_list_aggregate: {
            count: {
              predicate: {_gt: 0}, 
              filter: {
                _or: [
                    {has_answer: {_eq: true}},
                    {options: {answer: {_is_null: false}}}
                ]
              }
            }
          } 
        `;
    };

    data.client_filter = [
        `status: {_neq: "CompleteAccepted"}`,
        `progress: {_gt: 0}`,
        // answeredFilter(3)
    ];

    if(asset_id) {
        data.client_filter.push(`,\nasset_id: {_eq: ${asset_id}}`);
    } else {
        data.client_filter.push(`,\nasset_id: {_is_null: false}`);
    }

    data.client_filter = data.client_filter.join(',\n')

    return listImpl(socket, data);
});

eventManager.on("inspections/dashboard", findByIdDashboardImpl);
