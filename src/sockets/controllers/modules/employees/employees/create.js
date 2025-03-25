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
    //         new_name: `employees/${employee.id}/docs/warnings/${id}/Warning-doc-${Dates.formatTimestamp(new Date())}`,
    //
    //     },
    // ],
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

    const newData = processFormData(input);
    const newDataSavedLater = {};
    Object.keys(newData).forEach(key => {
        if (
            key.endsWith("_list") &&
            !['next_of_kin_list', 'dependent_list'].contains(key)
        ) {
            newDataSavedLater[key] = newData[key];
            delete newData[key];
        }
    })

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

        const res = await Promise.all(promises);
        // console.log('new employee response', res);

        // return execWhenWithInterval(async () => await checkExistByDocsUploadComplete(socket, id), 500).then(exist => {
        //     console.log('exist', exist)
        //     return findByIdEmployee(id);
        // });
        return findByIdEmployee(id);
    }

    return savedItem;
};
//</editor-fold>
