const {createLicense} = require("../docs/licenses/create");
const {createCompetency} = require("../docs/competencies/create");
const {createContract} = require("../docs/contracts/create");
const {createMedical} = require("../docs/medicals/create");
const {createWorkPermit} = require("../docs/work-permits/create");
const {createJobAppointment} = require("../../structure-and-responsibility/job-appointments/create");
const {createCounselling} = require("../docs/counsellings/create");
const {createWarning} = require("../docs/warnings/create");
const {createTimeOff} = require("../docs/leaves/create");
const {createIDOrPassport} = require("../docs/documents/id-or-passports/create");
const {createPrDP} = require("../docs/documents/prdp/create");
const {createBankingDetail} = require("../docs/documents/banking-details/create");
const {createResidentialAddress} = require("../docs/documents/living-address/create");

exports.processFormData = (input) => {
    const data = {};
    Object.keys(input).filter(key => key !== "formData").forEach(key => {
        const formData = input[key];
        const fnName = `process${key.toTitleCase()}`;
        const processFn = funs[fnName];
        // console.log(key, fnName, processFn, formData);
        const formDataProcessed = processFn(formData);
        if (formDataProcessed) {
            Object.keys(formDataProcessed).forEach(key => {
                data[key] = formDataProcessed[key];
            });
        }
    });
    return data;
};

const processOptionalInfoFormData = (formData) => {
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
        banking_detail_list,
        next_of_kin_list,
        dependent_list,
    } = formData;

    return {
        //
        employment_date: Dates.formatDateSQL(employment_date),
        employment_num,
        job_position_id: job_position && job_position.id,
        department_id: department && department.id,
        //
        supervisor_id: supervisor && supervisor.id,
        supervisor_phone,
        supervisor_email,

        // living_address_list: {
        //     data: (living_address_list || []).map((
        //         {
        //             country,
        //             zone,
        //             city,
        //             local_address,
        //             street_address,
        //             doc
        //         }
        //     ) => ({
        //         is_default: true,
        //         //1
        //         country_id: country.id,
        //         zone_id: zone.id,
        //         city_id: city.id,
        //         local_address,
        //         street_address,
        //         //2
        //         doc,
        //     }))
        // },

        // banking_detail_list: {
        //     data: (banking_detail_list || []).map(({name, branch, code, account_num, doc}) => ({
        //         is_default: true,
        //         //1
        //         name,
        //         branch,
        //         code,
        //         account_num,
        //         //2
        //         doc,
        //     }))
        // },
        living_address_list,
        banking_detail_list,
        next_of_kin_list: {data: next_of_kin_list || []},
        dependent_list: {data: (dependent_list || []).map(v => ({...v, dob: Dates.formatTimestampSQL(v.dob)}))},
    }
};

