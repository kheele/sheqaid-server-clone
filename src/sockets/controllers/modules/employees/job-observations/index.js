require('./templates');

const findByIdImpl = require('../../findByIdImpl');
const listByLoggedImpl = require('../../listByLoggedImpl');
const {
    job_observation_details_find_fragment,
    job_observation_details_list_fragment,
    getVariablesAndQueryConfig,
} = require("./commons");
const {createJobObservation} = require("./create");
const {updateJobObservation} = require("./update");

const args = {
    name: "JobObservationQuestionnaire",
    tbl: "default_contractor_questionnaires",
    order_by: "order_by: {employee: {full_name: asc}, employee_other: {full_name: asc}}",
    details_fragment: job_observation_details_find_fragment,
    getVariablesAndQueryConfig,
};

const path = "job-observations";

eventManager.on(`${path}/create`, createJobObservation);

eventManager.on(`${path}/update`, updateJobObservation);

eventManager.on(`${path}/findById`, findByIdImpl(args));

eventManager.on(`${path}/listByLogged`, listByLoggedImpl({
    ...args,
    details_fragment: job_observation_details_list_fragment,
    where: ({data, filters}) => {
        const {
            removed = false,
            //
            employee_id,
        } = data;

        let {filter} = filters;
        let newFilter = [
            `group: {_eq: "Job Observations"}`,
            `is_template: {_eq: false}`,
        ];
        if (employee_id) {
            newFilter.push(`employee_id:{_eq: ${employee_id}}`);
        }

        if(newFilter.isNotEmpty()) {
            newFilter = newFilter.join(', ');
            filter = filter ? `${filter}, ${newFilter}` : newFilter;
        }

        return filter;
    },
}));
