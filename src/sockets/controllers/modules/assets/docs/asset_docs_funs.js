
//<editor-fold desc="mapExportRow">
exports.mapExportRow = (item, idx) => {
    let {
        id,
        data: {
            created_at,
            date,
            expiry,
            title,
            type,
            doc_version_list,
            //
            asset: {
                project,
                site,
                //
                doc_list,
                status,
                written_off,
                responsible_person,
                asset_detail: {
                    asset_type,
                    name,
                    manufacturer,
                    reg_num,
                    serial_num,
                }
            }
        }
    } = item;

    // client = client || company;

    return {
        idx: idx + 1,

        project: project && project.name,
        site: site && site.name,

        id,
        asset_type,
        name,
        manufacturer,
        responsible_person: responsible_person && responsible_person.full_name,
        reg_num,
        serial_num,
        date: Dates.formatDateSQL(date),
        expiry_date: Dates.formatDateSQL(expiry),
        // doc: doc && doc.dlUrls ? doc.dlUrls[0] : '',
        //
        title,
        type,

        status: written_off ? "Inactive" : "Active",
    };
};
//</editor-fold>

exports.where = ({data, filters}) => {
    const {
        view = 'Asset',
        written_off: removed = false,
    } = data;

    const {filter, filterAsset} = filters;

    if (view === 'Asset') {
        return `
                doc_list_aggregate: {
                    count: {
                      predicate: {_gt: 0},
                      filter: {removed: {_eq: ${removed}}${filter}}
                    }
                  }, 
                  doc_list: {removed: {_eq: ${removed}}${filter}}
                  ${filterAsset}
            `;
    }

    return `
            removed: {_eq: ${removed}},
                  ${filter},
                  ${filterAsset}
            `;
};