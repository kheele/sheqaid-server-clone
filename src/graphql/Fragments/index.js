
//<editor-fold desc="orgs_fragment">
const orgs_fragment = `
    company {
        id
        name
    }
    client {
        id
        name
    }
    project {
        id
        name
    }
    site {
        id
        name
    }
`;
exports.orgs_fragment = orgs_fragment;
//</editor-fold>

//<editor-fold desc="orgs_contractor_fragment">
const orgs_contractor_fragment = `
    company {
        id
        name
    }
    contractor {
        id
        name
    }
    client {
        id
        name
    }
    site {
        id
        name
    }
`;
exports.orgs_contractor_fragment = orgs_contractor_fragment;
//</editor-fold>

//<editor-fold desc="orgs_no_site_fragment">
const orgs_no_site_fragment = `
    company {
        id
        name
    }
    client {
        id
        name
    }
    project {
        id
        name
    }
`;
exports.orgs_no_site_fragment = orgs_no_site_fragment;
//</editor-fold>

//<editor-fold desc="orgs_no_project_and_site_fragment">
const orgs_no_project_and_site_fragment = `
    company {
        id
        name
    }
    client {
        id
        name
    }
`;
exports.orgs_no_project_and_site_fragment = orgs_no_project_and_site_fragment;
//</editor-fold>

//<editor-fold desc="orgs_id_fragment">
const orgs_id_fragment = `
    company_id
    client_id
    project_id
    site_id
`;
exports.orgs_id_fragment = orgs_id_fragment;
//</editor-fold>

//<editor-fold desc="employee_personal_details_fragment">
const employee_personal_details_fragment = `
    id
    created_at
    profile_pic
    fname
    lname
    full_name
    dob
    sex
    phone
    email
    id_num
    passport_num
    employment_num
    employment_date
    removed
    job_position{
      id
      name
      job_category{
        id
        name
      }
    }
    department{
      id
      name
    }
    team{
      id
      name
    }
    linked_user_id
    linked_user{
      id
      auth_id
      created_at
      profile_pic
      fname
      lname
      full_name
      phone
      username
    }
`;
exports.employee_personal_details_fragment = employee_personal_details_fragment;
//</editor-fold>

//<editor-fold desc="employee_basic_personal_details_fragment">
const employee_basic_personal_details_fragment = `
    id
    profile_pic
    fname
    lname
    full_name
    phone
    email
    id_num
    passport_num
    employment_num
    removed
    job_position{
      id
      name
      job_category{
        id
        name
      }
    }
    department{
      id
      name
    }
`;
exports.employee_basic_personal_details_fragment = employee_basic_personal_details_fragment;
//</editor-fold>

//<editor-fold desc="personal_details_other_fragment">
const personal_details_other_fragment = `
    id
    created_at
    fname
    lname
    full_name
    id_num
    passport_num
    email
    phone
    job_position{
      id
      name
      job_category{
        id
        name
      }
    }
`;
exports.personal_details_other_fragment = personal_details_other_fragment;
//</editor-fold>

//<editor-fold desc="user_personal_details_fragment">
const user_personal_details_fragment = `
    id
    auth_id
    created_at
    profile_pic
    fname
    lname
    full_name
    phone
    username
    
    linked_employee_id
    linked_employee {
      ${employee_personal_details_fragment}
    }
`;
exports.user_personal_details_fragment = user_personal_details_fragment;
//</editor-fold>

//<editor-fold desc="asset_basic_details_fragment">
const asset_basic_details_fragment = `
    id
    created_at
    written_off
    
    #computeds
    status
    monitoring_measurement_type
    monitoring_measurement_unit
    maintenance_plan_cost
    maintenance_last_completed_date
    calibration_last_completed_date

    profile_pic:photo_list(where: {removed: {_eq: false}, is_default: {_eq: true}}){
        id
        doc    
        is_default
        removed
    }
    photo_list(where: {removed: {_eq: false}}){
        id
        doc    
        is_default
        removed
    }
    responsible_person{
        id
        fname
        lname
        full_name
        email
        phone
        job_position{
            id
            name
            job_category{
              id
              name
            }
        }
    }
    asset_detail{
        owning_company
        name
        asset_type
        desc
        manufacturer
        model
        reg_num
        serial_num
        location
        toolkit
        condition
        barcode
        qr_code
        notes
    }
`;
exports.asset_basic_details_fragment = asset_basic_details_fragment;
//</editor-fold>
