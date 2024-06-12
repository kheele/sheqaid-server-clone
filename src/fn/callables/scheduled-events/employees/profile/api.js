const {send: send__users} = require("./send__users");
const {send: send__employees} = require("./send__employees");

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
    fname
    lname
    dob
    sex
    id_num
    passport_num
    phone
    email
    employment_num
    employment_date
    job_position{
        id
        name
    }
    department{
        id
        name
    }
    ${simple_orgs_fragment}
`;
//</editor-fold>

//<editor-fold desc="lists_fragment">
const lists_fragment = `
  list:employee_list(
    where: {
      _or:[
        {dob: {_is_null: true}},
        {sex: {_is_null: true}},
        {phone: {_is_null: true}},
        {employment_date: {_is_null: true}},
        {job_position_id: {_is_null: true}},
        {department_id: {_is_null: true}},
        {client_id: {_is_null: true}},
        {project_id: {_is_null: true}},
        {site_id: {_is_null: true}},
      ],
      removed:{_eq: false},
    },
    order_by: {company: {name: asc}, client: {name: asc}, project: {name: asc}, site: {name: asc}}
  ){
    ${fragment}
  }
`;
//</editor-fold>

//<editor-fold desc="orgs_fragment">
const orgs_fragment = `
    company{
        id
        name
        ${lists_fragment}
    }
    client{
        id
        name
        ${lists_fragment}
    }
    project{
        id
        name
        ${lists_fragment}
    }
    site{
        id
        name
        ${lists_fragment}
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
        receive_employees_profile_notifs
    }
    ${orgs_fragment}
`;
//</editor-fold>

//<editor-fold desc="employee_fragment">
const employee_fragment = `
    id
    fname
    lname
    email
    ${orgs_fragment}
`;
//</editor-fold>

//<editor-fold desc="query">
const query = `
query getEmployeesProfileIncompleteQuery($today_date: date, $mon_date: date) {
  user_list:default_users_connection(
      where: {
          removed: {_eq: false}, 
          notifications_settings: {receive_employees_profile_notifs: {_eq: true}},
          _or:[
            {
              site: {
                employee_list: {
                  _or:[
                    {dob: {_is_null: true}},
                    {sex: {_is_null: true}},
                    {phone: {_is_null: true}},
                    {employment_date: {_is_null: true}},
                    {job_position_id: {_is_null: true}},
                    {department_id: {_is_null: true}},
                  ],
                  removed:{_eq: false},
                }
              },
            },
            {
              project: {
                employee_list: {
                  _or:[
                    {dob: {_is_null: true}},
                    {sex: {_is_null: true}},
                    {phone: {_is_null: true}},
                    {employment_date: {_is_null: true}},
                    {job_position_id: {_is_null: true}},
                    {department_id: {_is_null: true}},
                    {site_id: {_is_null: true}},
                  ],
                  removed:{_eq: false},
                }
              },
            },
            {
              client: {
                employee_list: {
                  _or:[
                    {dob: {_is_null: true}},
                    {sex: {_is_null: true}},
                    {phone: {_is_null: true}},
                    {employment_date: {_is_null: true}},
                    {job_position_id: {_is_null: true}},
                    {department_id: {_is_null: true}},
                    {project_id: {_is_null: true}},
                    {site_id: {_is_null: true}},
                  ],
                  removed:{_eq: false},
                }
              },
            },
            {
              company: {
                employee_list: {
                  _or:[
                    {dob: {_is_null: true}},
                    {sex: {_is_null: true}},
                    {phone: {_is_null: true}},
                    {employment_date: {_is_null: true}},
                    {job_position_id: {_is_null: true}},
                    {department_id: {_is_null: true}},
                    {client_id: {_is_null: true}},
                    {project_id: {_is_null: true}},
                    {site_id: {_is_null: true}},
                  ],
                  removed:{_eq: false},
                }
              }
            }
          ],
     }
  ){
    edges{
      node{
        ${user_fragment}
      }
    }
  }
}
`;
//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="onEmployeesProfileIncomplete">
exports.onEmployeesProfileIncomplete = async (data) => {
    // await authorize();
    //
    const item = await getRelayOne({
        query,
        operationName: "getEmployeesProfileIncompleteQuery",
        multi_queries: true,
    });
    if (!item) {
        // res.send();
        return;
    }

    console.log("getEmployeesProfileIncompleteQuery", item);

    const {
        user_list = [],
        employee_list =[],
    } = item;

    if(!user_list.isEmpty()) {
        await send__users(user_list);
    }

    if(!employee_list.isEmpty()) {
        await send__employees(employee_list);
    }

};
// </editor-fold>
