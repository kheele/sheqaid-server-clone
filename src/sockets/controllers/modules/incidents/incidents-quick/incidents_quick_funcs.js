//<editor-fold desc="mapExportRow">
exports.mapExportRow = (item, idx) => {
    let {
        id,
        data: {
            created_at,
            removed,
            //0
            company, client, project, site,
            //1
            short_desc,
            exact_location,
            latitude,
            longitude,
            category_list,
            nature_of_injury_list,
            bodily_injury_location_list,
            injury_mechanism_list,
            incident_date,
            incident_time,
            date_reported,
            time_reported,
            time_shift,
            severity,
            person_reporting,
            person_reporting_other,
            person_injured,
            person_injured_other,
            vehicle_make,
            vehicle_reg_num,
            driver,
            driver_other,
            driver_phone,
            driver_email,
        }
    } = item;

    client = client || company;

    return {
        idx: idx + 1,
        id,
        //0
        project: project && project.name,
        site: site && site.name,
        //1
        short_desc,
        exact_location,
        latitude: latitude || "",
        longitude: longitude || "",
        category_list: (category_list || []).filter(v => !!v).map(({category}) => category.name).join(', '),
        nature_of_injury_list: (nature_of_injury_list || []).filter(v => !!v).map(({injury}) => injury.name).join(', '),
        bodily_injury_location_list: (bodily_injury_location_list || []).filter(v => !!v).map(({injury}) => injury.name).join(', '),
        injury_mechanism_list: (injury_mechanism_list || []).filter(v => !!v).map(({injury}) => injury.name).join(', '),
        incident_date: Dates.formatDate(incident_date),
        incident_time,
        date_reported: Dates.formatDate(date_reported),
        time_reported,
        time_shift,
        severity,
        person_reporting: (person_reporting || person_reporting_other) && (person_reporting || person_reporting_other).full_name,
        person_injured: (person_injured || person_injured_other) && (person_injured || person_injured_other).full_name,
        vehicle_make,
        vehicle_reg_num,
        driver: (driver || driver_other) && (driver || driver_other).full_name,
        driver_phone,
        driver_email,

        status: removed ? "Inactive" : "Active",
    };
};
//</editor-fold>
