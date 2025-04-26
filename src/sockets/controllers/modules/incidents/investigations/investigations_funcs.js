//<editor-fold desc="mapExportRow">
exports.mapExportRow = (item, idx) => {
    let {
        id,
        data: {
            created_at,
            //0
            company, client, project, site,
            investigation: {
                //1

                //2
                investigation_team_list,//
                due_date,//
                //3
                investigation_details,//
                investigation_findings_list,//
                investigation_findings_further_desc,//
                // document_list,//
                //4
                severity,//{consequence, likelihood}
                consequence,
                likelihood,
                //5
                cause_analysis,//
                //7
                // distribution_list,//
                //8
                weather_condition_list,//
                //9
                protective_equipment_worn_list,//
                //10
                class_list,//
                //11
                environment_list,//
                //12
                estimated_costs_damages,//
                estimated_costs_medical,//
                estimated_costs_salaries_wages,//
                estimated_costs_investigations,//
                estimated_costs_others,//
            },
            //1
            group,
            incident_date,
            short_desc,
            location,
            exact_location,
            //
            category_list,
            sub_category_list,
            sector_list,
            activity_list,
            //
        }
    } = item;

    client = client || company;

    return {
        idx: idx + 1,
        id,

        project: project && project.name,
        site: site && site.name,

        //Incident
        incident_date: Dates.formatDateSQL(incident_date),
        short_desc,
        location,
        exact_location,
        //
        due_date: Dates.formatDateSQL(due_date),
        investigation_details,
        // investigation_findings_list: (investigation_findings_list || []).filter(v => !!v).map(({text}) => text).join(', '),
        investigation_findings_further_desc,
        // document_list: (document_list || []).filter(v => !!v).map(({text}) => text).join(', '),
        consequence,
        likelihood,
        risk_rating: severity && severity.risk_rating || "",
        weather_condition_list: (weather_condition_list || []).filter(v => !!v).map(({text}) => text).join(', '),
        protective_equipment_worn_list: (protective_equipment_worn_list || []).filter(v => !!v).map(({text}) => text).join(', '),
        class_list: (class_list || []).filter(v => !!v).map(({text}) => text).join(', '),
        environment_list: (environment_list || []).filter(v => !!v).map(({text}) => text).join(', '),
        estimated_costs_damages: estimated_costs_damages && estimated_costs_damages.replace('$','R'),
        estimated_costs_medical: estimated_costs_medical && estimated_costs_medical.replace('$','R'),
        estimated_costs_salaries_wages: estimated_costs_salaries_wages && estimated_costs_salaries_wages.replace('$','R'),
        estimated_costs_investigations: estimated_costs_investigations && estimated_costs_investigations.replace('$','R'),
        estimated_costs_others: estimated_costs_others && estimated_costs_others.replace('$','R'),
    };
};
//</editor-fold>
