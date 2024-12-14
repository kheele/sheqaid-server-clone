//<editor-fold desc="orgs_fragment">
const {query: findByIdProxyContractorSite} = require("../../graphql/ProxyContractorSite/findByIdProxyContractorSite");
const orgs_fragment = `
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
    edges{
        node{
            id
            competency_list(where: {removed: {_eq: false}}){
            
            }
            contract_list(where: {removed: {_eq: false}}){
            
            }
            counselling_list(where: {removed: {_eq: false}}){
            
            }
            job_appointment_list(where: {removed: {_eq: false}}){
            
            }
            leave_list(where: {removed: {_eq: false}}){
            
            }
            license_list(where: {removed: {_eq: false}}){
            
            }
            medical_list(where: {removed: {_eq: false}}){
            
            }
            warning_list(where: {removed: {_eq: false}}){
            
            }
            work_permit_list(where: {removed: {_eq: false}}){
            
            }
            
            document_id_passport_list:document_list(where: {type: {_eq: "ID/Passport"}}){
                id
                created_at
                expiry_date
                type
                desc
                doc
            }
            document_prdp_list:document_list(where: {type: {_eq: "PrDP"}}){
                id
                created_at
                expiry_date
                type
                desc
                doc
            }
            
            supervisor{
                id
                fname
                lname
                email
                phone
                id_num
                passport_num
                profile_pic
                employment_num
            }
            department {
                id
                name
            }
            job_position {
                id
                name
            }
            ${orgs_fragment}
        }
    }
`;
//</editor-fold>

//<editor-fold desc="query">
const query = `
query getEmployeesProfileIncompleteQuery {
  list_no_dob:hr_employees_connection(where: {dob:{_is_null: true}}){
    ${fragment}
  }
  list_no_gender:hr_employees_connection(where: {sex:{_is_null: true}}){
    ${fragment}
  }
  list_no_phone:hr_employees_connection(where: {phone:{_is_null: true}}){
    ${fragment}
  }
  list_no_employment_num:hr_employees_connection(where: {employment_num:{_is_null: true}}){
    ${fragment}
  }
  list_no_employment_date:hr_employees_connection(where: {employment_date:{_is_null: true}}){
    ${fragment}
  }
  list_no_job_position:hr_employees_connection(where: {job_position_id:{_is_null: true}}){
    ${fragment}
  }
  list_no_department:hr_employees_connection(where: {department_id:{_is_null: true}}){
    ${fragment}
  }
}
`;
//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="onEmployeesExpiry">
exports.onEmployeesExpiry = async (data) => {
    await authorize();

    const item = await getRelayOne({query, operationName: "getEmployeesProfileIncompleteQuery"});
    if(!item) {
        // res.send();
        return;
    }

    const {
        list_no_dob,
        list_no_gender,
        list_no_phone,
        list_no_employment_num,
        list_no_employment_date,
        list_no_job_position,
        list_no_department,
    } = item;

    // if(list_no_dob) {
    //
    // }
};
// </editor-fold>

