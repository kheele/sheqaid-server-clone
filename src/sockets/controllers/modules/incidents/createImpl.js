const findByIdImpl = require("./findByIdImpl");

//<editor-fold desc="createImpl">
module.exports = async (socket, input) => {
    const {
        //0
        site,
        project,
        client,
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
        //4
        sub_category_list,
        //5
        sector_list,
        activity_list,
        //6.1
        person_involved_list,
        //6.2
        person_reporting,
        person_reporting_other,
        //6.3
        person_reported_to,
        person_reported_to_other,
        //6.4
        witness_list,
        //6.5
        distribution_list,

        //7.1
        person_injured,//
        person_injured_other,//
        injured_person_dob,//
        injured_person_gender,//
        nature_of_injury_list,
        bodily_injury_location_list,
        injury_mechanism_list,
        injury_desc,
        //7.2
        test_undertaken,//
        test_type_list,
        test_type_drug_undertaken,
        test_type_alcohol_undertaken,
        test_type_mobile_device_undertaken,
        //7.3
        is_vehicle_incident,
        is_infringement_issued,
        did_police_attend_scene,
        collision_reported_to_police_station,
        have_charges_been_laid,
        driver,
        driver_dob,
        driver_gender,
        address,
        email,
        phone,
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
        //7.4
        consequence,
        likelihood,
        risk_rating,
    } = input;

    console.log('create incident:', input);

    const processPersonOther = (person_other) => {
        if (person_other && person_other.data) {
            const {data, data:{job_position}} = person_other;
            if(job_position) {
                data.job_position_id = job_position.id;
                delete data.job_position;
            }
            socket.injectCreate(person_other.data);
        }
    };

    //6
    if (person_involved_list) {
        person_involved_list.data.forEach(({person_involved_other}) => {
            processPersonOther(person_involved_other);
        });
    }
    if (witness_list) {
        witness_list.data.forEach(({witness_other}) => {
            processPersonOther(witness_other);
        });
    }
    if (distribution_list) {
        distribution_list.data.forEach(({other_person}) => {
            processPersonOther(other_person);
        });
    }

    processPersonOther(person_reported_to_other);
    processPersonOther(person_reporting_other);
    processPersonOther(person_injured_other);

    const res = await insertGraphQL({
        mutation: `
			mutation insertIncidentMutation($object: sheq_incident_investigation_insert_input!) {
                insert_sheq_incident_investigation_one(
                    object: $object
                ) {
                    id
                }
            }
		`,
        input,
        operationName: "insertIncidentMutation",
    });

    if (res) {
        return findByIdImpl(socket, res.id);
    }
}
//</editor-fold>
