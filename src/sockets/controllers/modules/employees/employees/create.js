const {v4: uuidv4} = require('uuid');
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const {employee_details_fragment} = require("./commons");

const args = {
    name: "Employee",
    tbl: "hr_employees",
    details_fragment: employee_details_fragment,
    uploadUpdate: ({id}) => ({
        new_name: `employees/${id}/profile-pic`,
        key: 'profile_pic',
    }),
};

//<editor-fold desc="createEmployee">
exports.createEmployee = async (socket, input) => {
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        formData,
        optionalInfoFormData,
        documentsFormData,
        dependantsAndNextOfKinFormData,

    } = input;

    const {
        // profile_pic,
        fname, lname, id_num, passport_num, dob, sex,
        email, phone,
        // receive_expired_docs_notifs,
        client,
        project,
        site,
    } = formData;

    const data = {
        // profile_pic: profile_pic && {path: await toDataURI(profile_pic.path)},
        //
        fname,
        lname,
        id_num: id_num && String(id_num),
        passport_num,
        dob: Dates.formatDateSQL(dob),
        sex,
        email: email && email.toLowerCase(),
        phone: phone && String(phone),

        // competency_list: [{data: []}],
        // contract_list: [{data: []}],
        // counselling_list: [{data: []}],
        // leave_list: [{data: []}],
        // license_list: [{data: []}],
        // medical_list: [{data: []}],
        // warning_list: [{data: []}],
        // work_permit_list: [{data: []}],

        // compliance_list: {
        //     data: (compliance_requirements || []).map(v => {
        //         if (v.status === "Comformance") {
        //             v.status = "C";
        //         } else if (v.status === "Non-Comformance") {
        //             v.status = "NCR";
        //         }
        //         return v;
        //     })
        // },

        // team_id,

        client_id: !isContractor ? (client && client.id) : null,
        project_id: !isContractor ? (project && project.id) : null,
        site_id: !isContractor ? (site && site.id) : null,

        contractor_client_id: isContractor ? (client && client.id) : null,
        contractor_site_id: isContractor ? (site && site.id) : null,
        // contractor_user_id: contractor_user && contractor_user.id,
    };

    // if(receive_expired_docs_notifs) {
    //     data.receive_expired_docs_notifs = receive_expired_docs_notifs;
    // } else {
    //     data.receive_expired_docs_notifs = false;
    // }

    console.log(optionalInfoFormData, documentsFormData, dependantsAndNextOfKinFormData)
    const optionalInfoFormDataProcessed = processOptionalInfoFormData(optionalInfoFormData);
    if (optionalInfoFormDataProcessed) {
        Object.keys(optionalInfoFormDataProcessed).forEach(key => {
            data[key] = optionalInfoFormDataProcessed[key];
        });
    }

    const documentsFormDataProcessed = processDocumentsFormData(documentsFormData);
    if (documentsFormDataProcessed) {
        Object.keys(documentsFormDataProcessed).forEach(key => {
            data[key] = documentsFormDataProcessed[key];
        });
    }

    const dependantsAndNextOfKinFormDataProcessed = processDependantsAndNextOfKinFormData(dependantsAndNextOfKinFormData);
    if (dependantsAndNextOfKinFormDataProcessed) {
        Object.keys(dependantsAndNextOfKinFormDataProcessed).forEach(key => {
            data[key] = dependantsAndNextOfKinFormDataProcessed[key];
        });
    }

    // const compliance_requirements = toNoneNullObject(specificComplianceRequirementsSection.form.data);
    // if (compliance_requirements) {
    //     data.compliance_requirements = compliance_requirements.list;
    // }

    ////////////////

    let existingUser = await checkByUsernameStaff(email);
    if (existingUser) {
        return "EMAIL_DUP";
    }
    existingUser = await checkByPhoneStaff(phone);
    if (existingUser) {
        return "PHONE_DUP";
    }

    if (email) {
        data.auth_id = await getStaffUidByUsername(email.toLowerCase());
    }
    if (phone && !data.auth_id) {
        data.auth_id = await getStaffUidByUsername(phone);
    }

    if (data.auth_id) {
        const linkedUser = await checkByAuthIdUser(data.auth_id);
        data.linked_user_id = linkedUser && linkedUser.id;
    }

    const create = createImpl(args);
    const savedItem = await create(socket, data);
    if (savedItem) {
        const {id} = savedItem;

        if (data.linked_user_id) {
            const _updateUser = updateImpl({
                name: "User",
                tbl: "default_users",
                details_fragment: `
                    id
                `,
            });

            await _updateUser(socket, {
                id: data.linked_user_id,
                linked_employee_id: id,
            });
        }

        // const {
        //     living_address_list,
        //     banking_detail_list,
        // } = savedItem.data;
        //
        // const resMain = await execWhen(async () => {
        //     if (!living_address_list && !banking_detail_list) {
        //         return true;
        //     }
        //
        //     {
        //         const ids = living_address_list.filter(({doc}) => !!doc && !doc.dlUrls).map(({id}) => id);
        //         if (ids.isEmpty()) {
        //             return true;
        //         }
        //         const resItems = await execWhen(async () => {
        //             const resCount = await listByIds(socket, ids);
        //             return resCount === 0;
        //         });
        //     }
        //
        //     {
        //         const ids = banking_detail_list.filter(({doc}) => !!doc && !doc.dlUrls).map(({id}) => id);
        //         if (ids.isEmpty()) {
        //             return true;
        //         }
        //         const resItems = await execWhen(() => {
        //             return listByIds(socket, ids);
        //         });
        //     }
        //
        // });

        // if (profile_pic || living_address_list_doc || banking_detail_list_doc || document_list_doc) {
        // return new Promise((resolve, reject) => {
        //     findByIdEmployee(socket, id).then(resolve, reject);//TODO: remove after socket on server send response
        //
        //     workers.on('insertEmployee', (data) => {
        //         console.log('insertEmployee got', data);
        //
        //         findByIdEmployee(socket, id).then(resolve, reject);
        //     });
        // });

        // const updateAttrs = {};
        // const updoad = async ({key, doc, name}) => {
        // 	const path = `employees/${id}/docs`;
        // 	const gcsUri = await workers.emit("files/upload", {
        // 		file: doc,
        // 		path,
        // 		name,
        // 	});
        // 	console.log("gcsUri", gcsUri);
        // 	if (key) {
        // 		updateAttrs[key] = gcsUri;
        // 	} else {
        // 		return gcsUri;
        // 	}
        // };
        //
        // const promises = [];
        // if (profile_pic) {
        // 	const name = `profile_pic-${Dates.formatTimestamp(new Date())}`;
        // 	promises.push(updoad({
        // 		key: "profile_pic",
        // 		doc: profile_pic,
        // 		name,
        // 	}));
        // }
        // if (living_address_list_doc) {
        // 	promises.push(Promise.all(living_address_list.data.map(async (v, n) => {
        // 		const name = `living_address-${n}-${Dates.formatTimestamp(new Date())}`;
        // 		const gcsUri = await updoad({
        // 			doc: v.doc,
        // 			name,
        // 		});
        // 		v.doc = gcsUri;
        // 		return insertEmployeeDocLivingAddress({...v, employee_id: id});
        // 	})));
        // }
        // if (banking_detail_list_doc) {
        // 	promises.push(Promise.all(banking_detail_list.data.map(async (v, n) => {
        // 		const name = `banking_detail-${n}-${Dates.formatTimestamp(new Date())}`;
        // 		const gcsUri = await updoad({
        // 			doc: v.doc,
        // 			name,
        // 		});
        // 		v.doc = gcsUri;
        // 		return insertEmployeeDocBankingDetail({...v, employee_id: id});
        // 	})));
        // }
        // if (document_list_doc) {
        // 	promises.push(Promise.all(document_list.data.map(async (v, n) => {
        // 		const name = `document-${n}-${Dates.formatTimestamp(new Date())}`;
        // 		const gcsUri = await updoad({
        // 			doc: v.doc,
        // 			name,
        // 		});
        // 		v.doc = gcsUri;
        // 		return insertEmployeeDocDocument({...v, employee_id: id});
        // 	})));
        // }
        //
        // await Promise.all(promises);
        //
        // 	return updateEmployee({id, ...updateAttrs});
        // }

        // return findByIdEmployee(id);
    }

    return savedItem;
};
//</editor-fold>

