const updateImpl = require("../../updateImpl");
const {employee_details_fragment} = require("./commons");
const {findByEmailDuplicateEmployee, findByPhoneDuplicateEmployee} = require("./query_employees");

const args = {
    name: "Employee",
    tbl: "hr_employees",
    details_fragment: employee_details_fragment,
};

//<editor-fold desc="updateEmployee">
exports.updateEmployee = async (socket, attrs) => {
    const {
        id,
        email,
        phone,
        profile_pic,
        //
        living_address_list,//[doc]
        banking_detail_list,//[doc]
        document_list,//[doc]
        //
        competency_list,//[doc]
        contract_list,//[doc]
        counselling_list,//[doc]
        leave_list,//[doc]
        license_list,//[doc]
        medical_list,//[doc]
        warning_list,//[doc]
        work_permit_list,//[doc]
        job_appointment_list,//[doc]
    } = attrs;

    const dbUser = await checkByIdStaff(id);
    if (!dbUser) return;

    if (email) {
        const existingUser = await findByEmailDuplicateEmployee(socket, {id, email});
        if (existingUser) {
            return "EMAIL_DUP";
        }
    }
    if (phone) {
        const existingUser = await findByPhoneDuplicateEmployee(socket,{id, phone});
        if (existingUser) {
            return "PHONE_DUP";
        }
    }

    const update = updateImpl(args);
    return update(socket, {
        ...attrs, id,
    });
};
//</editor-fold>
