//<editor-fold desc="mapExportRow">
exports.mapExportRow = (item, idx) => {
    let {
        id,
        data: {
            created_at, status/*In Storage | Checked Out | Loaned Out | Out For Repair*/, statusVal,
            company, client, project, site,
            //
            written_off,
            //1 done
            asset_detail: {
                owning_company,
                name,
                asset_type,
                desc,
                manufacturer,
                model,
                reg_num,
                serial_num,
                location,
                toolkit,
                condition,
                barcode,
                qr_code,
                notes,
            },
            //2 done
            photo_list,
            profile_pic: profile_pic_list,
            //3 done
            responsible_person,
            // //4 done
            // doc_list,
            // //5 done
            // purchase_info,
            // //6 done
            // depreciation,
            // //7 done
            monitoring_plan_list,
            // //8 done
            maintenance_plan_list,
            // //9 done
            calibration_record_list,
            // //10
            // inspection_template_list = [],
            // inspection_list = [],
        }
    } = item;

    client = client || company;

    //8 done
    const {
        // id,
        next_service_hrs_or_km,
        plan_list,
    } = maintenance_plan_list || {};

    //9 done
    const {
        // id,
        next_calibration_interval,
        next_calibration_date,
        calibration_list,
    } = calibration_record_list || {};

    return {
        idx: idx + 1,
        //
        project: project && project.name,
        site: site && site.name,

        id,
        asset_type,
        name,
        manufacturer,
        model,
        responsible_person: responsible_person && responsible_person.full_name,
        next_calibration_interval,
        next_calibration_date: Dates.formatDateSQL(next_calibration_date),
        next_service_hrs_or_km,
        owning_company,
        reg_num,
        serial_num,
        location,
        toolkit,
        condition,

        status: written_off ? "Inactive" : "Active",
    };
};
//</editor-fold>
