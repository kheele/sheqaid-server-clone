const {user_project_fragment, user_site_fragment, user_client_fragment, user_company_fragment} = require("./api_fragments");

//<editor-fold desc="query">
// const query = `
// query getDocumentsExpiryQuery($today_date: date, $mon_date: date) {
//   user_list:default_users_connection(
//       where: {
//           removed: {_eq: false},
//           notifications_settings: {receive_expired_docs_notifs: {_eq: true}},
//           _or:[
//             {
//               site: {
//                 document_list: {
//                   doc_version_list: {
//                     _or:[
//                       {expiry: {_is_null: true}},
//                       {expiry: {_lte: $mon_date}}
//                     ]
//                   },
//                   removed:{_eq: false},
//                 }
//               },
//             },
//             {
//               project: {
//                 document_list: {
//                   doc_version_list: {
//                     _or:[
//                       {expiry: {_is_null: true}},
//                       {expiry: {_lte: $mon_date}}
//                     ]
//                   },
//                   removed:{_eq: false},
//                 }
//               },
//             },
//             {
//               client: {
//                 document_list: {
//                   doc_version_list: {
//                     _or:[
//                       {expiry: {_is_null: true}},
//                       {expiry: {_lte: $mon_date}}
//                     ]
//                   },
//                   removed:{_eq: false},
//                 }
//               },
//             },
//             {
//               company: {
//                 document_list: {
//                   doc_version_list: {
//                     _or:[
//                       {expiry: {_is_null: true}},
//                       {expiry: {_lte: $mon_date}}
//                     ]
//                   },
//                   removed:{_eq: false},
//                 }
//               }
//             }
//           ],
//      }
//   ){
//     edges{
//       node{
//         ${user_fragment}
//       }
//     }
//   }
// }
// `;
//</editor-fold>

//<editor-fold desc="query_company">
exports.query_company = `
query getCompanyDocumentsExpiryQuery($today_date: date, $mon_date: date) {
  user_list:default_users_connection(
      where: {
          removed: {_eq: false}, 
          notifications_settings: {receive_expired_docs_notifs: {_eq: true}},
          company: {
                document_list: {
                  doc_version_list: {
                    _or:[
                      {expiry: {_is_null: true}},
                      {expiry: {_lte: $mon_date}}
                    ]
                  },
                  removed:{_eq: false},
                }
              },
     }
  ){
    edges{
      node{
        ${user_company_fragment}
      }
    }
  }
}
`;
//</editor-fold>

//<editor-fold desc="query_client">
exports.query_client = `
query getClientDocumentsExpiryQuery($today_date: date, $mon_date: date) {
  user_list:default_users_connection(
      where: {
          removed: {_eq: false}, 
          notifications_settings: {receive_expired_docs_notifs: {_eq: true}},
          client: {
                document_list: {
                  doc_version_list: {
                    _or:[
                      {expiry: {_is_null: true}},
                      {expiry: {_lte: $mon_date}}
                    ]
                  },
                  removed:{_eq: false},
                }
              }
     }
  ){
    edges{
      node{
        ${user_client_fragment}
      }
    }
  }
}
`;
//</editor-fold>

//<editor-fold desc="query_project">
exports.query_project = `
query getProjectDocumentsExpiryQuery($today_date: date, $mon_date: date) {
  user_list:default_users_connection(
      where: {
          removed: {_eq: false}, 
          notifications_settings: {receive_expired_docs_notifs: {_eq: true}},
          project: {
                document_list: {
                  doc_version_list: {
                    _or:[
                      {expiry: {_is_null: true}},
                      {expiry: {_lte: $mon_date}}
                    ]
                  },
                  removed:{_eq: false},
                }
              }
     }
  ){
    edges{
      node{
        ${user_project_fragment}
      }
    }
  }
}
`;
//</editor-fold>

//<editor-fold desc="query_site">
exports.query_site = `
query getSiteDocumentsExpiryQuery($today_date: date, $mon_date: date) {
  user_list:default_users_connection(
      where: {
          removed: {_eq: false}, 
          notifications_settings: {receive_expired_docs_notifs: {_eq: true}},
          site: {
                document_list: {
                  doc_version_list: {
                    _or:[
                      {expiry: {_is_null: true}},
                      {expiry: {_lte: $mon_date}}
                    ]
                  },
                  removed:{_eq: false},
                }
              }
     }
  ){
    edges{
      node{
        ${user_site_fragment}
      }
    }
  }
}
`;
//</editor-fold>
