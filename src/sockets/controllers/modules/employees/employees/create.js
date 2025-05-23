const {v4: uuidv4} = require('uuid');
const createImpl = require("../../createImpl");
const updateImpl = require("../../updateImpl");
const {employee_details_fragment} = require("./commons");
const {
    processOptionalInfoFormData,
    processDocumentsFormData,
    processCounselingFormData,
    processFormData, listCreateFuns
} = require("./create_processing");
const {checkExistByDocsUploadComplete, findByIdEmployee} = require("./query_employees");

const args = {
    name: "Employee",
    tbl: "hr_employees",
    details_fragment: employee_details_fragment,
    uploadUpdate: ({id}) => ({
        new_name: `employees/${id}/profile-pic`,
        key: 'profile_pic',
    }),
    // uploadUpdateLists: ({id}) => [
    //     {
    //         tbl: 'hr_employees_docs_warnings',
    //         listName: 'warning_list',
    //         key: 'doc',
    //         new_name: `employees/${employee.id}/docs/warnings/${id}/Warning-doc-${Dates.formatTimestamp(new Date()).replaceAll(':','-').replaceAll(' ','-')}`,
    //
    //     },
    // ],
};

//<editor-fold desc="createEmployee">
exports.createEmployee = async (socket, inputRaw) => {
    const is = await socket.is();
    if (!is) return;

    const {session} = socket.request;

    if (inputRaw === "START") {
        session.newEmployeeInput = {};
        session.save();
        return;
    }
    if (!isString(inputRaw)) {
        if (
            'formData' in inputRaw &&
            'optionalInfoFormData' in inputRaw
        ) {
            session.newEmployeeInput.formData = inputRaw.formData;
            if (inputRaw.optionalInfoFormData) {
                session.newEmployeeInput.optionalInfoFormData = inputRaw.optionalInfoFormData;
            }
            session.save();
            return;
        }

        //NB: Saved separately
        // if ('counselingFormData' in inputRaw) {
        //     if (inputRaw.counselingFormData) {
        //         session.newEmployeeInput.counselingFormData = inputRaw.counselingFormData;
        //     }
        //     session.save();
        //     return;
        // }
        //NB: Saved separately
        // if ('warningFormData' in inputRaw) {
        //     if (inputRaw.warningFormData) {
        //         session.newEmployeeInput.warningFormData = inputRaw.warningFormData;
        //     }
        //     session.save();
        //     return;
        // }
        //NB: Saved separately
        // if ('timeOffFormData' in inputRaw) {
        //     if (inputRaw.timeOffFormData) {
        //         session.newEmployeeInput.timeOffFormData = inputRaw.timeOffFormData;
        //     }
        //     session.save();
        //     return;
        // }

        // if ('documentsFormData' in inputRaw) {
        //     if (inputRaw.documentsFormData) {
        //         session.newEmployeeInput.documentsFormData = inputRaw.documentsFormData;
        //     }
        //     session.save();
        //     return;
        // }

        if (!session.newEmployeeInput.documentsFormData) {
            session.newEmployeeInput.documentsFormData = {};
            session.save();
        }

        if ('document_list__ID/Passport' in inputRaw || 'document_list__id_or_passport' in inputRaw) {
            if (inputRaw['document_list__ID/Passport']) {
                session.newEmployeeInput.documentsFormData['document_list__ID/Passport'] = inputRaw['document_list__ID/Passport'];
            } else if (inputRaw['document_list__id_or_passport']) {
                session.newEmployeeInput.documentsFormData['document_list__ID/Passport'] = inputRaw['document_list__id_or_passport'];
            }
            session.save();
            return;
        }
        if ('document_list__PrDP' in inputRaw || 'document_list__prdp' in inputRaw) {
            if (inputRaw['document_list__PrDP']) {
                session.newEmployeeInput.documentsFormData['document_list__PrDP'] = inputRaw['document_list__PrDP'];
            } else if (inputRaw['document_list__prdp']) {
                session.newEmployeeInput.documentsFormData['document_list__PrDP'] = inputRaw['document_list__prdp'];
            }
            session.save();
            return;
        }
        if ('license_list' in inputRaw) {
            if (inputRaw.license_list) {
                session.newEmployeeInput.documentsFormData.license_list = inputRaw.license_list;
            }
            session.save();
            return;
        }
        if ('competency_list' in inputRaw) {
            if (inputRaw.competency_list) {
                session.newEmployeeInput.documentsFormData.competency_list = inputRaw.competency_list;
            }
            session.save();
            return;
        }
        if ('contract_list' in inputRaw) {
            if (inputRaw.contract_list) {
                session.newEmployeeInput.documentsFormData.contract_list = inputRaw.contract_list;
            }
            session.save();
            return;
        }
        if ('medical_list' in inputRaw) {
            if (inputRaw.medical_list) {
                session.newEmployeeInput.documentsFormData.medical_list = inputRaw.medical_list;
            }
            session.save();
            return;
        }
        if ('work_permit_list' in inputRaw) {
            if (inputRaw.work_permit_list) {
                session.newEmployeeInput.documentsFormData.work_permit_list = inputRaw.work_permit_list;
            }
            session.save();
            return;
        }
        if ('job_appointment_list' in inputRaw) {
            if (inputRaw.job_appointment_list) {
                session.newEmployeeInput.documentsFormData.job_appointment_list = inputRaw.job_appointment_list;
            }
            session.save();
            return;
        }
    }

    const {newEmployeeInput: input} = session;
    if (inputRaw === "END") {
        delete session.newEmployeeInput;
        session.save();
        //continue
    }

    const {isContractor} = is;

    const {
        formData,
        optionalInfoFormData,
        documentsFormData,
        counselingFormData,
        warningFormData,
        timeOffFormData,
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

    // console.log('input', input);

    const newData = processFormData(input);
    const newDataSavedLater = {};
    Object.keys(newData).forEach(key => {
        if (
            (
                key.endsWith("_list") &&
                !['next_of_kin_list', 'dependent_list'].contains(key)
            ) ||
            ['document_list__id_or_passport', 'document_list__prdp'].contains(key)
        ) {
            newDataSavedLater[key] = newData[key];
            delete newData[key];
        }
    });

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

        ...newData,

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

    // console.log(optionalInfoFormData, documentsFormData, counselingFormData, warningFormData, timeOffFormData)
    // const compliance_requirements = toNoneNullObject(specificComplianceRequirementsSection.form.data);
    // if (compliance_requirements) {
    //     data.compliance_requirements = compliance_requirements.list;
    // }

    ////////////////

    if (email) {
        const existingUser = await checkByUsernameStaff(email);
        if (existingUser) {
            return "EMAIL_DUP";
        }
    }
    if (phone) {
        const existingUser = await checkByPhoneStaff(phone);
        if (existingUser) {
            return "PHONE_DUP";
        }
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

        const promises = [];
        if (data.linked_user_id) {
            const _updateUser = updateImpl({
                name: "User",
                tbl: "default_users",
                details_fragment: `
                    id
                `,
            });

            promises.push(_updateUser(socket, {
                id: data.linked_user_id,
                linked_employee_id: id,
            }));
        }

        const newDataSavedLaterKeys = Object.keys(newDataSavedLater);
        if (newDataSavedLaterKeys.isNotEmpty()) {
            promises.push(...newDataSavedLaterKeys.map(async key => {
                const list = newDataSavedLater[key];
                // console.log(key, list);
                if (list) {
                    const create = listCreateFuns[key];
                    if (create) {
                        return Promise.all(list.map(async input => {
                            return create(socket, {
                                formData: {
                                    employee_id: id,
                                    employee: {id},
                                    ...input,
                                },
                            });
                        }));
                    }
                }
            }));
        }

        console.log('new employee process count', promises.length);
        for (let n = 0; n < promises.length; n++) {
            const promise = promises[n];
            console.log('new employee process', n + 1);
            const res = await promise;
            console.log('new employee process', n + 1, 'res', res.id);
        }

        console.log('savedItem1', savedItem);
        // console.log('savedItem2', await findByIdEmployee(id));

        // console.log('new employee response', res);

        // return execWhenWithInterval(async () => await checkExistByDocsUploadComplete(socket, id), 500).then(exist => {
        //     console.log('exist', exist)
        //     return findByIdEmployee(id);
        // });
        return findByIdEmployee(id);
    }

    console.log('savedItem3', savedItem);

    return savedItem;
};
//</editor-fold>
