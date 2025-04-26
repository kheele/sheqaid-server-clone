//<editor-fold desc="mapExportRow">
exports.mapExportRow = (item, idx) => {
    let {
        id,
        data: {
            created_at,
            //0
            company, client, project, site,
            //1
            group,
            short_desc,
            desc,
            location,
            exact_location,
            document_list,
            //2
            incident_date,
            incident_time,
            date_reported,
            time_reported,
            time_shift,
            //3
            category_list,
            sub_category_list,
            //4
            sector_list,
            activity_list,
            //5.1
            person_involved_list,
            //5.2
            person_reporting,
            person_reporting_other,
            //5.3
            person_reported_to,
            person_reported_to_other,
            //5.4
            witness_list,
            //5.5
            distribution_list,
            //6
            is_vehicle_incident,
            vehicle_list,
            //7
            is_person_injured,
            person_injured,
            person_injured_other,
            injured_person_dob,
            injured_person_gender,
            nature_of_injury_list,
            bodily_injury_location_list,
            injury_mechanism_list,
            injury_desc,
            //8
            test_undertaken,
            test_type_list,
            test_type_drug_undertaken,
            test_type_alcohol_undertaken,
            test_type_mobile_device_undertaken,
            //9
            consequence,
            likelihood,
            risk_rating,
//
            investigation,
            severity,
        }
    } = item;

    const {
        is_infringement_issued,
        did_police_attend_scene,
        collision_reported_to_police_station,
        have_charges_been_laid,
        driver,
        driver_other,
        driver_dob,
        driver_gender,
        driver_address,
        driver_email,
        driver_phone,
        licence_num,
        licence_expiry,
        licence_years,
        vehicle_make,
        vehicle_model,
        vehicle_year,
        vehicle_color,
        vehicle_reg_num,
        vehicle_fleet_num,
        vehicle_reg_date,
        vehicle_trip_type,
        vehicle_load_type,
        was_3rd_party_involved,
        are_3rd_party_details_available,
        third_party_fname,
        third_party_lname,
        third_party_address,
        third_party_email,
        third_party_phone,
        did_driver_admit_liability,
        did_someone_else_admit_liability,
        someone_else_admit_liability_name,
        liability_admitted_to_name,
        third_party_opinion,
        third_party_document_list,
        penalty_num,
        issuing_authority,
        issuing_officer,
        type_of_breach,
        addressee_issued_to_name,
        addressee_name_or_entity,
        addressee_amount,
        addressee_due_date,
        ref_or_report_num,
        officer_name,
        officer_station,
        nature_of_charges,
        who_laid_charges,
        who_were_nature_charges_laid_against,
    } = vehicle_list || [];

    const {
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
        severity: severity2,//{consequence, likelihood}
        consequence: consequence2,
        likelihood: likelihood2,
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
    } = investigation || {};

    severity = severity2 || severity;
    consequence = consequence2 || consequence;
    likelihood = likelihood2 || likelihood;

    return {
        id,

        project: project && project.name,
        site: site && site.name,

        group,
        short_desc,
        desc,
        location,
        exact_location,
        // document_list: (document_list || []).filter(({doc}) => doc && doc.dlUrls && doc.dlUrls[0]).filter(v => !!v).map(({doc}) => doc.dlUrls[0]).join(', '),
        incident_date:Dates.formatDateSQL(incident_date),
        incident_time,
        date_reported:Dates.formatDateSQL(date_reported),
        time_reported,
        time_shift,
        category_list: (category_list || []).filter(v => !!v).map(({category}) => category.name).join(', '),
        sub_category_list: (sub_category_list || []).filter(v => !!v).map(({sub_category}) => sub_category.name).join(', '),
        sector_list: (sector_list || []).filter(v => !!v).map(({sector}) => sector.name).join(', '),
        activity_list: (activity_list || []).filter(v => !!v).map(({activity}) => activity.name).join(', '),
        person_involved_list: (person_involved_list || []).filter(v => !!v).map(({person_involved, person_involved_other}) => (person_involved || person_involved_other).full_name).join(', '),
        person_reporting: (person_reporting || person_reporting_other) && (person_reporting || person_reporting_other).full_name,
        person_reported_to: (person_reported_to || person_reported_to_other) && (person_reported_to || person_reported_to_other).full_name ,
        witness_list: (witness_list || []).filter(v => !!v).map(({witness, witness_other}) => (witness || witness_other).full_name).join(', '),
        distribution_list: (distribution_list || []).filter(v => !!v).map(({employee, other_person}) => (employee || other_person).full_name).join(', '),
        person_injured: (person_injured || person_injured_other) && (person_injured || person_injured_other).full_name,
        injured_person_dob:Dates.formatDateSQL(injured_person_dob),
        injured_person_gender,
        nature_of_injury_list: (nature_of_injury_list || []).filter(v => !!v).map(({injury}) => injury.name).join(', '),
        bodily_injury_location_list: (bodily_injury_location_list || []).filter(v => !!v).map(({injury}) => injury.name).join(', '),
        injury_mechanism_list: (injury_mechanism_list || []).filter(v => !!v).map(({injury}) => injury.name).join(', '),
        injury_desc,
        test_undertaken,
        test_type_list: (test_type_list || []).filter(v => !!v).map(({name}) => name).join(', '),
        test_type_drug_undertaken,
        test_type_alcohol_undertaken,
        test_type_mobile_device_undertaken,
        //
        vehicle_make,
        vehicle_model,
        vehicle_year,
        vehicle_color,
        vehicle_reg_num,
        vehicle_fleet_num,
        vehicle_reg_date:Dates.formatDateSQL(vehicle_reg_date),
        vehicle_trip_type,
        vehicle_load_type,
        was_3rd_party_involved,
        are_3rd_party_details_available,
        third_party_fname,
        third_party_lname,
        third_party_address,
        third_party_email,
        third_party_phone,
        did_driver_admit_liability,
        did_someone_else_admit_liability,
        someone_else_admit_liability_name,
        liability_admitted_to_name,
        third_party_opinion,
        // third_party_document_list: (third_party_document_list || []).filter(({doc}) => doc && doc.dlUrls && doc.dlUrls[0]).filter(v => !!v).map(({doc}) => doc.dlUrls[0]).join(', '),
        penalty_num,
        issuing_authority,
        issuing_officer,
        type_of_breach,
        addressee_issued_to_name,
        addressee_name_or_entity,
        addressee_amount,
        addressee_due_date:Dates.formatDateSQL(addressee_due_date),
        ref_or_report_num,
        officer_name,
        officer_station,
        nature_of_charges,
        who_laid_charges : who_laid_charges && who_laid_charges.full_name,
        who_were_nature_charges_laid_against: who_were_nature_charges_laid_against && who_were_nature_charges_laid_against.full_name,
        consequence,
        likelihood,
        risk_rating,
        is_vehicle_incident,
        is_infringement_issued,
        did_police_attend_scene,
        collision_reported_to_police_station,
        have_charges_been_laid,
        driver: (driver || driver_other) && (driver || driver_other).full_name,
        driver_dob:Dates.formatDateSQL(driver_dob),
        driver_gender,
        driver_address,
        driver_email,
        driver_phone,
        licence_num,
        licence_expiry,
        licence_years,
    };
};
//</editor-fold>
