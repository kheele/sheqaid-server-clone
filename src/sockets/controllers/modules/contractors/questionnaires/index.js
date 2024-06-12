
const findByIdImpl = require("./findByIdImpl");
const listImpl = require('./listImpl');

eventManager.on("contractors/questionnaires/findById", findByIdImpl);

eventManager.on("contractors/questionnaires/listUnansweredByLogged", async (socket, data) => {
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
        `progress: {_eq: 0}`,
        // unansweredFilter(3)
    ];

    data.client_filter = data.client_filter.join(',\n')

    return listImpl(socket, data);
});

eventManager.on("contractors/questionnaires/listCompletedByLogged", async (socket, data) => {
    data.client_filter = [`status: {_eq: "CompleteAccepted"}`];

    data.client_filter = data.client_filter.join(',\n')

    return listImpl(socket, data);
});

eventManager.on("contractors/questionnaires/listActiveByLogged", async (socket, data) => {
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
        // `progress: {_gt: 0}`,
        // answeredFilter(3)
    ];

    data.client_filter = data.client_filter.join(',\n')

    return listImpl(socket, data);
});