const processDocumentsFormData = (formData) => {
    let {
        'document_list__ID/Passport': document_list__id_or_passport,//
        'document_list__PrDP': document_list__prdp,//
        // document_list__id_or_passport,//
        // document_list__prdp,//
        license_list,//

        competency_list,//
        contract_list,//
        medical_list,//
        work_permit_list,//
        job_appointment_list,//
    } = formData;
    //

    return {
        // document_list: {
        //     data: [
        //         ...(document_list__id_or_passport || []),
        //         ...(document_list__prdp || []),
        //     ].map((
        //         {
        //             type,
        //             expiry_date,
        //             doc,
        //         }
        //     ) => ({
        //         is_default: true,
        //         //1
        //         type,
        //         expiry_date: Dates.formatDateSQL(expiry_date),
        //         //2
        //         doc,
        //     })),
        // },
        // license_list: {
        //     data: (license_list || []).map((
        //         {
        //             doc,
        //             date,
        //             expiry_date,
        //             notes,
        //         }
        //     ) => ({
        //         doc,
        //         date: Dates.formatTimestampSQL(date),
        //         expiry_date: Dates.formatTimestampSQL(expiry_date),
        //         notes,
        //     }))
        // },
        //
        // competency_list: {
        //     data: (competency_list || []).map((
        //         {
        //             issued_date,
        //             expiry_date,
        //             type,
        //             competency_type,
        //             accreditation_num,
        //             training,
        //             doc
        //         }
        //     ) => ({
        //         issued_date: Dates.formatDateSQL(issued_date),
        //         expiry_date: Dates.formatDateSQL(expiry_date),
        //         type,
        //         competency_type,
        //         accreditation_num,
        //         training_id: training && training.id,
        //         doc,
        //     }))
        // },
        // contract_list: {
        //     data: (contract_list || []).map((
        //         {
        //             contractDetailsTab,
        //             salaryInfoTab,
        //             doc,
        //             job_profile_doc,
        //         }
        //     ) => {
        //         const contract_details = toNoneNullObject(contractDetailsTab.form.data);
        //         const salary_info = toNoneNullObject(salaryInfoTab.form.data);
        //
        //         const v = {
        //             doc,
        //             job_profile_doc,
        //         };
        //
        //         if (contract_details) {
        //             const {
        //                 contract_type,
        //                 start_date,
        //                 expiry_date,
        //                 end_of_trial_period,
        //                 start_time,
        //                 end_time,
        //                 daily_working_hours,
        //                 notes,
        //             } = contractDetailsTab.form.data;
        //             v.contract_details_list = {
        //                 data: [{
        //                     contract_type,
        //                     start_date: Dates.formatTimestampSQL(start_date),
        //                     expiry_date: Dates.formatTimestampSQL(expiry_date),
        //                     end_of_trial_period: Dates.formatTimestampSQL(end_of_trial_period),
        //                     start_time,
        //                     end_time,
        //                     daily_working_hours,
        //                     notes,
        //                 }],
        //             };
        //         }
        //
        //         if (salary_info) {
        //             const {
        //                 payment_type,
        //                 salary_interval,
        //                 salary,
        //                 wage,
        //                 deductible,//[{text, value}]
        //             } = salaryInfoTab.form.data;
        //
        //             const deductible_list = deductible ? deductible.list.filter(v => !!v && !!v.text && !!v.value) : [];
        //             v.salary_info_list = {
        //                 data: [{
        //                     payment_type,
        //                     salary_interval,
        //                     salary,
        //                     wage,
        //                     deductible_list: {data: deductible_list},//[{text, value}]
        //                 }],
        //             };
        //         }
        //
        //         return v;
        //     })
        // },
        // medical_list: {
        //     data: (medical_list || []).map((
        //         {
        //             doc,
        //             expiry_date,
        //             restrictions,
        //             annexture_3,
        //         }
        //     ) => ({
        //         doc,
        //
        //         expiry_date: Dates.formatTimestampSQL(expiry_date),
        //         restrictions,
        //         annexture_3,
        //     }))
        // },
        // work_permit_list: {
        //     data: (work_permit_list || []).map((
        //         {
        //             doc,
        //             date,
        //             expiry_date,
        //             notes,
        //         }
        //     ) => ({
        //         doc,
        //
        //         date: Dates.formatDateSQL(date),
        //         expiry_date: Dates.formatDateSQL(expiry_date),
        //         notes,
        //     }))
        // },
        // job_appointment_list: {
        //     data: (job_appointment_list || []).map((
        //         {doc, date, expiry_date, notes,}
        //     ) => ({
        //         doc,
        //         date: Dates.formatTimestampSQL(date),
        //         expiry_date: Dates.formatTimestampSQL(expiry_date),
        //         notes,
        //     }))
        // },
        //

        document_list__id_or_passport,
        document_list__prdp,
        license_list,

        competency_list,
        contract_list,
        medical_list,
        work_permit_list,
        job_appointment_list,
    };
};

const processWarningFormData = (formData) => {
    let {
        warning_list,
    } = formData;
    //

    return {
        warning_list,
        // warning_list: {
        //     data: (warning_list || []).map((
        //         {
        //             doc,
        //             date,
        //             details,
        //             employee_comments,
        //             expiry_date,
        //             issued_by,
        //             notes,
        //             type,
        //             witness_list,
        //         }
        //     ) => ({
        //         doc,
        //         date: Dates.formatTimestampSQL(date),
        //         details,
        //         employee_comments,
        //         expiry_date: Dates.formatTimestampSQL(expiry_date),
        //         issued_by_id: issued_by && issued_by.id,
        //         notes,
        //         type,
        //         witness_list: {
        //             data: witness_list ? witness_list.map(v => {
        //                 if (v.id) {
        //                     return {witness_id: v.id};
        //                 }
        //                 const {job_position} = v;
        //                 if (job_position) {
        //                     delete v.job_position;
        //                     v.job_position_id = job_position.id;
        //                 }
        //                 return {witness_external: {data: v}};
        //             }) : []
        //         },
        //     }))
        // },
    };
};

const processTimeOffFormData = (formData) => {
    let {
        leave_list,
    } = formData;
    //

    return {
        leave_list,
        // leave_list: {
        //     data: (leave_list || []).map((
        //         {
        //             doc,
        //             date,
        //             days_booked,
        //             due_to,
        //             employee_comments,
        //             expiry_date,
        //             notes,
        //             reason,
        //             type,
        //         }
        //     ) => ({
        //         doc,
        //         date: Dates.formatTimestampSQL(date),
        //         days_booked,
        //         due_to: due_to || 'Occurred Incident',
        //         employee_comments,
        //         expiry_date: Dates.formatTimestampSQL(expiry_date),
        //         notes,
        //         reason,
        //         type,
        //     }))
        // },
    };
};

const funs = {
    processOptionalInfoFormData,
    processDocumentsFormData,
    processCounselingFormData: formData => formData,
    processWarningFormData,
    processTimeOffFormData,
};

exports.listCreateFuns = {
    living_address_list: createResidentialAddress,
    banking_detail_list: createBankingDetail,

    // document_list: createIDOrPassport, createPrDP,
    document_list__id_or_passport: createIDOrPassport,
    document_list__prdp: createPrDP,

    license_list: createLicense,

    competency_list: createCompetency,
    contract_list: createContract,
    medical_list: createMedical,
    work_permit_list: createWorkPermit,
    job_appointment_list: createJobAppointment,

    counselling_list: createCounselling,
    warning_list: createWarning,
    leave_list: createTimeOff,
};
