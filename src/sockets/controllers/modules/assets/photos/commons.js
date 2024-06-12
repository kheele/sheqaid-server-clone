
//<editor-fold desc="getVariablesAndQueryConfig">
exports.getVariablesAndQueryConfig = (
    {
        orgs_filter = [],
        //
        view,
        mon, mon2, mon3,
        expiry_date = 'ALL',
        date_range,
        date,
        //
        type,
        title,
        asset_id,
        responsible_person_list,
        //
        reg_num,
        serial_num,
        manufacturer,
        location,
        asset_type,
        condition,
        status,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = false,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filterAsset = orgs_filter || [];//orgsFilter({socket, site_id, project_id, client_id, exact_orgs});

    if(reg_num) {
        filterAsset.push(`asset_detail:{reg_num: {_eq: "${reg_num}"}}`);
    }
    if(serial_num) {
        filterAsset.push(`asset_detail:{serial_num: {_eq: "${serial_num}"}}`);
    }
    if(manufacturer) {
        filterAsset.push(`asset_detail:{manufacturer: {_ilike: "%${manufacturer}%"}}`);
    }
    if(location) {
        filterAsset.push(`asset_detail:{location: {_ilike: "%${location}%"}}`);
    }
    if(asset_type) {
        filterAsset.push(`asset_detail:{asset_type: {_eq: "${asset_type}"}}`);
    }
    if(condition) {
        filterAsset.push(`asset_detail:{condition: {_eq: "${condition}"}}`);
    }
    if(status) {
        filterAsset.push(`status: {_eq: "${status}"}`);
    }

    if (view === "Asset") {
        if (asset_id) {
            filterAsset.push(`id: {_eq: ${asset_id}}`);
        }
        filterAsset = `,${filterAsset.join(',')}`;
    } else {
        if (asset_id) {
            filterAsset.push(`asset_id: {_eq: ${asset_id}}`);
            filterAsset = `,${filterAsset.join(',')}`;
        } else {
            filterAsset = `,asset: {${filterAsset.join(',')}}`;
        }
    }

    let filter = [];

    if (date_range) {
        const {start, end} = date_range;
        filter.push(`expiry: {_gte: "${Dates.formatDateSQL(start)}", _lte: "${Dates.formatDateSQL(end)}"}`);
    } else {
        if (expiry_date === null) {//expiry_no
            filter.push(`expiry: {_is_null: true}`);
        } else if (expiry_date === -1) {//expired
            filter.push(`expiry: {_lte: "now()"}`);
        } else if (expiry_date === 1) {//expired_1mon
            filter.push(`expiry: {_gt: "now()", _lte: "${mon}"}`);
        } else if (expiry_date === 2) {//expired_2mon
            filter.push(`expiry: {_gt: "${mon}", _lte: "${mon2}"}`);
        } else if (expiry_date === 3) {//expired_3mon
            filter.push(`expiry: {_gt: "${mon2}", _lte: "${mon3}"}`);
        } else if (expiry_date === 4) {//expired_4mon
            filter.push(`expiry: {_gt: "${mon3}"}`);
        }
    }

    if (date) {
        filter.push(`date: {_eq: "${date}"}`);
    }
    if (type) {
        filter.push(`type: {_eq: "${type}"}`);
    }
    if (title) {
        filter.push(`title: {_ilike: "%${title}%"}`);
    }

    filter = `,${filter.join(',')}`;
    //</editor-fold>

    return {filter, filterAsset};
};
//</editor-fold>
