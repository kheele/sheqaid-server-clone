const findByIdImpl = require('../../findByIdImpl');
const listHRDocsByLogged = require('./listHRDocsByLogged');
const {
    getHRDocsDashboardFragment, hrDocsDashboardMapResults
} = require("../../employees/docs/hrDocsDashboardImpl");
const {findByIdEmployeeDashboardStats} = require("../../findByIdEmployeeDashboardStatsImpl");
const {
    getDateRangeDashboardFragment
} = require("../../employees/docs/hrDocsDateRangeDashboardImpl");
const {findByIdEmployeeDateRangeDashboardStats} = require("../../findByIdEmployeeDateRangeDashboardStatsImpl");
const {findByIdOrgDashboardStatsImpl} = require("../../findByIdOrgDashboardStatsImpl");
const {findByIdOrgDateRangeDashboardStatsImpl} = require("../../findByIdOrgDateRangeDashboardStatsImpl");
const {inc_fragment} = require("./commons");
const updateImpl = require("../../updateImpl");
const {createJobAppointment} = require("./create");

const args = {
    name: "JobAppointment",
    tbl: "hr_employees_docs_job_appointments",
    details_fragment: inc_fragment({inc_employee: true}),
    uploadUpdate: ({id, data: {employee}}) => ({
        new_name: `employees/${employee.id}/docs/job_appointments/${id}/Job-Appointment-doc-${Dates.formatTimestamp(new Date())}`,
        key: 'doc',
    }),
};

const path = "structure-and-responsibility/job-appointments";

eventManager.on(`${path}/create`, createJobAppointment);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listHRDocsByLogged);

eventManager.on(`${path}/dashboard/single`, findByIdEmployeeDashboardStats({
    name: "JobAppointments",
    listName: "job_appointment_list",
}));

eventManager.on(`${path}/dashboard/date-range/single`, findByIdEmployeeDateRangeDashboardStats({
    name: "JobAppointments",
    listName: "job_appointment_list",
}));

eventManager.on(`${path}/dashboard`, findByIdOrgDashboardStatsImpl({
    name: "JobAppointments",
    listName: "job_appointment_list",
    details_fragment: getHRDocsDashboardFragment("job_appointment_list"),
    mapResults: hrDocsDashboardMapResults,
}));

eventManager.on(`${path}/dashboard/date-range`, findByIdOrgDateRangeDashboardStatsImpl({
    name: "JobAppointments",
    listName: "job_appointment_list",
    details_fragment: getDateRangeDashboardFragment("job_appointment_list"),
}));