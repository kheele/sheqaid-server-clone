
//<editor-fold desc="getVariablesAndQueryConfig">
const {employee_basic_personal_details_fragment} = require("../../../../../graphql/Fragments");
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        id,
        //
        serial_num,
        purchase_date_range,
        condition,
        name,
        unit,
        ppe_type_id,

        team_id,
        department_id,
        job_position_id,
        employee_id,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = true,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    if(id) {
        filter.push(`id: {_eq: ${id}}`);
    } else {
        if (serial_num) {
            filter.push(`serial_num: {_eq: "${serial_num}"}`);
        }
        if (condition) {
            filter.push(`condition: {_eq: "${condition}"}`);
        }
        if (name) {
            filter.push(`ppe_type:{name: {_ilike: "%${name}%"}}`);
        }
        if (unit) {
            filter.push(`ppe_type:{unit: {_ilike: "%${unit}%"}}`);
        }
        if(purchase_date_range) {
            const {start, end} = purchase_date_range;
            if (start && end) {
                filter.push(`purchase_date: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}`);
            } else if (start) {
                filter.push(`purchase_date: {_gte: "${Dates.formatDateSQL(start)}"}`);
            } else if (end) {
                filter.push(`purchase_date: {_lte: "${Dates.formatDateSQL(end)}"}`);
            }
        }

        if (ppe_type_id) {
            filter.push(`ppe_type_id: {_eq: ${ppe_type_id}}`);
        }

        if (team_id) {
            filter.push(`ppe_type:{team_list: {team_id: {_eq: ${team_id}}}}`);
        }

        if (department_id) {
            filter.push(`ppe_type:{department_list: {department_id: {_eq: ${department_id}}}}`);
        }

        if (job_position_id) {
            filter.push(`ppe_type:{job_position_list: {job_position_id: {_eq: ${job_position_id}}}}`);
        }

        if (employee_id) {
            filter.push(`_and: {
                _or: [
                    {ppe_type:{team_list:{team:{employee_list: {id: {_eq: ${employee_id}}}}}}},
                    {ppe_type:{department_list:{department:{employee_list: {id: {_eq: ${employee_id}}}}}}},
                    {ppe_type:{job_position_list:{job_position:{employee_list: {id: {_eq: ${employee_id}}}}}}},
                ]
            }`);
        }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};
//</editor-fold>

//<editor-fold desc="ppe_item_one_details_fragment">
exports.ppe_item_one_details_fragment = `
    id
    removed
    created_at
    notes
    profile_pic
    serial_num
    purchase_date
    condition
    ppe_type{
        id
        name
        unit
        profile_pic
        duration_type
        duration_value
    }
    ppe_inventory{
        id
        quantity
        reorder_threshold
        location
        added_date
        last_updated
    }
    supplier{
        id
        name
        contact_person
        email
        phone
        address
    }
    
    employee_list{
        employee{
          ${employee_basic_personal_details_fragment}
        }
    }
    ppe_inspection_list{
        id
        inspection_date
        ppe_condition
        issues
        doc
        inspector{
  	        ${employee_basic_personal_details_fragment}
        }
    }
    ppe_return_list{
        id
        return_date
        ppe_condition
        returner_signature
        receiver_signature
        doc
        employee{
            ${employee_basic_personal_details_fragment}
        }
    }

    employee_list_aggregate{
        aggregate {
            count
        }
    }
    ppe_inspection_list_aggregate{
        aggregate {
            count
        }
    }
    ppe_return_list_aggregate{
        aggregate {
            count
        }
    }
`;
//</editor-fold>

//<editor-fold desc="ppe_item_details_fragment">
exports.ppe_item_details_fragment = `
    id
    removed
    created_at
    notes
    profile_pic
    serial_num
    purchase_date
    condition
    ppe_type{
        id
        name
        unit
        profile_pic
        duration_type
        duration_value
    }
    ppe_inventory{
        id
        quantity
        reorder_threshold
        location
        added_date
        last_updated
    }
    supplier{
        id
        name
        contact_person
        email
        phone
        address
    }
    
    employee_list_aggregate{
        aggregate {
            count
        }
    }
    ppe_inspection_list_aggregate{
        aggregate {
            count
        }
    }
    ppe_return_list_aggregate{
        aggregate {
            count
        }
    }
`;
//</editor-fold>
