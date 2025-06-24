const {employee_personal_details_fragment} = require("../../../../graphql/Fragments");

//<editor-fold desc="where">
const where_expired = `
    doc_version_list: {expiry: {_lte: $today_date}},
    removed:{_eq: false},
`;

const where_month_expiry = `
    doc_version_list: {expiry: {_gt: $today_date, _lte: $mon_date}},
    removed:{_eq: false},
`;

const where_no_expiry = `
    doc_version_list: {expiry: {_is_null: true}},
    removed:{_eq: false},
`;
//</editor-fold>

//<editor-fold desc="simple_orgs_fragment">
const simple_orgs_fragment = `
    company{
        id
        name
    }
    client{
        id
        name
    }
    project{
        id
        name
    }
    site{
        id
        name
    }
`;
//</editor-fold>

//<editor-fold desc="fragment">
const fragment = `
  id
  title
  desc
  internal_or_external
  doc_type
  doc_version_list(order_by:{expiry: desc_nulls_last}){
      id
      expiry
      doc_num
      type
      doc
  }
  latest_version: doc_version_list(order_by:{expiry: desc_nulls_last}, limit: 1){
      id
      expiry
      doc_num
      type
      doc
  }
  category{
      id
      name
  }
  responsible_department{
      id
      name
  }
  responsible_person{
      ${employee_personal_details_fragment}
  }
  employee{
      id
      fname
      lname
      id_num
      passport_num
      email
      phone
  }
  ${simple_orgs_fragment}
`;
//</editor-fold>

//<editor-fold desc="lists_fragment">
const lists_fragment = `
  #list_project_plan
  list_project_plan_expired:document_list(
    where: {
        doc_type:{_eq: "Project Plan"},
        ${where_expired} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_project_plan_month_expiry:document_list(
    where: {
        doc_type:{_eq: "Project Plan"},
        ${where_month_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_project_plan_no_expiry:document_list(
    where: {
        doc_type:{_eq: "Project Plan"},
        ${where_no_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  #list_ims_policy
  list_ims_policy_expired:document_list(
    where: {
        doc_type:{_eq: "IMS Policy"},
        ${where_expired} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_ims_policy_month_expiry:document_list(
    where: {
        doc_type:{_eq: "IMS Policy"},
        ${where_month_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_ims_policy_no_expiry:document_list(
    where: {
        doc_type:{_eq: "IMS Policy"},
        ${where_no_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  #list_general_document
  list_general_document_expired:document_list(
    where: {
        doc_type:{_eq: "General Document"},
        ${where_expired} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_general_document_month_expiry:document_list(
    where: {
        doc_type:{_eq: "General Document"},
        ${where_month_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_general_document_no_expiry:document_list(
    where: {
        doc_type:{_eq: "General Document"},
        ${where_no_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
`;
//</editor-fold>

//<editor-fold desc="lists_project_plan_fragment">
const lists_project_plan_fragment = `
  #list_project_plan
  list_project_plan_expired:document_list(
    where: {
        doc_type:{_eq: "Project Plan"},
        ${where_expired} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_project_plan_month_expiry:document_list(
    where: {
        doc_type:{_eq: "Project Plan"},
        ${where_month_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_project_plan_no_expiry:document_list(
    where: {
        doc_type:{_eq: "Project Plan"},
        ${where_no_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
`;
//</editor-fold>

//<editor-fold desc="lists_ims_policy_fragment">
const lists_ims_policy_fragment = `
  #list_ims_policy
  list_ims_policy_expired:document_list(
    where: {
        doc_type:{_eq: "IMS Policy"},
        ${where_expired} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_ims_policy_month_expiry:document_list(
    where: {
        doc_type:{_eq: "IMS Policy"},
        ${where_month_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_ims_policy_no_expiry:document_list(
    where: {
        doc_type:{_eq: "IMS Policy"},
        ${where_no_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
`;
//</editor-fold>

//<editor-fold desc="lists_general_document_fragment">
const lists_general_document_fragment = `
  #list_general_document
  list_general_document_expired:document_list(
    where: {
        doc_type:{_eq: "General Document"},
        ${where_expired} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_general_document_month_expiry:document_list(
    where: {
        doc_type:{_eq: "General Document"},
        ${where_month_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
  list_general_document_no_expiry:document_list(
    where: {
        doc_type:{_eq: "General Document"},
        ${where_no_expiry} 
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
`;
//</editor-fold>

//<editor-fold desc="user_fragment">
const user_fragment = `
    id
    fname
    lname
    username
    notifications_settings{
        receive_expired_docs_notifs
    }
`;

//<editor-fold desc="user_company_fragment">
exports.user_company_fragment = `
    ${user_fragment}
    company{
        id
        name
        ${lists_project_plan_fragment}
    }
`;
//</editor-fold>

//<editor-fold desc="user_client_fragment">
exports.user_client_fragment = ` 
    ${user_fragment}
    client{
        id
        name
        ${lists_project_plan_fragment}
    }
`;
//</editor-fold>

//<editor-fold desc="user_project_fragment">
exports.user_project_fragment = ` 
    ${user_fragment}
    project{
        id
        name
        ${lists_project_plan_fragment}
    }
`;
//</editor-fold>

//<editor-fold desc="user_site_fragment">
exports.user_site_fragment = ` 
    ${user_fragment}
    site{
        id
        name
        ${lists_project_plan_fragment}
    }
`;
//</editor-fold>

//<editor-fold desc="employee_fragment">
// const employee_fragment = `
//     id
//     fname
//     lname
//     email
//     ${orgs_fragment}
// `;
//</editor-fold>
