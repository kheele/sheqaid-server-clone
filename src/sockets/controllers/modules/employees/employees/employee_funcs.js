//<editor-fold desc="mapExportRow">
exports.mapExportRow = (item, idx) => {
    let {
        id,
        data: {
            company, client, project, site,
            //
            profile_pic,
            fname,
            lname,
            id_num,
            passport_num,
            dob,
            sex,
            phone,
            email,

            job_position,
            department,
            supervisor,
            team,

            employment_num,
            employment_date,

            removed,
        }
    } = item;

    return {
        idx: idx + 1,
        //
        project: project && project.name,
        site: site && site.name,

        id,

        job_category: job_position && job_position.job_category && job_position.job_category.name,
        job_position: job_position && job_position.name,
        department: department && department.name,
        supervisor: supervisor && supervisor.full_name,
        team: team && team.name,

        fname,
        lname,
        id_num,
        passport_num,
        dob: Dates.formatDateSQL(dob),
        sex,
        phone,
        email,

        employment_num,
        employment_date: Dates.formatDateSQL(employment_date),

        status: removed ? "Inactive" : "Active",
    };
};
//</editor-fold>
