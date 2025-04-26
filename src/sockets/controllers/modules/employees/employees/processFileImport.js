
//<editor-fold desc="processFileImport">
const {onReadAsJson} = require("../../../default/excel/api");
exports.processFileImport = async (socket, file) => {
    const res = await onReadAsJson({path: file, validHeaderNames});//{errors}

    console.log(res)
    // const res = await excelUtils.read(path, validHeaderNames);
    // if (res.errors) {
    //     return res;
    // }
    //
    // res.sortBy('lname');
    // return res.distinct();
    return res;
};
//</editor-fold>

const validHeaderNames = [
    {key: 'fname', value: ['First Name', 'Name'], required: true},
    {key: 'lname', value: ['Last Name', 'Surname'], required: true},
    {
        key: 'id_num',
        value: [
            'Identity Number', 'Identity No', 'Identity No.', 'Identity #',
            'ID', 'ID Number', 'ID No', 'ID No.', 'ID #'
        ]
    },
    {
        key: 'passport_num',
        value: [
            'Passport Number', 'Passport', 'Passport No', 'Passport No.', 'Passport #'
        ]
    },
    {
        key: 'id_or_pass_num',
        value: [
            'Identity/Passport Number', 'Identity/Passport No', 'Identity/Passport No.', 'Identity/Passport #',
            'Passport/Identity Number', 'Passport/Identity No', 'Passport/Identity No.', 'Passport/Identity #',
            'ID/Passport Number', 'ID/Passport No', 'ID/Passport No.', 'ID/Passport #',
            'Passport/ID Number', 'Passport/ID No', 'Passport/ID No.', 'Passport/ID #'
        ]
    },
    {key: 'sex', value: ['Gender', 'Sex']},
    {key: 'dob', value: ['Date Of Birth', 'Birth Date', 'DOB', 'D.O.B', 'D.O.B.']},
    {
        key: 'phone',
        value: [
            'Phone', 'Phone Number', 'Phone No', 'Phone No.', 'Phone #',
            'Contact Number', 'Contact No', 'Contact No.', 'Contact #',
            'Cell', 'Cell Number', 'Cell No', 'Cell No.', 'Cell #'
        ]
    },
    {key: 'email', value: ['Email Address', 'Email']},
    {
        key: 'employment_num',
        value: [
            'Employment Number', 'Employment No', 'Employment No.', 'Employment #',
            'Employee Number', 'Employee No', 'Employee No.', 'Employee #',
            'Company Number', 'Company No', 'Company No.', 'Company #'
        ]
    },
    {
        key: 'employment_date',
        value: [
            'Date Engaged', 'Date Employed',
            'Date of Employment', 'Date of Engagement',
            'Engagement Date', 'Employment Date'
        ]
    },
    {key: 'job_position', value: ['Job Position', 'Job Title']},
    {key: 'job_category', value: ['Job Category', 'Occupational Level']},
    {key: 'department', value: ['Department', 'Department Title', 'Department Name']}
];