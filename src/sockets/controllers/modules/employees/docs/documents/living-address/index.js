const findByIdImpl = require("../../../../findByIdImpl");
const updateImpl = require("../../../../updateImpl");
const {createResidentialAddress} = require("./create");

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
    orgs_fragment: null,
    uploadUpdate: ({id, data: {employee}}) => ({
        new_name: `employees/${employee.id}/docs/living_address-${id}-${Dates.formatTimestamp(new Date())}`,
        key: 'doc',
    }),
};

const path = 'employees/documents/living-address';

eventManager.on(`${path}/create`, createResidentialAddress);

eventManager.on(`${path}/update`, updateImpl(args));

eventManager.on(`${path}/findById`, findByIdImpl(args));
