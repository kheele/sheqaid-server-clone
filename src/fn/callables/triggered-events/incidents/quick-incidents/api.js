// <editor-fold defaultstate="collapsed" desc="sendNewQuickIncidentNotification">
exports.sendNewQuickIncidentNotification = async (body) => {
    const data = getTriggeredEventsData(body, "sheq_incident_investigation_quick");
    if (!data) {
        return;
    }

    const {new_item} = data;
    const {
        id,
    } = new_item;

    const injury_fragment = `
        injury{
          id
          name
        }
    `;

    const doc_fragment = `
        id
        doc
        type
    `;

    const person_fragment = `
        id
        full_name
        email
        phone
    `;

    const item = await getRelayOne({
        query: `
            query findByIdQuery($id: bigint) {
                sheq_incident_investigation_quick_connection(
                    where: {id: {_eq: $id}}
                ) {
                  edges {
                    node {
                        id
                        removed
                        logged_user{
                            id
                            auth_id
                            username
                        }
                        logged_employee{
                            id
                            auth_id
                            email
                        }
                        company{
                            id
                            name
                            user_list(where: {
                                removed: {_eq: false},
                                notifications_settings: {receive_incident_management_notifs: {_eq: true}},
                                client_id: {_is_null: true},
                                project_id: {_is_null: true},
                                site_id: {_is_null: true}
                            }){
                                id
                                full_name
                                username
                                phone
                            }
                        }
                        client{
                            id
                            name
                            user_list(where: {
                                removed: {_eq: false},
                                notifications_settings: {receive_incident_management_notifs: {_eq: true}},
                                project_id: {_is_null: true},
                                site_id: {_is_null: true}
                            }){
                                id
                                full_name
                                username
                                phone
                            }
                        }
                        project{
                            id
                            name
                            user_list(where: {
                                removed: {_eq: false},
                                notifications_settings: {receive_incident_management_notifs: {_eq: true}},
                                site_id: {_is_null: true}
                            }){
                                id
                                full_name
                                username
                                phone
                            }
                        }
                        site{
                            id
                            name
                            user_list(where: {
                                removed: {_eq: false},
                                notifications_settings: {receive_incident_management_notifs: {_eq: true}},
                            }){
                                id
                                full_name
                                username
                                phone
                            }
                        }
                        person_injured{
                            ${person_fragment}
                        }
                        person_injured_other{
                            ${person_fragment}
                        }
                        person_reporting{
                            ${person_fragment}
                        }
                        person_reporting_other{
                            ${person_fragment}
                        }
                        incident_date
                        incident_time
                        date_reported
                        time_reported
                        time_shift
                        is_vehicle_incident
                        short_desc
                        severity
                        exact_location
                        latitude
                        longitude
                        driver{
                            ${person_fragment}
                        }
                        driver_other{
                            ${person_fragment}
                        }
                        driver_email
                        driver_phone
                        vehicle_make
                        vehicle_reg_num
                        category_list{
                            category{
                              id
                              name
                            }
                        }
                        nature_of_injury_list:injury_list(where:{injury:{type:{_eq:"Nature"}}}){
                            ${injury_fragment}
                        }
                        bodily_injury_location_list:injury_list(where:{injury:{type:{_eq:"Bodily Parts"}}}){
                            ${injury_fragment}
                        }
                        injury_mechanism_list:injury_list(where:{injury:{type:{_eq:"Direct Cause"}}}){
                            ${injury_fragment}
                        }
                        image_list:doc_list(where:{type:{_eq:"Image"}}){
                            ${doc_fragment}
                        }
                        video_list:doc_list(where:{type:{_eq:"Video"}}){
                            ${doc_fragment}
                        }
                    }
                  }
                }
            }
        `,
        operationName: 'findByIdQuery',
        variables: {id: id},
    });
    if (!item) {
        return;
    }
//7Qk6ipL0kgj0ThgYqOMQ, GypCgmbrT13AZgfx8peG, XvEGdxUp0GAaLpcduNro (message),
    const {
        removed,
        logged_user,
        logged_employee,
        //
        company,
        client,
        project,
        site,
        //
        person_injured,
        person_injured_other,
        person_reporting,
        person_reporting_other,
        //
        incident_date,
        incident_time,
        date_reported,
        time_reported,
        time_shift,
        //
        is_vehicle_incident,
        short_desc,
        severity,
        exact_location,
        latitude,
        longitude,
        //
        driver,
        driver_other,
        driver_email,
        driver_phone,
        vehicle_make,
        vehicle_reg_num,
        //
        category_list,
        //
        nature_of_injury_list,
        bodily_injury_location_list,
        injury_mechanism_list,
        //
        image_list,
        video_list,
    } = item.data;

    const emails = [];
    if(logged_user) {
        emails.push(logged_user.username);
    }
    if(logged_employee) {
        emails.push(logged_employee.email);
    }
    if(driver_email) {
        emails.push(driver_email);
    }

    if(site && site.user_list) {
        emails.push(...site.user_list.map(v => v.username));
    }
    if(project && project.user_list) {
        emails.push(...project.user_list.map(v => v.username));
    }
    if(client && client.user_list) {
        emails.push(...client.user_list.map(v => v.username));
    }
    if(company && company.user_list) {
        emails.push(...company.user_list.map(v => v.username));
    }

    let location = "";
    if (client) {
        location = client.name;
    } else {
        location = company.name;
    }
    if (project) {
        location += " > " + project.name;
    }
    if (site) {
        location += " > " + site.name;
    }
    if (location.isEmpty()) {
        location = "N/A";
    }

    let imageSection = [];
    (image_list || []).forEach(v => {
        imageSection.push(`<img width="100%" src="${v.doc.dlUrls[0]}"/>`);
    });
    let videoSection =  [];
    (video_list || []).forEach(v => {
        videoSection.push(`<video width="100%" src="${v.doc.dlUrls[0]}"/>`);
    });

    const createTR = (title, value, w = "240px") => {
        return `<tr style="background: #eee">
            <td style="width: ${w || "240px"}; padding: 10px; text-align: right;">
                ${title}
            </td>
            <td>
                <b>${value || 'N/A'}</b>
            </td>
        </tr>`;
    };

    const vehicleSection = is_vehicle_incident ? `
        <table style="width: 100%; display: block;">
            <tbody>
                ${createTR("Vehicle Make", vehicle_make, "160px")}
                ${createTR("Vehicle Registration ", vehicle_reg_num, "160px")}
                ${createTR("Driver", (driver || driver_other) && (driver || driver_other).full_name, "160px")}
                ${createTR("Driver Phone No.", driver_phone || ((driver || driver_other) && (driver || driver_other).phone), "160px")}
                ${createTR("Driver Email Address", driver_email || ((driver || driver_other) && (driver || driver_other).email), "160px")}
            </tbody>
        </table>
    ` : null;

    EmailUtils.send({
        from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
//      to: emails.join(','),
        bcc: emails.distinct().join(','),
        subject: 'SHEQ Aid Notifications (Incident Recorded)',
        html: `
            <p>This is an automated email from SHEQ Aid.<br />Please do not reply to this email.</p>
            <p>The following incident has been reported:</p>
            <table style="width: 100%; display: block;">
                <tbody>
                    ${createTR("Location (Company/Project/Site)", location)}
                    ${createTR("ID", id)}
                    ${createTR("Short Description", short_desc)}
                    ${createTR("Exact Location", exact_location)}
                    
                    ${createTR("Location Reported", `latitude: ${latitude || 'N/A'}, longitude: ${longitude || 'N/A'}`)}
                    ${createTR("Incident Category", !category_list.isEmpty() && category_list.map(v => v.category.name).join(','))}
            
                    ${createTR("Nature Of Injury", !nature_of_injury_list.isEmpty() && nature_of_injury_list.map(v => v.injury.name).join(','))}
                    ${createTR("Bodily Injury Location", !bodily_injury_location_list.isEmpty() && bodily_injury_location_list.map(v => v.injury.name).join(','))}
                    ${createTR("Injury Mechanism", !injury_mechanism_list.isEmpty() && injury_mechanism_list.map(v => v.injury.name).join(','))}
                    
                    ${createTR("Images", imageSection.isNotEmpty() && imageSection)}
                    ${createTR("Videos", videoSection.isNotEmpty() && videoSection)}
            
                    ${createTR("Date Of Incident", Dates.formatDate(incident_date))}
                    ${createTR("Time Of Incident", incident_time)}
                    ${createTR("Date Reported", Dates.formatDate(date_reported))}
                    ${createTR("Time Reported", time_reported)}
                    ${createTR("Time Shift", time_shift)}
                    ${createTR("Incident Severity", severity)}
                    
                    ${createTR("Reported By", (person_reporting || person_reporting_other) ? (person_reporting || person_reporting_other).full_name : null)}
                    ${createTR("Person Injured", (person_injured || person_injured_other) ? (person_injured || person_injured_other).full_name : null)}
                    
                    <tr style="background: #eee">
                        <td style="width: 240px; padding: 10px;; text-align: right;">
                            Vehicle Details
                        </td>
                        <td>
                            ${vehicleSection || 'N/A'}
                        </td>
                    </tr>               
                </tbody>
            </table>
            
            <p>If you didn't request this, you can ignore this email or let us know.</p>
            <p>Kind Regards<br/>SHEQ Aid</p>
        `
    });

    if(logged_user) return logged_user.auth_id;
    if(logged_employee) return logged_employee.auth_id;
};
// </editor-fold>