const processOptionalInfoFormData = (data) => {
    let {
        //
        employment_date,
        employment_num,
        department,
        job_position,
        //
        supervisor,
        supervisor_phone,
        supervisor_email,
        //
        living_address_list,
        //
        banking_detail_list,
    } = data;

    return {
        //
        employment_date: Dates.formatDateSQL(employment_date),
        employment_num,
        job_position_id: job_position && job_position.id,
        department_id: department && department.id,
        //
        supervisor_id: supervisor && supervisor.id,

        living_address_list: {
            data: (living_address_list || []).map((
                {
                    country,
                    zone,
                    city,
                    local_address,
                    street_address,
                    doc
                }
            ) => ({
                is_default: true,
                //1
                country_id: country.id,
                zone_id: zone.id,
                city_id: city.id,
                local_address,
                street_address,
                //2
                doc,
            }))
        },
        banking_detail_list: {
            data: (banking_detail_list || []).map(({name, branch, code, account_num, doc}) => ({
                is_default: true,
                //1
                name,
                branch,
                code,
                account_num,
                //2
                doc,
            }))
        },
    }
};

const processDocumentsFormData = (data) => {
    let {
        'document_list__ID/Passport': document_list__id_or_passport,
        'document_list__PrDP': document_list__prdp,

        competency_list,
        contract_list,
        counselling_list,
        license_list,
        medical_list,
        warning_list,
        work_permit_list,
        job_appointment_list,
    } = data;
    //

    return {
        document_list: {
            data: [
                ...(document_list__id_or_passport || []),
                ...(document_list__prdp || []),
            ].map((
                {
                    type,
                    expiry_date,
                    doc,
                }
            ) => ({
                is_default: true,
                //1
                type,
                expiry_date: Dates.formatDateSQL(expiry_date),
                //2
                doc,
            })),
        },
        competency_list: {
            data: (competency_list || []).map((
                {
                    issued_date,
                    expiry_date,
                    type,
                    competency_type,
                    accreditation_num,
                    training,
                    doc
                }
            ) => ({
                issued_date: Dates.formatDateSQL(issued_date),
                expiry_date: Dates.formatDateSQL(expiry_date),
                type,
                competency_type,
                accreditation_num,
                training_id: training && training.id,
                doc,
            }))
        },
        contract_list: {
            data: (contract_list || []).map((
                {
                    contractDetailsTab,
                    salaryInfoTab,
                    doc,
                    job_profile_doc,
                }
            ) => {
                const contract_details = toNoneNullObject(contractDetailsTab.form.data);
                const salary_info = toNoneNullObject(salaryInfoTab.form.data);

                const v = {
                    doc,
                    job_profile_doc,
                };

                if (contract_details) {
                    const {
                        contract_type,
                        start_date,
                        expiry_date,
                        end_of_trial_period,
                        start_time,
                        end_time,
                        daily_working_hours,
                        notes,
                    } = contractDetailsTab.form.data;
                    v.contract_details_list = {
                        data: [{
                            contract_type,
                            start_date: Dates.formatTimestampSQL(start_date),
                            expiry_date: Dates.formatTimestampSQL(expiry_date),
                            end_of_trial_period: Dates.formatTimestampSQL(end_of_trial_period),
                            start_time,
                            end_time,
                            daily_working_hours,
                            notes,
                        }],
                    };
                }

                if (salary_info) {
                    const {
                        payment_type,
                        salary_interval,
                        salary,
                        wage,
                        deductible,//[{text, value}]
                    } = salaryInfoTab.form.data;

                    const deductible_list = deductible ? deductible.list.filter(v => !!v && !!v.text && !!v.value) : [];
                    v.salary_info_list = {
                        data: [{
                            payment_type,
                            salary_interval,
                            salary,
                            wage,
                            deductible_list: {data: deductible_list},//[{text, value}]
                        }],
                    };
                }

                return v;
            })
        },
        counselling_list: {
            data: (counselling_list || []).map((
                {
                    doc,
                    responsible_person,
                    corrective_actions,
                    counselling_hrs_to_complete,
                    expiry_date,
                    incident_desc,
                    reasons,
                    types,
                    witness_list,
                }
            ) => ({
                doc,
                responsible_person_id: responsible_person && responsible_person.id,
                corrective_actions,
                counselling_hrs_to_complete,
                expiry_date: Dates.formatTimestampSQL(expiry_date),
                incident_desc,
                reasons,
                types,
                witness_list: {
                    data: witness_list ? witness_list.map(v => {
                        if (v.id) {
                            return {witness_id: v.id};
                        }
                        const {job_position} = v;
                        if (job_position) {
                            delete v.job_position;
                            v.job_position_id = job_position.id;
                        }
                        return {witness_external: {data: v}};
                    }) : []
                },
            }))
        },
        license_list: {
            data: (license_list || []).map((
                {
                    doc,
                    date,
                    expiry_date,
                    notes,
                }
            ) => ({
                doc,
                date: Dates.formatTimestampSQL(date),
                expiry_date: Dates.formatTimestampSQL(expiry_date),
                notes,
            }))
        },
        medical_list: {
            data: (medical_list || []).map((
                {
                    doc,
                    expiry_date,
                    restrictions,
                    annexture_3,
                }
            ) => ({
                doc,

                expiry_date: Dates.formatTimestampSQL(expiry_date),
                restrictions,
                annexture_3,
            }))
        },
        warning_list: {
            data: (warning_list || []).map((
                {
                    doc,
                    date,
                    details,
                    employee_comments,
                    expiry_date,
                    issued_by,
                    notes,
                    type,
                    witness_list,
                }
            ) => ({
                doc,
                date: Dates.formatTimestampSQL(date),
                details,
                employee_comments,
                expiry_date: Dates.formatTimestampSQL(expiry_date),
                issued_by_id: issued_by && issued_by.id,
                notes,
                type,
                witness_list: {
                    data: witness_list ? witness_list.map(v => {
                        if (v.id) {
                            return {witness_id: v.id};
                        }
                        const {job_position} = v;
                        if (job_position) {
                            delete v.job_position;
                            v.job_position_id = job_position.id;
                        }
                        return {witness_external: {data: v}};
                    }) : []
                },
            }))
        },
        work_permit_list: {
            data: (work_permit_list || []).map((
                {
                    doc,
                    date,
                    expiry_date,
                    notes,
                }
            ) => ({
                doc,

                date: Dates.formatDateSQL(date),
                expiry_date: Dates.formatDateSQL(expiry_date),
                notes,
            }))
        },
        job_appointment_list: {
            data: (job_appointment_list || []).map((
                {doc, date, expiry_date, notes,}
            ) => ({
                doc,
                date: Dates.formatTimestampSQL(date),
                expiry_date: Dates.formatTimestampSQL(expiry_date),
                notes,
            }))
        },
    };
};

const processDependantsAndNextOfKinFormData = (data) => {
    let {
        //
        next_of_kin_list,
        //
        dependent_list,
    } = data;

    return {
        next_of_kin_list: {data: next_of_kin_list || []},
        //
        dependent_list: {data: (dependent_list || []).map(v => ({...v, dob: Dates.formatTimestampSQL(v.dob)}))},
    }
};