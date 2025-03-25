const createImpl = require("../../../../createImpl");

const args = {
    name: "EmployeeDocLivingAddress",
    tbl: "hr_employees_living_address",
    details_fragment: `
        id
        is_default
        doc
        local_address
        street_address
        employee_id
        employee{
            id
        }
        city{
            id
            name
        }
        zone{
            id
            name
        }
        country{
            id
            name
        }
    `,
    uploadUpdate: ({id, data: {employee}}) => ({
        new_name: `employees/${employee.id}/docs/residential-addresses/residential-address-${id}-${Dates.formatTimestamp(new Date())}`,
        key: 'doc',
    }),
    orgs_fragment: null,
    skipOrgs: true,
    skipUsers: true,
};

//<editor-fold desc="createResidentialAddress">
exports.createResidentialAddress = async (socket, input) => {
    const is = await socket.is();
    if (!is) return;

    const {isContractor} = is;

    const {
        formData,
    } = input;

    const {
        employee_id,
        //1
        country,
        zone,
        city,
        local_address,
        street_address,
        //2
        doc,
    } = formData;

    const data = {
        employee_id,
        is_default: true,
        //1
        country_id: country.id,
        zone_id: zone && zone.id,
        city_id: city && city.id,
        local_address,
        street_address,
        //2
        doc,

        // contractor_user_id: contractor_user && contractor_user.id,
    };

    const create = createImpl(args);
    return create(socket, data);
};
//</editor-fold>
